import Head from 'next/head'
import SetupForm from '../components/setup'

export default function SetupPage() {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <Head>
        <title>Setup Profile - AIDA</title>
        <meta name="description" content="Set up your profile to get personalized assistance." />
      </Head>
      
      <main className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Personalize Your Profile</h1>
        <SetupForm />
      </main>
    </div>
  )
}
