import Head from 'next/head';
import SetupForm from '../components/setup';
import ParticlesBackground from '../components/particlesBackground';
import { memo } from 'react';

const MemoizedParticlesBackground = memo(ParticlesBackground);

export default function SetupPage() {
  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 z-0">
        <MemoizedParticlesBackground />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <Head>
          <title>Setup Profile - AIDA</title>
          <meta name="description" content="Set up your profile to get personalized assistance." />
        </Head>
        
        <main className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Personalize Your Profile</h1>
          <SetupForm />
        </main>
      </div>
    </div>
  );
}
