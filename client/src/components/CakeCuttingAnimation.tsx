import { useState, useEffect, useRef } from 'react';

interface CakeCuttingAnimationProps {
  onCakeAnimationComplete: () => void;
}

const CakeCuttingAnimation = ({ onCakeAnimationComplete }: CakeCuttingAnimationProps) => {
  const [isCakeSliced, setIsCakeSliced] = useState(false);
  const [showCelebrationText, setShowCelebrationText] = useState(false);
  const cakeRef = useRef<HTMLDivElement>(null);
  
  const handleCutCake = () => {
    if (isCakeSliced) return;
    
    // Play cake cutting animation
    setIsCakeSliced(true);
    
    // Log the animation trigger (since we don't have the actual sound)
    console.log("Cake cutting animation triggered!");
    
    // After a short delay, show the celebration text
    setTimeout(() => {
      setShowCelebrationText(true);
      onCakeAnimationComplete();
    }, 1500);
  };
  
  // Create confetti effect around the cake
  useEffect(() => {
    const createConfetti = () => {
      if (!cakeRef.current) return;
      
      const confettiCount = 8;
      const colors = ['#FFD700', '#FF69B4', '#7FFF00', '#1E90FF', '#FFA500', '#9370DB'];
      
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const size = Math.random() * 10 + 5;
        
        confetti.className = 'absolute rounded-full animate-float opacity-70';
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Position around the cake
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        confetti.style.left = `calc(50% + ${x}px)`;
        confetti.style.top = `calc(50% + ${y}px)`;
        
        // Random animation delay
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        
        // Add to cake container and remove after animation
        cakeRef.current.appendChild(confetti);
        
        setTimeout(() => {
          if (cakeRef.current && cakeRef.current.contains(confetti)) {
            cakeRef.current.removeChild(confetti);
          }
        }, 3000);
      }
    };
    
    // Create confetti at intervals
    const intervalId = setInterval(createConfetti, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Cake container with ref for tracking */}
      <div 
        ref={cakeRef} 
        className="relative mb-8 w-64 h-64 flex items-center justify-center"
      >
        {/* Cake element */}
        <div 
          className={`w-52 h-52 flex flex-col items-center justify-center relative transition-all duration-700 ${
            isCakeSliced 
              ? 'scale-110 opacity-90' 
              : 'animate-glow'
          }`}
        >
          {/* Base of the cake */}
          <div className="w-44 h-28 bg-[#FFE4B5] rounded-b-lg rounded-t-sm relative z-10 shadow-lg border-2 border-[#F4D9A1]">
            {/* Cake layers */}
            <div className="absolute top-[-5px] left-0 w-full h-4 bg-[#FFE4B5] rounded-t-sm border-t-2 border-l-2 border-r-2 border-[#F4D9A1]"></div>
            <div className="absolute top-[-12px] left-2 w-[calc(100%-16px)] h-4 bg-[#FFE4B5] rounded-t-sm border-t-2 border-l-2 border-r-2 border-[#F4D9A1]"></div>
            
            {/* Frosting */}
            <div className="absolute top-[-20px] left-4 right-4 h-6 bg-[#FF9EB5] rounded-t-lg border-t-2 border-l-2 border-r-2 border-[#FF8FAA] flex justify-around">
              {/* Decorative frosting dots */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-5 bg-[#FF9EB5] rounded-full relative top-[-3px]"></div>
              ))}
            </div>
            
            {/* Candles */}
            <div className="absolute top-[-42px] left-[40%] w-4 h-16 bg-[#FFC0CB] rounded-full">
              <div className={`w-2 h-4 mx-auto bg-[#FFFF00] rounded-full relative top-[-4px] ${
                isCakeSliced ? 'opacity-0' : 'animate-float'
              }`}></div>
            </div>
            
            {/* Cake slice effect */}
            {isCakeSliced && (
              <div className="absolute top-0 left-[calc(50%-1px)] w-2 h-full bg-[#FFE9C8] z-20"></div>
            )}
            
            {/* Cake decorations */}
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-3 h-3 rounded-full bg-[#FF77A9]"
                style={{
                  top: `${10 + Math.random() * 15}px`,
                  left: `${10 + Math.random() * 80}%`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Cut cake button */}
      {!isCakeSliced && (
        <button
          onClick={handleCutCake}
          className="bg-[var(--pastel-pink)] text-white font-dancing text-xl px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none"
        >
          Cut the Cake 🎂
        </button>
      )}
      
      {/* Celebration text */}
      {showCelebrationText && (
        <div className="mt-8 text-white text-4xl md:text-5xl font-dancing font-bold animate-fadeIn">
          <h2 className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
            Yay! Happy Birthday Tamnna 🎉
          </h2>
        </div>
      )}
    </div>
  );
};

export default CakeCuttingAnimation;