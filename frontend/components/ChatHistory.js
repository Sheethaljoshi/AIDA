import { useEffect, useState } from 'react'

export default function ChatHistory() {
  const [chatHistory, setChatHistory] = useState([])

  useEffect(() => {
    // fetch from backend!
    const mockHistory = [
      { id: 1, date: '2024-03-15', summary: 'Discussed headache symptoms' },
      { id: 2, date: '2024-03-10', summary: 'Follow-up on medication side effects' },
    ]
    setChatHistory(mockHistory)
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
