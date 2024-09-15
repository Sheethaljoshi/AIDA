import Link from 'next/link';
import ParticlesBackground from '../components/particlesBackground';

export default function Home() {
  return (
    <div className="relative min-h-screen"> 
      <ParticlesBackground />{/* particles in the background */}
      
      <div className="relative z-10 space-y-8"> {/* content above the particles */}
        <h1 className="text-4xl font-bold text-center text-blue-400">AIDA Artificial Intelligence Diagnostic Assistant</h1>
        
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
            title="User Info" 
            description="Enter your symptoms for an AI-powered assessment."
            link="/setup"
          />
          <FeatureCard 
            title="Emergency Alert System" 
            description="Find nearby hospitals and emergency contacts quickly."
            link="/emergency"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, description, link }) {
  return (
    <Link href={link} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-semibold text-blue-400 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
