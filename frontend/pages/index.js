import Link from 'next/link';
import ParticlesBackground from '../components/particlesBackground';

export default function Home() {
  return (
    <div className="relative min-h-screen"> 
      <ParticlesBackground />{/* particles in the background */}
      
      <div className="relative z-10 space-y-8"> {/* content above the particles */}
        <h1 className="text-center">
          <span className="block text-6xl font-bold text-primary">AIDA</span>
          <span className="block text-2xl font-semibold text-gray-600">Artificial Intelligence Diagnostic Assistant</span>
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard 
            title="User Info" 
            description="Provide your personal details so AIDA can offer a tailored experience based on your health profile."
            link="/setup"
          />
          <FeatureCard 
            title="Meet AIDA 🩵" 
            description="Chat with AIDA to get instant, AI-driven answers to your medical questions and more."
            link="/chatbot"
          />
          <FeatureCard 
            title="Emergency Alert System" 
            description="Quickly locate nearby hospitals and access essential emergency contacts."
            link="/emergency"
          />
          <FeatureCard 
            title="Credible Medical Information Hub" 
            description="Browse trustworthy medical information to make informed health decisions."
            link="/medical-info"
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
