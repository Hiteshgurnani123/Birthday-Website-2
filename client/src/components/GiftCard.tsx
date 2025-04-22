import { FC } from "react";

interface GiftCardProps {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  delay: string;
  onClick: (id: number) => void;
}

const GiftCard: FC<GiftCardProps> = ({ 
  id, 
  title, 
  description, 
  icon, 
  color, 
  delay, 
  onClick 
}) => {
  const getColorClass = () => {
    switch (color) {
      case "pink":
        return "bg-[var(--pastel-pink)]";
      case "purple":
        return "bg-[var(--pastel-purple)]";
      case "blue":
        return "bg-[var(--pastel-blue)]";
      default:
        return "bg-[var(--pastel-blue)]";
    }
  };
  
  return (
    <div 
      className="gift-card opacity-0 animate-fadeIn bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 border border-white border-opacity-30 flex flex-col items-center justify-center hover:animate-glow"
      style={{ animationDelay: delay }}
      onClick={() => onClick(id)}
    >
      <div className={`w-16 h-16 rounded-full ${getColorClass()} bg-opacity-70 flex items-center justify-center mb-4 shadow-lg`}>
        <i className={`fas fa-${icon} text-white text-2xl`}></i>
      </div>
      <h3 className="text-xl font-dancing font-bold text-white mb-2">{title}</h3>
      <p className="text-white text-opacity-90 text-center text-sm">{description}</p>
    </div>
  );
};

export default GiftCard;
