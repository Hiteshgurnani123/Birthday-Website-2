import { useCallback } from "react";

const useSparkle = () => {
  const createSparkle = useCallback((x: number, y: number) => {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle animate-sparkle";
    
    // Randomize sparkle properties
    const size = Math.random() * 10 + 5;
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${x + offsetX}px`;
    sparkle.style.top = `${y + offsetY}px`;
    
    // Add some color variation
    const hue = Math.floor(Math.random() * 60) + 180; // Blue-ish to purple-ish
    sparkle.style.backgroundImage = `radial-gradient(circle, white 10%, hsla(${hue}, 100%, 70%, 0.8) 60%, transparent 100%)`;
    
    document.body.appendChild(sparkle);
    
    // Remove sparkle after animation completes
    setTimeout(() => {
      if (sparkle.parentNode === document.body) {
        document.body.removeChild(sparkle);
      }
    }, 1500); // Match animation duration
  }, []);

  const createSparkles = useCallback((x: number, y: number) => {
    const sparkleCount = 3;
    for (let i = 0; i < sparkleCount; i++) {
      setTimeout(() => {
        createSparkle(x, y);
      }, i * 50);
    }
  }, [createSparkle]);

  return { createSparkle, createSparkles };
};

export default useSparkle;
