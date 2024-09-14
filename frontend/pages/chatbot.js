import { useState } from 'react'
import VideoChat from "../components/videochat";
import ChatHistory from "../components/chathistory"; 

export default function Chatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { text: input, user: true }
    setMessages([...messages, userMessage])
    setInput('')

    // 1 sec
    setTimeout(() => {
      const botMessage = { text: `You said: ${input}`, user: false }
      setMessages(prev => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div className="flex h-screen">
      {/* chat history */}
      <aside className="w-1/4 bg-gray-100 p-4 shadow-md">
        <ChatHistory /> 
      </aside>

      {/* main content: chat and video */}
      <div className="flex-1 flex flex-col">
        <header className="text-3xl font-bold mb-6 text-center text-blue-600 p-4">
          AI-powered Chatbot with Video
        </header>

        <div className="flex flex-1 space-x-4 px-4">
          {/* chat */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4 h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.user ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${message.user ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {message.text}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors">
                Send
              </button>
            </form>
          </div>

          {/* video chat */}
          <div className="w-1/3">
            <VideoChat />
          </div>
        </div>
      </div>
    </div>
  )
}
