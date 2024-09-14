import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to AI Doctor Tool</h1>
      <p className="mb-8">Get personalized health recommendations and chat with our AI doctor.</p>
      <Link href="/setup" className="btn btn-primary mr-4">Set Up Profile</Link>
      <Link href="/chat" className="btn btn-secondary">Start Chat</Link>
    </div>
  )
}
