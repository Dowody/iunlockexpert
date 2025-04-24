import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, AlertCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({ 
  phoneNumber = '+15793860596', 
  message = 'Hello! I need help with device unlocking.' 
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    try {
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      
      if (!/^\+?[1-9]\d{1,14}$/.test(cleanPhoneNumber)) {
        console.error('Invalid phone number format');
        alert('Invalid WhatsApp contact number');
        return;
      }

      const encodedMessage = encodeURIComponent(message);
      
      const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('WhatsApp button error:', error);
      alert('Unable to open WhatsApp. Please try again.');
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleWhatsAppClick}
      className="fixed bottom-20 right-4 md:bottom-20 md:right-4 bg-green-500 text-white w-14 h-14 md:w-14 md:h-14 rounded-full shadow-2xl z-50 transition-all duration-200 flex items-center justify-center"
    >
      {/* <MessageCircle className="w-8 h-8 md:w-8 md:h-8" /> */}
      <img 
        src="/iunlockexpert/whatsapp.png" 
        alt="WhatsApp" 
        className="w-8 h-8 md:w-8 md:h-8 invert" 
      />

    </motion.button>
  );
}
