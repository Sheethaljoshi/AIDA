import sounddevice as sd
import numpy as np
import time
from scipy.io.wavfile import write

import sounddevice as sd

import whisper
# List all available sound devices
# devices = sd.query_devices()

# Print the list of devices
# for device in devices:
#     print(device)

def record_audio(duration, filename, samplerate=44100):
    """
    Records audio from the computer and saves it as a WAV file.

    :param duration: Duration of the recording in seconds.
    :param filename: Name of the file to save the recording.
    :param samplerate: Sample rate of the audio recording.
    """
    print("Recording...")
    audio_data = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype='int16')
    sd.wait()  # Wait until recording is finished
    write(filename, samplerate, audio_data)
    print(f"Audio saved as {filename}")

def record_audio_and_get_transcript():
    duration = 10  # Duration in seconds
    filename = 'output.wav'  # Output file name
    record_audio(duration, filename)

    transcript = whisper.get_transcript(filename)
    print(transcript)
    return transcript   
    
# print(record_audio_and_get_transcript())