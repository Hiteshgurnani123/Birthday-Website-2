import { useState, useEffect } from 'react';
import SparkleEffect from '../components/SparkleEffect';
import AudioPlayer from '../components/AudioPlayer';
import CakeCuttingAnimation from '../components/CakeCuttingAnimation';

export default function CakeCuttingPage() {
  const [userInteracted, setUserInteracted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Set user interaction to true automatically when page loads
  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      setUserInteracted(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle first user interaction for audio
  const handleInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
    }
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      onClick={handleInteraction}
    >
      {/* Background Image with overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url('/bg-celebrates.jpg')`,
          filter: "brightness(0.9)"
        }}
      ></div>
      
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40"></div>
      
      {/* Audio Player */}
      <AudioPlayer userInteracted={userInteracted} />
      
      {/* Sparkle Effect */}
      <SparkleEffect />
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 py-16 flex flex-col items-center justify-center">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-dancing font-bold text-white mb-10 text-center opacity-0 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          Time to Celebrate!
        </h1>
        
        {/* Cake Cutting Animation */}
        <CakeCuttingAnimation 
          onCakeAnimationComplete={() => setAnimationComplete(true)}
        />
        
        {/* Navigation button to farewell page (shown after animation completes) */}
        {animationComplete && (
          <a 
            href="/farewell" 
            className="mt-16 bg-[var(--pastel-blue)] bg-opacity-60 hover:bg-opacity-80 text-white font-dancing text-xl px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 animate-fadeIn"
            style={{ animationDelay: "1s" }}
          >
            Continue to Final Message
          </a>
        )}
      </div>
    </div>
  );
}