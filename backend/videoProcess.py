from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from hume import HumeBatchClient
from hume.models.config import FaceConfig
from starlette.websockets import WebSocketDisconnect, WebSocketState
import socketio, uvicorn, tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
app_sio = socketio.ASGIApp(sio, other_asgi_app=app, socketio_path="/socket.io")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            data = await websocket.receive_bytes()
            filename = ""
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpeg") as phil:
                phil.write(data)
                filename = phil.name

            client = HumeBatchClient("YqYVsbGjAb8AnUQCrcccymbg9d953CtKhI4PW9A4VRIQCQss")
            config = FaceConfig(identify_faces=True)
            job = client.submit_job(None, [config], files=[filename])
            job.await_complete()
            print("Predictions:", job.get_predictions())

        except WebSocketDisconnect:
            print("Websocket disconnected")
            break
        except Exception as e:
            print(f"Error during processing: {e}")
            if websocket.application_state == WebSocketState.CONNECTED:
                await websocket.send_text(f"Error during processing{e}")
    # try:
    #     video_data = await file.read()

        # hume_api_url =
# import asyncio

# from hume import HumeStreamClient, StreamSocket
# from hume.models.config import FaceConfig

# async def main():
#     client = HumeStreamClient("YqYVsbGjAb8AnUQCrcccymbg9d953CtKhI4PW9A4VRIQCQss")
#     config = FaceConfig(identify_faces=True)
#     async with client.connect([config]) as socket:
#         result = await socket.send_file("<your-image-filepath>")
#         socket.reset_stream
#         print(result)

# asyncio.run(main())
if __name__ == "__main__":
    uvicorn.run(app_sio, host="0.0.0.0", port=8000)