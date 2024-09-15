import ParticlesBackground from '../components/particlesBackground';
import { memo } from 'react';

const MemoizedParticlesBackground = memo(ParticlesBackground);

export default function Emergency() {
  return (
    <div className="relative w-full h-screen">
      {/* Particles background */}
      <div className="absolute inset-0 z-0">
        <MemoizedParticlesBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto font-sans p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Emergency Alert System</h1>

        {/* Emergency contacts */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Emergency Contacts</h2>
          <ul className="space-y-2">
            <li><strong>Emergency Services:</strong> 911</li>
            <li><strong>Poison Control:</strong> 1-800-222-1222</li>
            <li><strong>Crisis Helpline:</strong> 1-800-273-8255</li>
          </ul>
        </div>

        {/* Nearby hospitals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Nearby Hospitals</h2>
          <p className="mb-4">Use the map below to find nearby hospitals and urgent care centers:</p>
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.338140362163!2d-71.0956176841842!3d42.36009127918785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370a4e72c7f91%3A0xe21a8fdd7ed4a9c4!2sMassachusetts%20Institute%20of%20Technology!5e0!3m2!1sen!2sus!4v1694770981261!5m2!1sen!2sus"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
