import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write

def record_audio(duration, filename, samplerate=44100):
    """
    Records audio from the computer and saves it as a WAV file.

    :param duration: Duration of the recording in seconds.
    :param filename: Name of the file to save the recording.
    :param samplerate: Sample rate of the audio recording.
    """
    print("Recording...")
    audio_data = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=2, dtype='int16')
    sd.wait()  # Wait until recording is finished
    write(filename, samplerate, audio_data)
    print(f"Audio saved as {filename}")

if __name__ == "__main__":
    duration = 10  # Duration in seconds
    filename = 'output.wav'  # Output file name
    record_audio(duration, filename)
