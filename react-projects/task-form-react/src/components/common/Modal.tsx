import { useEffect } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="
          bg-gradient-to-br from-white to-blue-50 
          rounded-2xl p-6 max-w-md w-full 
          shadow-xl shadow-teal-900/10 
          border border-teal-100/30
          animate-fadeIn
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-teal-900">{title}</h2>
          <button 
            onClick={onClose}
            className="text-teal-500 hover:text-teal-700 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-gray-700">
          {children}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="
              px-5 py-2.5 
              bg-gradient-to-r from-teal-400 to-teal-500 
              text-white font-medium rounded-lg 
              shadow-md shadow-teal-500/20
              hover:shadow-lg hover:shadow-teal-500/30 
              focus:outline-none focus:ring-2 focus:ring-teal-300
              transition-all duration-200
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
