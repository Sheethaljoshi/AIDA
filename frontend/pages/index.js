import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-blue-600">AIDA</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <FeatureCard 
          title="AI-powered FAQ and Chatbot" 
          description="Ask medical questions and upload photos for accurate responses."
          link="/chatbot"
        />
        <FeatureCard 
          title="Credible Medical Information Hub" 
          description="Access verified medical information from trusted sources."
          link="/medical-info"
        />
        <FeatureCard 
          title="Symptom Checker" 
          description="Enter your symptoms for an AI-powered assessment."
          link="/symptom-checker"
        />
        <FeatureCard 
          title="Emergency Alert System" 
          description="Find nearby hospitals and emergency contacts quickly."
          link="/emergency"
        />
      </div>
    </div>
  )
}

function FeatureCard({ title, description, link }) {
  return (
    <Link href={link} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-semibold text-blue-600 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  )
}
