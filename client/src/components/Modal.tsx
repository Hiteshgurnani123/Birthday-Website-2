import { FC, useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);
  
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="modal-bg absolute inset-0 bg-black bg-opacity-30" 
        onClick={handleClose}
      ></div>
      <div 
        className={`relative bg-white bg-opacity-40 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-[var(--pastel-pink)] rounded-full flex items-center justify-center mb-6 animate-float">
            <i className="fas fa-heart text-white text-3xl"></i>
          </div>
          <h3 className="text-3xl font-dancing font-bold text-[var(--ghibli-dark)] mb-4">
            A promise has been sealed with a smile!
          </h3>
          <p className="mb-6 text-[var(--ghibli-dark)]">
            This special moment has been captured in your heart.
          </p>
          <button 
            className="bg-[var(--pastel-pink)] bg-opacity-70 hover:bg-opacity-90 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            onClick={handleClose}
          >
            Continue the magic
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
