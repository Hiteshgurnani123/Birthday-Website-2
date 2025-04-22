import { useState, useEffect } from "react";
import GiftCard from "./components/GiftCard";
import Modal from "./components/Modal";
import AudioPlayer from "./components/AudioPlayer";
import SparkleEffect from "./components/SparkleEffect";

// Define the gift options
const giftOptions = [
  {
    id: 1,
    title: "A Handwritten Letter",
    description: "Words from the heart, written just for you",
    icon: "envelope",
    color: "pink",
    delay: "1.5s"
  },
  {
    id: 2,
    title: "A Movie Night Together",
    description: "Cozy snacks and your favorite films",
    icon: "film",
    color: "purple",
    delay: "1.7s"
  },
  {
    id: 3,
    title: "A Handmade Gift",
    description: "Created with love and care",
    icon: "gift",
    color: "blue",
    delay: "1.9s"
  },
  {
    id: 4,
    title: "A Personal Promise",
    description: "A vow made especially for you",
    icon: "hand-holding-heart",
    color: "pink",
    delay: "2.1s"
  },
  {
    id: 5,
    title: "A Surprise Day Out",
    description: "An adventure we'll plan together",
    icon: "map-marked-alt",
    color: "purple",
    delay: "2.3s"
  },
  {
    id: 6,
    title: "A Song Just For You",
    description: "Melodies chosen with your heart in mind",
    icon: "music",
    color: "blue",
    delay: "2.5s"
  }
];

function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener("click", handleFirstInteraction);
    };
    
    document.addEventListener("click", handleFirstInteraction);
    
    return () => {
      document.removeEventListener("click", handleFirstInteraction);
    };
  }, []);

  const handleGiftClick = (id: number) => {
    setSelectedGift(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url('/bg-promises.jpg')`,
          filter: "brightness(0.9)"
        }}
      ></div>
      
      {/* Overlay to darken background slightly */}
      <div className="fixed inset-0 bg-black bg-opacity-20"></div>
      
      {/* Audio Player */}
      <AudioPlayer userInteracted={userInteracted} />
      
      {/* Sparkle Effect */}
      <SparkleEffect />
      
      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 font-quicksand text-ghibli-dark">
        {/* Header */}
        <header className="text-center mb-12 mt-4 opacity-0 animate-fadeIn" style={{ animationDelay: "0.5s" }}>
          <h1 className="text-5xl md:text-6xl font-dancing font-bold text-white drop-shadow-lg transform transition duration-500">
            Choose a Special Gift or a Sweet Promise
          </h1>
          <p className="text-xl md:text-2xl font-dancing mt-4 text-white opacity-0 animate-slideUp" style={{ animationDelay: "1.2s" }}>
            A little something just for you, Tamnna.
          </p>
        </header>
        
        {/* Gift Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl px-4">
          {giftOptions.map((gift) => (
            <GiftCard
              key={gift.id}
              id={gift.id}
              title={gift.title}
              description={gift.description}
              icon={gift.icon}
              color={gift.color}
              delay={gift.delay}
              onClick={handleGiftClick}
            />
          ))}
        </div>
      </div>
      
      {/* Modal */}
      <Modal 
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default App;
