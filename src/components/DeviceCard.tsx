import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface DeviceCardProps {
  model: string;
  price: string;
  image: string;
  description?: string;
  index: number;
}

export default function DeviceCard({ model, price, image, index }: DeviceCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <img 
        src={image} 
        alt={model} 
        className="w-full h-32 sm:h-40 md:h-48 object-cover"
      />
      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-base font-semibold mb-2 line-clamp-2">{model}</h3>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-semibold text-sm md:text-base">{price}</span>
          <button
            onClick={() => navigate(`/unlock/${encodeURIComponent(model)}`)}
            className="bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base hover:bg-blue-700 transition-colors duration-300"
          >
            Unlock Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}