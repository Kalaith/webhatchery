import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'default' | 'large';
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'default',
  footer 
}) => {
  const modalContentClass = size === 'large' 
    ? 'w-full max-w-4xl mx-4 max-h-[90vh] bg-white rounded-lg shadow-xl relative flex flex-col' 
    : 'w-full max-w-lg mx-4 max-h-[90vh] bg-white rounded-lg shadow-xl relative flex flex-col';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className={modalContentClass}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800 pr-4">{title}</h2>
              <button 
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none font-bold focus:outline-none flex-shrink-0"
                onClick={onClose}
              >
                &times;
              </button>
            </div>
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
              {children}
            </div>
            {footer && (
              <div className="flex flex-col sm:flex-row gap-3 p-4 lg:p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
