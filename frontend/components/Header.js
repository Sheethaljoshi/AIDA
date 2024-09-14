import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <img src="/images/logo.svg" alt="AI Doctor Tool" className="h-8" />
        </Link>
        <div>
          <Link href="/dashboard" className="btn btn-primary mr-2">Dashboard</Link>
          <Link href="/chat" className="btn btn-secondary">Start Chat</Link>
        </div>
      </nav>
    </header>
  )
}
