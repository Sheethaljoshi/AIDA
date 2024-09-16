import { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function VideoChat() {
  const videoRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const wsRef = useRef(null)
  const canvasRef = useRef(null)
  const router = useRouter() 

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          let video = videoRef.current
          video.srcObject = stream
          video.play()

          const ws = new WebSocket("ws://localhost:8000/ws")
          wsRef.current = ws

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
  }, [])

  const toggleRecording = () => {
    fetch(`http://127.0.0.1:8000/start-recording/?email=johndoe@gmail.com&first_name=John&last_name=Doe`)
    if (!isRecording) {
      mediaRecorderRef.current.start()
    } else {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(!isRecording)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current && wsRef.current && wsRef.current.readyState == WebSocket.OPEN) {
        const context = canvasRef.current.getContext('2d')
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        canvasRef.current.toBlob(blob => {
          if (blob) {
            wsRef.current.send(blob);
          }
        }, 'video/webm')
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const endSession = () => {
    fetch('http://127.0.0.1:8000/stop-recording/')
    // stop the recording if still active
    if (isRecording) {
      mediaRecorderRef.current.stop()
    }
    // navigate to the results page
    router.push('/results')
  }

  const handleClick = () => {
    if (isRecording) {
      endSession()
    } else {
      toggleRecording()
    }
  }

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full h-84 bg-black rounded-lg"></video>
      <div className="flex justify-center mt-4 space-x-4">
        <button 
          className={`px-4 py-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white`}
          onClick={handleClick}
        >
          {isRecording ? 'End Session' : 'Start Session'}
        </button>

        <canvas ref={canvasRef} className="hidden"/>
      </div>
    </div>
  )
}
