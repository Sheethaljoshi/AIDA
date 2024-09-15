import { useRef, useEffect, useState } from 'react'

export default function VideoChat({ onAudioData }) {
  const videoRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null)

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          let video = videoRef.current
          video.srcObject = stream
          video.play()

          // Set up MediaRecorder
          mediaRecorderRef.current = new MediaRecorder(stream)
          
          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              onAudioData(event.data)
            }
          }
        })
        .catch(error => {
          console.error("Error accessing the camera and microphone:", error)
        })
    }
  }, [onAudioData])

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop()
    } else {
      mediaRecorderRef.current.start()
    }
    setIsRecording(!isRecording)
  }

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full h-84 bg-black rounded-lg"></video>
      <div className="flex justify-center mt-4 space-x-4">
        <button 
          className={`px-4 py-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white`}
          onClick={toggleRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-full">
          End Session
        </button>
      </div>
    </div>
  )
}
