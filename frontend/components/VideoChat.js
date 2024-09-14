import { useRef, useEffect } from 'react'

export default function VideoChat() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          let video = videoRef.current
          video.srcObject = stream
          video.play()
        })
        .catch(error => {
          console.error("Error accessing the camera and microphone:", error)
        })
    }
  }, [])

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full h-64 bg-black rounded-lg"></video>
      <button className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full">
        End Call
      </button>
    </div>
  )
}
