import { useEffect, useState } from 'react'

export default function ChatHistory() {
  const [chatHistory, setChatHistory] = useState([])

  useEffect(() => {
    const fetchData = async () => {
        try {
            const url = `http://127.0.0.1:8000/get_history?email=johndoe@gmail.com&first_name=John&last_name=Doe`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setChatHistory(data);  // Update the correct state
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Chat History</h2>
      <ul className="space-y-2">
        {chatHistory.map((chat, index) => (
          <li key={index} className="bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">{chat.date}</p>
            <p>{chat.title}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
