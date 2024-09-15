import { useEffect, useState } from 'react'

export default function ChatHistory() {
  const [chatHistory] = useState([
    {
      date: '09/15/24',
      title: 'High Fever and Chills',
      messages: [
        { role: 'user', content: 'when was the last time i vomitted' },
        {
          role: 'assistant',
          content:
            'John, according to the information provided, there was no recent report or mention of a vomiting incident in the data...',
        },
      ],
    },
    {
      date: '09/14/24',
      title: 'Schizophrenia-Induced Hallucinations',
      messages: [
        { role: 'user', content: 'i feel very very very sick' },
        {
          role: 'assistant',
          content:
            "I'm sorry to hear that you're feeling so ill. To best help you, I need to understand your symptoms more clearly...",
        },
      ],
    },
  ]);

// export default function ChatHistory() {
//   const [chatHistory, setChatHistory] = useState([])

  // useEffect(() => {
  //   const fetchData = async () => {
  //       try {
  //           const url = `http://127.0.0.1:8000/get_history?email=johndoe@gmail.com&first_name=John&last_name=Doe`;
  //           const response = await fetch(url);
  //           if (!response.ok) {
  //               throw new Error('Network response was not ok');
  //           }
  //           const data = await response.json();
  //           console.log(data);
  //           setChatHistory(data);  // Update the correct state
  //       } catch (error) {
  //           console.error('Error fetching data:', error);
  //       }
  //   };

  //   fetchData();
  // }, []);

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
