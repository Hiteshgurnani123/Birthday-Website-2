import { useState, useEffect, useRef } from 'react';

interface CakeCuttingAnimationProps {
  onCakeAnimationComplete: () => void;
}

const CakeCuttingAnimation = ({ onCakeAnimationComplete }: CakeCuttingAnimationProps) => {
  const [isCakeSliced, setIsCakeSliced] = useState(false);
  const [showCelebrationText, setShowCelebrationText] = useState(false);
  const [candlesBlownOut, setCandlesBlownOut] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSlice, setShowSlice] = useState(false);
  
  const cakeRef = useRef<HTMLDivElement>(null);
  const fireworksRef = useRef<HTMLCanvasElement>(null);
  const fireworksCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const fireworksAnimationRef = useRef<number>(0);
  
  // Initialize fireworks canvas
  useEffect(() => {
    if (fireworksRef.current) {
      fireworksCtxRef.current = fireworksRef.current.getContext('2d');
      
      // Set canvas dimensions to match viewport
      const resizeCanvas = () => {
        if (fireworksRef.current) {
          fireworksRef.current.width = window.innerWidth;
          fireworksRef.current.height = window.innerHeight;
        }
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(fireworksAnimationRef.current);
      };
    }
  }, []);
  
  // Fireworks animation
  useEffect(() => {
    if (!showFireworks || !fireworksCtxRef.current || !fireworksRef.current) return;
    
    const ctx = fireworksCtxRef.current;
    const canvas = fireworksRef.current;
    const fireworks: Firework[] = [];
    const particles: Particle[] = [];
    
    // Create a firework
    class Firework {
      x: number;
      y: number;
      targetY: number;
      speed: number;
      color: string;
      
      constructor() {
        // Start position (bottom of screen, random x coordinate)
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        
        // Target height (random height in top 2/3 of screen)
        this.targetY = Math.random() * canvas.height * 0.6;
        
        // Speed
        this.speed = 2 + Math.random() * 3;
        
        // Color
        const colors = ['#FF5252', '#FFBD59', '#75C7FB', '#B388FF', '#76FF92'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        // Move up towards target
        this.y -= this.speed;
        
        // Return true if firework has reached its target
        return this.y <= this.targetY;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      // Create explosion particles when firework reaches target
      explode() {
        const particleCount = 70 + Math.floor(Math.random() * 30);
        
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }
    }
    
    // Create a particle for explosion
    class Particle {
      x: number;
      y: number;
      speed: number;
      angle: number;
      color: string;
      alpha: number;
      
      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.speed = 0.5 + Math.random() * 2;
        this.angle = Math.random() * Math.PI * 2; // Random angle
        this.color = color;
        this.alpha = 1; // Full opacity to start
      }
      
      update() {
        // Move in direction based on angle
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Reduce opacity over time
        this.alpha -= 0.01;
        
        // Return true if particle is still visible
        return this.alpha > 0;
      }
      
      draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Create new fireworks at random intervals
    const createFireworks = () => {
      if (Math.random() < 0.05) {
        fireworks.push(new Firework());
      }
    };
    
    // Main animation loop
    const animate = () => {
      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].draw();
        
        // If firework reached target, remove it and create explosion
        if (fireworks[i].update()) {
          fireworks[i].explode();
          fireworks.splice(i, 1);
        }
      }
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].draw();
        
        // If particle faded out, remove it
        if (!particles[i].update()) {
          particles.splice(i, 1);
        }
      }
      
      // Create new fireworks
      createFireworks();
      
      // Continue animation
      fireworksAnimationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Stop fireworks after 4 seconds
    const timer = setTimeout(() => {
      setShowFireworks(false);
    }, 4000);
    
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(fireworksAnimationRef.current);
    };
  }, [showFireworks]);
  
  // Create confetti effect
  const createConfetti = () => {
    if (!cakeRef.current || !showConfetti) return;
    
    const colors = ['#FFD700', '#FF69B4', '#7FFF00', '#1E90FF', '#FFA500', '#9370DB'];
    const confettiContainer = cakeRef.current;
    
    // Create many confetti pieces at once for explosion effect
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        const size = Math.random() * 10 + 3;
        
        // Randomly create circle or rectangle confetti
        const isCircle = Math.random() > 0.3;
        confetti.className = `absolute ${isCircle ? 'rounded-full' : 'rotate-45'} opacity-70`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${isCircle ? size : size * 1.5}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Start position (centered above cake)
        const startAngle = Math.random() * Math.PI * 2;
        const startDistance = Math.random() * 20;
        const startX = Math.cos(startAngle) * startDistance;
        const startY = Math.sin(startAngle) * startDistance - 50; // Start above cake
        
        // End position (spread outward and downward)
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 150;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance + 100; // Float downward
        
        // Set initial position
        confetti.style.left = `calc(50% + ${startX}px)`;
        confetti.style.top = `calc(50% + ${startY}px)`;
        
        // Animate to final position
        confetti.style.animation = `confettiFall 1.5s forwards`;
        confetti.style.opacity = '1';
        
        // Add keyframe animation dynamically
        const styleSheet = document.styleSheets[0];
        const keyframes = `@keyframes confettiFall {
          0% { 
            transform: translate(0, 0) rotate(0deg); 
            opacity: 1;
          }
          100% { 
            transform: translate(${x}px, ${y}px) rotate(${Math.random() * 360}deg); 
            opacity: ${Math.random() * 0.5 + 0.3};
          }
        }`;
        
        try {
          styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        } catch (e) {
          console.log("Couldn't insert keyframe rule: ", e);
        }
        
        // Add to container
        confettiContainer.appendChild(confetti);
        
        // Remove after animation completes
        setTimeout(() => {
          if (confettiContainer.contains(confetti)) {
            confettiContainer.removeChild(confetti);
          }
        }, 4000);
      }, Math.random() * 500); // Stagger confetti creation for more natural look
    }
  };
  
  // Trigger confetti when showConfetti becomes true
  useEffect(() => {
    if (showConfetti) {
      createConfetti();
    }
  }, [showConfetti]);
  
  // Animation sequence for cake cutting
  const handleCutCake = () => {
    if (isCakeSliced) return;
    
    // Step 1: Blow out candles
    setCandlesBlownOut(true);
    console.log("Candles blown out!");
    
    // Step 2: After short delay, slice cake
    setTimeout(() => {
      setIsCakeSliced(true);
      console.log("Cake sliced!");
      
      // Step 3: Show slice coming out
      setTimeout(() => {
        setShowSlice(true);
        console.log("Slice pulled out!");
        
        // Step 4: Show fireworks
        setTimeout(() => {
          setShowFireworks(true);
          console.log("Fireworks started!");
          
          // Step 5: Show confetti
          setTimeout(() => {
            setShowConfetti(true);
            console.log("Confetti explosion!");
            
            // Step 6: Show celebration text
            setTimeout(() => {
              setShowCelebrationText(true);
              onCakeAnimationComplete();
              console.log("Celebration complete!");
            }, 1000);
          }, 500);
        }, 500);
      }, 700);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Fireworks canvas (fullscreen, behind everything) */}
      {showFireworks && (
        <canvas 
          ref={fireworksRef}
          className="fixed inset-0 z-20 pointer-events-none"
        />
      )}
      
      {/* Cake container with ref for tracking */}
      <div 
        ref={cakeRef} 
        className="relative mb-10 w-72 h-72 flex items-center justify-center z-30"
      >
        {/* Smoke effect for blown candles */}
        {candlesBlownOut && !isCakeSliced && (
          <div className="absolute z-40 top-[-50px] left-[40%]">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-3 h-3 rounded-full bg-white opacity-80 animate-float"
                style={{
                  left: `${i * 3 - 3}px`,
                  top: `${-i * 4}px`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </div>
        )}
        
        {/* Cake element */}
        <div 
          className={`w-60 h-60 flex flex-col items-center justify-center relative transition-all duration-700 ${
            isCakeSliced 
              ? 'scale-110 opacity-100' 
              : 'animate-glow'
          }`}
        >
          {/* Base of the cake */}
          <div className="w-52 h-32 bg-[#FFE4B5] rounded-b-lg rounded-t-sm relative z-10 shadow-lg border-2 border-[#F4D9A1]">
            {/* Cake layers */}
            <div className="absolute top-[-6px] left-0 w-full h-4 bg-[#FFE4B5] rounded-t-sm border-t-2 border-l-2 border-r-2 border-[#F4D9A1]"></div>
            <div className="absolute top-[-14px] left-2 w-[calc(100%-16px)] h-5 bg-[#FFE4B5] rounded-t-sm border-t-2 border-l-2 border-r-2 border-[#F4D9A1]"></div>
            
            {/* Frosting */}
            <div className="absolute top-[-22px] left-4 right-4 h-6 bg-[#FF9EB5] rounded-t-lg border-t-2 border-l-2 border-r-2 border-[#FF8FAA] flex justify-around">
              {/* Decorative frosting dots */}
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-3 h-5 bg-[#FF9EB5] rounded-full relative top-[-3px]"></div>
              ))}
            </div>
            
            {/* Multiple candles */}
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="absolute top-[-45px] w-3 h-14 bg-[#FFC0CB] rounded-full"
                style={{ left: `${30 + i * 20}%` }}
              >
                {/* Candle flame */}
                {!candlesBlownOut && (
                  <div className="w-2 h-4 mx-auto bg-[#FFFF00] rounded-full relative top-[-4px] animate-float shadow-lg shadow-yellow-300">
                    <div className="absolute inset-0 bg-white bg-opacity-80 rounded-full scale-50 animate-glow"></div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Cake slice effect - the cut line */}
            {isCakeSliced && (
              <div className="absolute top-0 left-[calc(50%-1px)] w-2 h-full bg-[#FFE9C8] z-20"></div>
            )}
            
            {/* Cake slice that moves out */}
            {showSlice && (
              <div className="absolute top-0 right-[calc(50%+1px)] w-[25%] h-full z-30 animate-pop" style={{ transform: 'translateX(20px)' }}>
                {/* Slice filling and frosting */}
                <div className="w-full h-full bg-[#FFE4B5] border-r-2 border-[#F4D9A1] relative">
                  <div className="absolute top-[-6px] right-0 w-full h-4 bg-[#FFE4B5] border-t-2 border-r-2 border-[#F4D9A1]"></div>
                  <div className="absolute top-[-14px] right-0 w-full h-5 bg-[#FFE4B5] border-t-2 border-r-2 border-[#F4D9A1]"></div>
                  <div className="absolute top-[-22px] right-0 w-full h-6 bg-[#FF9EB5] border-t-2 border-r-2 border-[#FF8FAA]"></div>
                  
                  {/* Strawberry filling */}
                  <div className="absolute top-[30%] right-2 w-[70%] h-[20%] bg-[#FF6B8A] rounded-sm"></div>
                </div>
              </div>
            )}
            
            {/* Cake decorations - sprinkles and small decorations */}
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-2 h-2 rounded-full bg-[#FF77A9]"
                style={{
                  top: `${10 + Math.random() * 15}px`,
                  left: `${10 + Math.random() * 80}%`,
                }}
              ></div>
            ))}
            
            {/* Shimmer effect on top of cake */}
            <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
              <div className="w-full h-full shimmer-effect"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cut cake button */}
      {!isCakeSliced && (
        <button
          onClick={handleCutCake}
          className="bg-[var(--pastel-pink)] text-white font-dancing text-xl px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none relative overflow-hidden z-30"
        >
          {/* Glowing effect around button */}
          <span className="absolute inset-0 rounded-full animate-glow pointer-events-none"></span>
          
          {/* Button text */}
          <span className="relative z-10">Cut the Cake 🎂</span>
        </button>
      )}
      
      {/* Celebration text */}
      {showCelebrationText && (
        <div className="mt-12 text-white text-4xl md:text-5xl font-dancing font-bold z-30">
          <h2 className="relative animate-pop" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
            Yay! Happy Birthday Tamnna 🎉
            
            {/* Star decorations around text */}
            {[...Array(5)].map((_, i) => (
              <span 
                key={i}
                className="absolute text-yellow-300 text-2xl"
                style={{
                  top: `${-10 + Math.random() * 20}px`,
                  left: `${Math.random() * 100}%`,
                  transform: 'rotate(10deg)',
                  animation: `sparkle ${1 + Math.random()}s infinite alternate`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              >
                ✨
              </span>
            ))}
          </h2>
        </div>
      )}
    </div>
  );
};

export default CakeCuttingAnimation;