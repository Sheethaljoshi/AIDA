import VideoChat from '../components/VideoChat'

export default function Chat() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">AI Doctor Chat</h1>
      <VideoChat />
      <div className="mt-4">
        <textarea 
          className="w-full p-2 border border-gray-300 rounded-md" 
          rows="4" 
          placeholder="Type your message here..."
        ></textarea>
        <button className="mt-2 btn btn-primary">Send Message</button>
      </div>
    </div>
  )
}
