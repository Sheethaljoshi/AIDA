import fetchChatHistory from '../chatbot'
import Link from 'next/link'
import { updateChat } from '../chatbot'

// export async function POST(req, res) {
//   // console.log('Hello')
//   // console.log(JSON.parse(req.body))
//   // console.log(req.json())
//   // console.log(res)

//   const data  = await req.json()
//   console.log(data)
//   res.status(200).json({ message: 'Hello from Next.js!' })


// }

export default function handler(req, res) {
  if (req.method === 'POST') {
    // const post = JSON.parse(req.body);
    console.log(req.body)
    console.log(req.body["name"])
    // fetchChatHistory(req)
    updateChat.current = req.body["name"]
    res.status(200).json({ message: 'Post created successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}