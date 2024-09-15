from fastapi import FastAPI, HTTPException, Form
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from fastapi import BackgroundTasks, FastAPI, HTTPException, Form 
# from fastapi_utils.tasks import repeat_every
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from openai import OpenAI
import json
from io import BytesIO
from dotenv import load_dotenv
from datetime import datetime
import wav
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
scheduler = BackgroundScheduler()
scheduler.start()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup
uri = "mongodb+srv://sh33thal24:7CGH0tmrDIsD9QrE@cluster0.klphh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["aida"]
collection = db["users"]
transcript = None
recording = True

load_dotenv()

client = OpenAI()

def export_and_upload_to_vector_store():
    def export_to_json():
        data = list(collection.find())
        for item in data:
            item['_id'] = str(item['_id'])
        json_bytes = json.dumps(data).encode('utf-8')
        return BytesIO(json_bytes)

    def create_file(file_contents):
        client = OpenAI()
        file3 = client.files.create(
            file=("data.json", file_contents, "application/json"),
            purpose="assistants"
        )
        return file3

    def create_and_upload_vector_store_file(file_id):
        client = OpenAI()
        vector_store_files = client.beta.vector_stores.files.list(vector_store_id='vs_r70jSDRJR1LyHTCChmWyKTGd')
        for vector_store_file in vector_store_files:
            deleted = client.beta.vector_stores.files.delete(
                vector_store_id='vs_r70jSDRJR1LyHTCChmWyKTGd',
                file_id=vector_store_file.id
            )
            print("deleted", deleted.id)
        vector_store_file = client.beta.vector_stores.files.create(
            vector_store_id='vs_r70jSDRJR1LyHTCChmWyKTGd',
            file_id=file_id
        )

        vector_store_files = client.beta.vector_stores.files.list(
            vector_store_id="vs_r70jSDRJR1LyHTCChmWyKTGd"
        )
        print(vector_store_files)

        return vector_store_file

    json_file_contents = export_to_json()
    created_file = create_file(json_file_contents)
    vector_store_file = create_and_upload_vector_store_file(created_file.id)

    return vector_store_file

def return_answer(question):
    
    client = OpenAI()
    assistant = client.beta.assistants.create(
        name="Personal Helper",
        instructions="The person asking questions is John Doe. You are talking to him. You have his entire medical information and from the information you have you are to be his medical advisor.",
        model="gpt-4-turbo",
        tools=[{"type": "file_search"}],
    )

    assistant = client.beta.assistants.update(
        assistant_id=assistant.id,
        tool_resources={"file_search": {"vector_store_ids": ['vs_r70jSDRJR1LyHTCChmWyKTGd']}},
    )

    thread = client.beta.threads.create(
        messages=[
            {
                "role": "user",
                "content": "Answer the following questions from the data files provided, keeping in mind that the user is John Doe. He talks in first person. Give him medical advice with the data files in context "
            },
            {
                "role": "user",
                "content": question,
            }
        ]
    )

    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id,
        assistant_id=assistant.id,
        instructions= question,
    )

    if run.status == 'completed':
        messages = client.beta.threads.messages.list(
            thread_id=thread.id,
            run_id=run.id
        )
        answer = messages.data[0].content[0].text.value
        return answer
    
@app.post("/get_answer/")
async def get_answer(
    email: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    question: str = Form(...),
    title: str = Form(...)
):
    final_answer = return_answer(question)

    result = collection.update_one(
        {
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "past_convos.title": title
        },
        {
            "$push": {
                "past_convos.$.messages": [
                    {"role": "user", "content": question},
                    {"role": "assistant", "content": final_answer}
                ]
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        export_and_upload_to_vector_store()
        return {"answer": final_answer}
        
@app.post("/create_conversation/")
async def create_conversation(
    email: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
):

    current_date = datetime.utcnow().strftime('%m/%d/%y')

    new_conversation = {
        "date": current_date,
        "title": "",
        "messages": [],
    }

    result = collection.update_one(
        {"email": email, "first_name": first_name, "last_name": last_name},
        {"$push": {"past_convos": new_conversation}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"status": "Conversation created successfully"}

@app.post("/new-medical-history/")
async def insert_medical_history(
    email: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    disease: str = Form(...),
    severity: int = Form(...),
    probability: int = Form(...)
):
    medical_history_data = {
        'disease': disease,
        'severity': severity,
        'probability': probability
    }

    # find user by email, first name, last name, and push new medical history
    result = collection.update_one(
        {'email': email, 'first_name': first_name, 'last_name': last_name},
        {'$push': {'medical_history': medical_history_data}}
    )

    export_and_upload_to_vector_store()

    return {"status": "Medical history inserted successfully"}

@app.get("/api/chat_history")
async def get_chat_history(email: str, first_name: str, last_name: str):
    user = collection.find_one({"email": email, "first_name": first_name, "last_name": last_name})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    chat_history = user.get("past_convos", [])
    return chat_history

@app.post("/create_conversation/")
async def create_conversation(
    email: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    title: str = Form(...)
):
    current_date = datetime.utcnow().strftime('%m/%d/%y')

    new_conversation = {
        "date": current_date,
        "title": title,
        "messages": [],
    }

    result = collection.update_one(
        {"email": email, "first_name": first_name, "last_name": last_name},
        {"$push": {"past_convos": new_conversation}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"status": "Conversation created successfully"}
@app.get("/start-recording/")
async def start_recording(background_tasks: BackgroundTasks):
    global recording
    recording = True
    background_tasks.add_task(poll_transcript)

    
def poll_transcript():
    global recording
    recording = True
    while recording:
        global transcript
        last_ten = wav.record_audio_and_get_transcript()
        if last_ten:
            transcript += last_ten
        else:
            break
        # print(recording)

@app.get("/stop-recording/")
async def stop_recording():
    global recording
    recording = False
    print(recording)

@app.get("/")
def root():
    return transcript

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
