from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("WHISPER_KEY"),
)

def get_transcript(filepath):
  audio_file= open(filepath, "rb")
  transcription = client.audio.transcriptions.create(
    model="whisper-1", 
    file=audio_file
  )
  if len(transcription.text) < 10:
    return None
  return transcription.text
