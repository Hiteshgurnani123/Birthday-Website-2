import { useEffect } from "react";
import useSparkle from "../hooks/use-sparkle";

const SparkleEffect = () => {
  const { createSparkles } = useSparkle();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      createSparkles(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      createSparkles(touch.clientX, touch.clientY);
    };

    // Throttle function to limit execution rate
    function throttle<T extends (...args: any[]) => any>(callback: T, delay: number) {
      let previousCall = Date.now();
      return function(...args: Parameters<T>) {
        const time = Date.now();
        if ((time - previousCall) >= delay) {
          previousCall = time;
          callback(...args);
        }
      };
    }

    const throttledMouseMove = throttle(handleMouseMove, 100);
    const throttledTouchMove = throttle(handleTouchMove, 100);

    document.addEventListener("mousemove", throttledMouseMove);
    document.addEventListener("touchmove", throttledTouchMove);

    return () => {
      document.removeEventListener("mousemove", throttledMouseMove);
      document.removeEventListener("touchmove", throttledTouchMove);
    };
  }, [createSparkles]);

  return null;
};

export default SparkleEffect;
