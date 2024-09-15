import ParticlesBackground from '../components/particlesBackground';
import { memo } from 'react';

const MemoizedParticlesBackground = memo(ParticlesBackground);

export default function MedicalInfo() {
  const resources = [
    { name: 'National Institutes of Health (NIH)', url: 'https://www.nih.gov/' },
    { name: 'Centers for Disease Control and Prevention (CDC)', url: 'https://www.cdc.gov/' },
    { name: 'PubMed Central', url: 'https://www.ncbi.nlm.nih.gov/pmc/' },
    { name: 'World Health Organization (WHO)', url: 'https://www.who.int/' },
  ];

  return (
    <div className="relative w-full h-screen">
      
      <div className="absolute inset-0 z-0">
        <MemoizedParticlesBackground />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Credible Medical Information Hub</h1>
        <p className="mb-6 text-gray-700">
          Access verified medical information from trusted sources. Always consult with a healthcare professional for personalized medical advice.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Trusted Resources</h2>
          <ul className="space-y-4">
            {resources.map((resource, index) => (
              <li key={index}>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {resource.name}
                </a>
              </li>
            ))}
          </ul>

          <img 
            src="/stethoscope.png" 
            alt="Stethoscope"
            className="absolute bottom-6 right-8 w-40 h-40" 
          />
        </div>
      </div>
    </div>
  );
}
