import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-blue-400 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          AIDA
        </Link>
        <div className="space-x-4">
          <Link href="/chatbot" className="hover:underline">Chatbot</Link>
          <Link href="/medical-info" className="hover:underline">Medical Info</Link>
          <Link href="/symptom-checker" className="hover:underline">Symptom Checker</Link>
          <Link href="/emergency" className="hover:underline">Emergency</Link>
        </div>
      </nav>
    </header>
  )
}