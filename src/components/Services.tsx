import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, Tablet, Laptop, Shield, Clock, CheckCircle, 
  Globe, Users, Zap, Lock, CreditCard, Headphones, Search,
  ChevronRight, MousePointerClick
} from 'lucide-react';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import Footer from './Footer';

const appleDevices = {
  iphone: [
    { model: "iPhone 16 Pro Max", price: "$34.99", image: "https://images.unsplash.com/photo-1592286927505-1def25115558" },
    { model: "iPhone 16 Pro", price: "$34.99", image: "https://images.unsplash.com/photo-1592286927505-1def25115558" },
    { model: "iPhone 15 Pro Max", price: "$29.99", image: "https://images.unsplash.com/photo-1592286927505-1def25115558" },
    { model: "iPhone 15 Pro", price: "$29.99", image: "https://images.unsplash.com/photo-1592286927505-1def25115558" }
  ],
  macbook: [
    { model: "MacBook Pro 16-inch (2023) M2 Pro/Max", price: "$49.99", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9" },
    { model: "MacBook Pro 14-inch (2023) M2 Pro/Max", price: "$49.99", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9" },
    { model: "MacBook Air 15-inch (2023) M2", price: "$39.99", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9" },
    { model: "MacBook Air 13-inch (2022) M2", price: "$39.99", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9" }
  ],
  ipad: [
    { model: "iPad Pro 12.9-inch (6th generation)", price: "$34.99", image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9" },
    { model: "iPad Pro 11-inch (4th generation)", price: "$34.99", image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9" },
    { model: "iPad Air (5th generation)", price: "$29.99", image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9" },
    { model: "iPad (10th generation)", price: "$24.99", image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9" }
  ]
};

const services = [
  {
    icon: Smartphone,
    title: 'iPhone Unlock',
    description: 'Official carrier unlock for all iPhone models',
    price: 'From $29.99',
    features: [
      'Permanent unlock',
      'All carriers supported',
      'Fast processing',
      'Money-back guarantee'
    ],
    type: 'iphone'
  },
  {
    icon: Tablet,
    title: 'iPad Unlock',
    description: 'Unlock cellular iPads for any carrier',
    price: 'From $34.99',
    features: [
      'All iPad models',
      'Worldwide carriers',
      'Express service',
      '100% success rate'
    ],
    type: 'ipad'
  },
  {
    icon: Laptop,
    title: 'MacBook Unlock',
    description: 'Remove carrier locks from MacBooks',
    price: 'From $49.99',
    features: [
      'All MacBook models',
      'Official unlock method',
      'Lifetime guarantee',
      '24/7 support'
    ],
    type: 'macbook'
  }
];

const features = [
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Official unlocking methods that preserve your warranty'
  },
  {
    icon: Clock,
    title: 'Fast Processing',
    description: 'Most devices unlocked within 24-48 hours'
  },
  {
    icon: Globe,
    title: 'Worldwide Service',
    description: 'Support for carriers from all countries'
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: '24/7 customer service via chat, email, or phone'
  },
  {
    icon: CheckCircle,
    title: 'Guaranteed Results',
    description: '100% money-back guarantee if we cant unlock'
  },
  {
    icon: Lock,
    title: 'Permanent Unlock',
    description: 'One-time unlock that survives updates'
  }
];

export default function Services() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const devicesRef = useRef<HTMLDivElement>(null);

  const handleServiceSelect = (type: string) => {
    setSelectedService(type);
    setSearchTerm("");
    
    setTimeout(() => {
      devicesRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const filteredDevices = selectedService 
    ? appleDevices[selectedService as keyof typeof appleDevices].filter(device =>
        device.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleGetStarted = (model: string) => {
    navigate(`/unlock/${encodeURIComponent(model)}`);
  };

  const handleContactSupport = () => {
    navigate('/help');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-blue-100">
              Professional unlocking services for all your Apple devices
            </p>
          </motion.div>
        </div>
      </div>

      <div id="services" className="container mx-auto px-4 py-12 md:py-16">
        {!selectedService && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
              <MousePointerClick className="w-6 h-6 animate-bounce" />
              <span className="text-lg font-medium">Select a service to view available devices</span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleServiceSelect(service.type)}
              className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 relative ${
                selectedService === service.type 
                  ? 'ring-2 ring-blue-600 scale-105' 
                  : 'hover:scale-105 hover:shadow-xl'
              }`}
            >
              <div className="absolute top-4 right-4">
                <ChevronRight className={`w-6 h-6 transition-colors duration-300 ${
                  selectedService === service.type ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <service.icon className={`w-8 h-8 transition-colors duration-300 ${
                    selectedService === service.type ? 'text-blue-600' : 'text-gray-700'
                  }`} />
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-2xl font-bold text-blue-600 mb-6">{service.price}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center text-blue-600 font-medium">
                    View Devices <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedService && (
          <motion.div
            ref={devicesRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-12 scroll-mt-24"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Select Your Device</h2>
              
              <div className="max-w-2xl mx-auto mb-8">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredDevices.map((device, index) => (
                  <motion.div
                    key={device.model}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <img 
                      src={device.image} 
                      alt={device.model} 
                      className="w-full h-32 sm:h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-sm font-semibold mb-2 line-clamp-2">{device.model}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-semibold">{device.price}</span>
                        <button
                          onClick={() => handleGetStarted(device.model)}
                          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors duration-300"
                        >
                          Unlock Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-16 md:mt-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Why Choose Our Services?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <feature.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 md:mt-24 text-center"
        >
          <div className="bg-blue-50 rounded-xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-gray-600 mb-6">
              Our experts are available 24/7 to help you select the right service for your device
            </p>
            <button 
              onClick={handleContactSupport}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 mx-auto"
            >
              <Headphones className="w-5 h-5" />
              <span>Contact Support</span>
            </button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}