import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-blue-400 text-white p-4 z-20">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* AIDA Logo */}
          <Image src="/AIDA.png" alt="AIDA Logo" width={40} height={40} />
          <Link href="/" className="text-2xl font-bold">
            AIDA
          </Link>
        </div>
        <div className="space-x-4">
        <Link href="/setup" className="hover:underline">USER INFO</Link>
          <Link href="/chatbot" className="hover:underline">AIDA</Link>
          <Link href="/medical-info" className="hover:underline">MEDICAL INFO</Link>
          <Link href="/emergency" className="hover:underline">EMERGENCY SERVICES</Link>
        </div>
      </nav>
    </header>
  )
}
