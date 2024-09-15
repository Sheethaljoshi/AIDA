import { useEffect, useState } from 'react'

export default function ChatHistory() {
  const [chatHistory, setChatHistory] = useState([])

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/chat_history?email=johndoe@gmail.com&first_name=John&last_name=Doe')
        if (!response.ok) {
          throw new Error('Failed to fetch chat history')
        }
        const data = await response.json()
        setChatHistory(data)
      } catch (error) {
        console.error('Error fetching chat history:', error)
      }
    }
  
    fetchChatHistory()
  }, [])  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Chat History</h2>
      <ul className="space-y-2">
        {chatHistory.map(chat => (
          <li key={chat.id} className="bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">{chat.date}</p>
            <p>{chat.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
