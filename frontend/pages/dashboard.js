import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ChatHistory from '../components/ChatHistory'
import HealthRecommendations from '../components/HealthRecommendations'

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (profile) {
      setUserProfile(JSON.parse(profile))
    } else {
      router.push('/setup')
    }
  }, [])

  if (!userProfile) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome, {userProfile.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChatHistory />
        <HealthRecommendations />
      </div>
    </div>
  )
}
