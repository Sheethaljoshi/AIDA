import { useEffect, useState, useCallback } from 'react'
import VideoChat from "../components/VideoChat";
import ChatHistory from "../components/ChatHistory"; 
import ParticlesBackground from '../components/particlesBackground';
import { memo } from 'react';

// memoize components that don't need to re-render
const MemoizedParticlesBackground = memo(ParticlesBackground);
const MemoizedVideoChat = memo(VideoChat);
const MemoizedChatHistory = memo(ChatHistory);

export default function Chatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [chatHistory, setChatHistory] = useState([])

  // chat history on component mount
  useEffect(() => {
    fetchChatHistory()
  }, [])

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('/api/chat_history') 
      if (!response.ok) {
        throw new Error('Failed to fetch chat history')
      }
      const data = await response.json()
      setChatHistory(data)
    } catch (error) {
      console.error('Error fetching chat history:', error)
    }
  }

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { text: input, user: true }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput('')

    try {
      const response = await fetch('/get_answer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: 'johndoe@gmail.com', // need actual user email
          first_name: 'John', // need actual user first name
          last_name: 'Doe', // need actual user last name
          question: input,
          title: 'Current Conversation' // what the fuck???
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get answer from backend')
      }

      const data = await response.json()
      const botMessage = { text: data.answer, user: false }
      setMessages((prevMessages) => [...prevMessages, botMessage])

      // refresh chat history after new message
      fetchChatHistory()
    } catch (error) {
      console.error('Error getting answer:', error)
      const errorMessage = { text: 'Sorry, there was an error processing your request.', user: false }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    }
  }, [input])

  const handleAudioData = useCallback(async (audioBlob) => {
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const { text } = await response.json()

      setMessages((prevMessages) => [...prevMessages, { text, user: true }])
      
      // send the transcribed text to get an answer
      const answerResponse = await fetch('/get_answer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: 'johndoe@gmail.com', // need actual user email
          first_name: 'John', // need actual user first name
          last_name: 'Doe', // need actual user last name
          question: input,
          title: 'Current Conversation' // man i dont know
        })
      })

      if (!answerResponse.ok) {
        throw new Error('Failed to get answer from backend')
      }

      const answerData = await answerResponse.json()
      const botMessage = { text: answerData.answer, user: false }
      setMessages((prevMessages) => [...prevMessages, botMessage])

      // refresh chat history after new message
      fetchChatHistory()
    } catch (error) {
      console.error('Error processing audio:', error)
      setMessages((prevMessages) => [...prevMessages, { text: 'Error processing audio', user: false }])
    }
  }, [])

  return (
    <div className="relative">
      <div className="absolute inset-0 z-0">
        <MemoizedParticlesBackground />
      </div>

      <div className="relative z-10 flex h-128">
        <aside className="w-1/4 bg-gray-100 p-4 shadow-md rounded-lg overflow-y-auto"> 
          <MemoizedChatHistory chatHistory={chatHistory} />
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="text-3xl font-bold mb-6 text-center text-blue-600 p-4">
            AIDA: Artificial Intelligence Diagnostic Assistant
          </header>

          <div className="flex flex-1 space-x-4 px-4">
            <div className="w-1/2">
              <MemoizedVideoChat onAudioData={handleAudioData} />
            </div>

            <div className="flex-1 flex flex-col">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4 flex-grow overflow-y-auto">
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
          </div>
        </div>
      </div>
    </div>
  )
}
