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
      {/* video display */}
      <video ref={videoRef} className="w-full h-84 bg-black rounded-lg"></video>

      {/* end call button below the video */}
      <div className="flex justify-center mt-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded-full">
          End Session
        </button>
      </div>
    </div>
  )
}
