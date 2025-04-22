import { FC, useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
  userInteracted: boolean;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ userInteracted }) => {
  const [isPlaying, setIsPlaying] = useState(true); // Default to true
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    // Try to play automatically when component mounts
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Autoplay failed (browser policy):", error);
          // Will try again after user interaction
        }
      }
    };
    
    playAudio();
  }, []);
  
  useEffect(() => {
    if (userInteracted && audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Audio play failed:", error);
        });
    }
  }, [userInteracted, isPlaying]);
  
  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Audio play failed:", error);
          });
      }
    }
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-full p-3 shadow-lg">
        <button 
          className="text-[var(--ghibli-dark)] hover:text-[var(--pastel-pink)] transition-colors duration-300"
          onClick={toggleAudio}
        >
          <i className={`fas fa-${isPlaying ? 'volume-up' : 'volume-mute'} text-2xl`}></i>
        </button>
      </div>
      <audio ref={audioRef} loop>
        <source src="/music2.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
