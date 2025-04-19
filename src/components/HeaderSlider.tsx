import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Apple, Shield, Zap, Globe, Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9",
    icon: Unlock,
    title: "Apple Device Unlock",
    description: "Professional unlocking service for all Apple devices - iPhone, iPad, and MacBook."
  },
  {
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9",
    icon: Shield,
    title: "Safe & Secure",
    description: "Official unlocking method that preserves your warranty and device security."
  },
  {
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9",
    icon: Zap,
    title: "Lightning Fast Service",
    description: "Most devices unlocked within 24 hours with 100% success guarantee."
  },
  {
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9",
    icon: Globe,
    title: "Worldwide Coverage",
    description: "Use your device with any carrier, anywhere in the world."
  }
];

export default function HeaderSlider() {
  const scrollToDevices = () => {
    const devicesSection = document.getElementById('devices-section');
    if (devicesSection) {
      devicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="relative"
      >
        {slides.map((slide, index) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={index}>
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-r from-blue-600 to-blue-800">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url(${slide.image}?auto=format&fit=crop&w=2000&q=80)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(8px)'
                  }}
                />
                
                <div className="relative h-full flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="container mx-auto px-4 text-center text-white"
                  >
                    <motion.div 
                      className="flex items-center justify-center mb-4 md:mb-6"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="w-10 h-12 md:w-16 md:h-16 mr-3 md:mr-4" />
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">{slide.title}</h1>
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto px-3"
                    >
                      {slide.description}
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="mt-6 md:mt-8"
                    >
                      <motion.button
                        onClick={scrollToDevices}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-blue-600 px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Get Started Now
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}