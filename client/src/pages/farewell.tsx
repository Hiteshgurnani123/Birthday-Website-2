import { useState, useEffect, useRef } from 'react';
import SparkleEffect from '../components/SparkleEffect';

// Custom component for falling petals/stars effect
const FallingPetals = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    
    // Create falling petals
    const createPetal = () => {
      const petal = document.createElement('div');
      
      // Random properties for natural movement
      const size = Math.random() * 15 + 5;
      const randomX = Math.random() * containerWidth;
      const randomRotate = Math.random() * 360;
      const animationDuration = Math.random() * 5 + 10;
      
      // Randomly select petal type (star, heart, flower)
      const petalTypes = ['✨', '🌸', '✨', '⭐', '✨'];
      const petalContent = petalTypes[Math.floor(Math.random() * petalTypes.length)];
      
      // Set petal styles
      petal.className = 'absolute text-white opacity-70 pointer-events-none';
      petal.style.left = `${randomX}px`;
      petal.style.top = '0';
      petal.style.fontSize = `${size}px`;
      petal.innerHTML = petalContent;
      petal.style.setProperty('--random-x', `${(Math.random() * 200) - 100}px`);
      petal.style.setProperty('--random-rotate', `${randomRotate}deg`);
      petal.style.animation = `falling ${animationDuration}s linear forwards`;
      
      // Add to container and remove when animation completes
      container.appendChild(petal);
      
      setTimeout(() => {
        if (container.contains(petal)) {
          container.removeChild(petal);
        }
      }, animationDuration * 1000);
    };
    
    // Create petals at intervals
    const intervalId = setInterval(() => {
      createPetal();
    }, 800);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-10"
    />
  );
};

// Custom audio player for this page that uses music3.mp3
const FarewellAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Start playing audio when component mounts
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.6; // Set volume to 60%
          await audioRef.current.play();
        } catch (error) {
          console.error("Autoplay failed:", error);
        }
      }
    };
    
    // Try to play audio after a short delay
    const timer = setTimeout(() => {
      playAudio();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <audio ref={audioRef} loop>
      <source src="/music3.mp3" type="audio/mp3" />
    </audio>
  );
};

export default function FarewellPage() {
  // State for animation entry
  const [showContent, setShowContent] = useState(false);
  
  // Show content with delay for smooth entry
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: `url('/bg-final.jpg')`,
          filter: "brightness(0.85)" 
        }}
      />
      
      {/* Overlay for readability */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-0" />
      
      {/* Background effects */}
      <SparkleEffect />
      <FallingPetals />
      <FarewellAudio />
      
      {/* Main content */}
      <div className={`relative z-20 max-w-3xl mx-auto px-6 py-8 transition-all duration-1000 ease-in-out ${
        showContent ? 'opacity-100' : 'opacity-0 transform translate-y-10'
      }`}>
        {/* Message content */}
        <div className="bg-black bg-opacity-40 backdrop-blur-sm p-8 md:p-10 rounded-lg border border-white border-opacity-20 shadow-xl text-white">
          <div className="space-y-6">
            {/* Main message */}
            <p className="font-poppins text-lg md:text-xl leading-relaxed text-white">
              As our journey through these magical moments comes to a close, I hope these little gifts and promises 
              brought a smile to your face. This birthday celebration was created with love, just for you - 
              capturing the wonder and joy you bring into my life every day.
            </p>
            
            <p className="font-poppins text-lg md:text-xl leading-relaxed text-white">
              Like stars that shine brightest in the darkness, you illuminate everything around you with your 
              presence. May this new year of your life be filled with adventures, dreams coming true, and moments 
              that take your breath away.
            </p>
            
            <p className="font-poppins text-lg md:text-xl leading-relaxed text-white mb-8">
              Remember, this is just the beginning. The promises made and the memories created here will follow 
              us into all our tomorrows.
            </p>
            
            {/* Signature section */}
            <div className="mt-12 text-center space-y-2">
              <p className="font-great-vibes text-3xl md:text-4xl text-white opacity-90 mb-6">
                Thank you so much for visiting.
              </p>
              
              <p className="font-poppins text-sm md:text-base text-white opacity-80 mt-6">
                — This is a small and a sweet gift by Hitesh to his most favorite girl.
              </p>
              
              <p className="font-great-vibes text-3xl md:text-4xl text-white mt-8 animate-float">
                Once again, a happiest birthday Tamnna...!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}