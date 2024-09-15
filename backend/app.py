from fastapi import FastAPI, HTTPException, Form
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from fastapi import BackgroundTasks, FastAPI, HTTPException, Form 
# from fastapi_utils.tasks import repeat_every
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from openai import OpenAI
import json
import uuid
from io import BytesIO
from dotenv import load_dotenv
from datetime import datetime
import wav
from fastapi.middleware.cors import CORSMiddleware
import requests
import json 

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
transcript = ""
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
    
    
def return_title():
    
    client = OpenAI()
    assistant = client.beta.assistants.create(
        name="Personal Helper",
        instructions="The person asking questions is John Doe. You are talking to him. You have his entire medical information file. You have to take the most recent object in the array of past convos and summarise it to give it a unique heading",
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
                "content": "You have to take the most recent messages array object in the array of past convos and give it a unique heading from the data files provided. Response can have a maximum of 5 words."
            },
        ]
    )

    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id,
        assistant_id=assistant.id,
        instructions= "You have to take the most recent messages array object in the array of past convos and give it a unique heading from the data files provided. Response can have a maximum of 5 words.",
    )

    if run.status == 'completed':
        messages = client.beta.threads.messages.list(
            thread_id=thread.id,
            run_id=run.id
        )
        answer = messages.data[0].content[0].text.value
        print(answer)
        return answer
    
    
@app.post("/update_conversation_title/")
async def update_conversation_title(
    email: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...)
):
    # Fetch the most recent conversation for this user
    user = collection.find_one(
        {"email": email, "first_name": first_name, "last_name": last_name},
        {"past_convos": {"$slice": -1}}  # Get the last conversation
    )

    if not user or "past_convos" not in user or len(user["past_convos"]) == 0:
        raise HTTPException(status_code=404, detail="No conversation found for the user")

    # Retrieve the most recent conversation
    latest_conversation = user["past_convos"][0]

    # Generate a new title using the return_title function
    new_title = return_title()

    # Update the title of the most recent conversation
    result = collection.update_one(
        {
            "email": email, 
            "first_name": first_name, 
            "last_name": last_name, 
            "past_convos.title": latest_conversation["title"]
        },
        {
            "$set": {"past_convos.$.title": new_title}
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Failed to update the conversation title")
    
    export_and_upload_to_vector_store()

    return {"status": "Conversation title updated successfully", "new_title": new_title}
    
@app.get("/get_history")
async def get_history(email: str, first_name: str, last_name: str):

    query_result = collection.find_one(
        {"email": email, "first_name": first_name, "last_name": last_name},
        {"past_convos.date": 1, "past_convos.title": 1, "_id": 0}
    )

    if query_result:
        # Extract only the 'date' and 'title' fields from each past convo
        past_convos = query_result.get("past_convos", [])
        return [{"date": convo.get("date"), "title": convo.get("title")} for convo in past_convos]
    else:
        return []

    
@app.post("/get_answer/")
async def get_answer(
    email: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    question: str = Form(...)
):
    # Fetch the most recent conversation for this user to get the unique_id (title)
    user = collection.find_one(
        {"email": email, "first_name": first_name, "last_name": last_name},
        {"past_convos": {"$slice": -1}}  # Get the last conversation
    )

    if not user or "past_convos" not in user or len(user["past_convos"]) == 0:
        raise HTTPException(status_code=404, detail="No conversation found for the user")

    # Retrieve the unique ID (title) from the most recent conversation
    latest_conversation = user["past_convos"][0]
    unique_id = latest_conversation["title"]

    # Process the question and generate the answer
    final_answer = return_answer(question)

    # Update the latest conversation with the question and answer
    result = collection.update_one(
        {
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "past_convos.title": unique_id  # Match using the unique ID (title)
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
    
def generate_unique_id():
    return str(uuid.uuid4())
        
@app.post("/create_conversation/")
async def create_conversation(
    email: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
):

    current_date = datetime.utcnow().strftime('%m/%d/%y')
    unique_id = generate_unique_id()

    new_conversation = {
        "date": current_date,
        "title": unique_id,
        "messages": [],
    }

    result = collection.update_one(
        {"email": email, "first_name": first_name, "last_name": last_name},
        {"$push": {"past_convos": new_conversation}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return unique_id

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



@app.get("/start-recording/")
async def start_recording(background_tasks: BackgroundTasks, email: str, first_name: str, last_name: str):
    current_date = datetime.utcnow().strftime('%m/%d/%y')
    unique_id = generate_unique_id()

    new_conversation = {
        "date": current_date,
        "title": unique_id,
        "messages": [],
    }

    result = collection.update_one(
        {"email": email, "first_name": first_name, "last_name": last_name},
        {"$push": {"past_convos": new_conversation}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    global recording
    recording = True
    background_tasks.add_task(poll_transcript(email, first_name, last_name))

    
def poll_transcript(email: str, first_name: str, last_name: str):
    global recording
    global transcript
    recording = True
    while recording:
        while recording:
            last_ten = wav.record_audio_and_get_transcript()
            if last_ten is not None:
                transcript += last_ten
            else:
                break
        
        user = collection.find_one(
            {"email": email, "first_name": first_name, "last_name": last_name},
            {"past_convos": {"$slice": -1}}  # Get the last conversation
        )

        if not user or "past_convos" not in user or len(user["past_convos"]) == 0:
            raise HTTPException(status_code=404, detail="No conversation found for the user")

        # Retrieve the unique ID (title) from the most recent conversation
        latest_conversation = user["past_convos"][0]
        unique_id = latest_conversation["title"]

        # Process the question and generate the answer
        final_answer = return_answer(transcript)
        

        # Update the latest conversation with the question and answer
        result = collection.update_one(
            {
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "past_convos.title": unique_id  # Match using the unique ID (title)
            },
            {
                "$push": {
                    "past_convos.$.messages": [
                        {"role": "user", "content": transcript},
                        {"role": "assistant", "content": final_answer}
                    ]
                }
            }
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            export_and_upload_to_vector_store()
        
        print(transcript)
        
        transcript = ""
        print("polling for non-silence")
        while recording:
            last_ten = wav.record_audio_and_get_transcript()
            if last_ten is not None:
                transcript += last_ten
                break
        print("returning to ")
    print("done")
    
    
    
@app.get("/test/")
async def test():
    res = requests.get('http://localhost:3000/test/')
    print(res.text)
    

@app.get("/stop-recording/")
async def stop_recording(email: str, first_name: str, last_name: str):
    global recording
    recording = False
    user = collection.find_one(
        {"email": email, "first_name": first_name, "last_name": last_name},
        {"past_convos": {"$slice": -1}}  # Get the last conversation
    )

    if not user or "past_convos" not in user or len(user["past_convos"]) == 0:
        raise HTTPException(status_code=404, detail="No conversation found for the user")

    latest_conversation = user["past_convos"][0]

    new_title = return_title()

    result = collection.update_one(
        {
            "email": email, 
            "first_name": first_name, 
            "last_name": last_name, 
            "past_convos.title": latest_conversation["title"]
        },
        {
            "$set": {"past_convos.$.title": new_title}
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Failed to update the conversation title")
    
    export_and_upload_to_vector_store()
    
    print(recording)

@app.get("/")
def root():
    return {"message" : transcript}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
