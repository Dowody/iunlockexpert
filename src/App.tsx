import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, CheckCircle, Award, Clock, Globe, Users, 
  Phone, MessageSquare, HelpCircle, Laptop, Tablet, 
  Smartphone, Unlock
} from 'lucide-react';
import DeviceUnlock from './components/DeviceUnlock';
import DeviceCard from './components/DeviceCard';
import SearchBar from './components/SearchBar';
import HeaderSlider from './components/HeaderSlider';
import Navigation from './components/Navigation';
import TermsAndConditions from './components/TermsAndConditions';
import IMEIChecker from './components/IMEIChecker';
import OrderStatus from './components/OrderStatus';
import Services from './components/Services';
import Help from './components/Help';
import Receipt from './components/Receipt';
import Footer from './components/Footer';

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

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("iphone");
  
  const filteredDevices = appleDevices[selectedCategory as keyof typeof appleDevices].filter(device => 
    device.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const benefits = [
    {
      icon: Award,
      title: "Trusted Reputation",
      description: "The recommended method by phone manufacturers and network providers worldwide."
    },
    {
      icon: Shield,
      title: "100% Safe & Legal",
      description: "Official unlocking method that maintains your warranty and device integrity."
    },
    {
      icon: CheckCircle,
      title: "Guaranteed Results",
      description: "Your satisfaction is guaranteed or your money back, no questions asked."
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Most devices are unlocked within 24 hours of request submission."
    },
    {
      icon: Phone,
      title: "Keep Your Phone",
      description: "Remote unlocking process - your phone never leaves your possession."
    },
    {
      icon: MessageSquare,
      title: "24/7 Support",
      description: "Expert assistance available around the clock via chat, phone, or email."
    },
    {
      icon: Globe,
      title: "Worldwide Freedom",
      description: "Use your phone with any carrier anywhere in the world."
    },
    {
      icon: Users,
      title: "Proven Experience",
      description: "Over 5 million successful unlocks and counting."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeaderSlider />
      
      <IMEIChecker />

      <div id="devices-section" className="container mx-auto px-3 md:px-4 py-6 md:py-12 scroll-mt-24">
        <div className="flex justify-center space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory("iphone")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300 ${
              selectedCategory === "iphone" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Smartphone className="w-4 h-4 md:w-5 md:h-5" />
            <span>iPhones</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory("ipad")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300 ${
              selectedCategory === "ipad" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Tablet className="w-4 h-4 md:w-5 md:h-5" />
            <span>iPads</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory("macbook")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300 ${
              selectedCategory === "macbook" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Laptop className="w-4 h-4 md:w-5 md:h-5" />
            <span>MacBooks</span>
          </motion.button>
        </div>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-8">
          {filteredDevices.map((device, index) => (
            <DeviceCard key={device.model} {...device} index={index} />
          ))}
        </div>
      </div>

      <section className="bg-gray-100 py-12 md:py-24">
        <div className="container mx-auto px-3 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Why Choose iUnlockExpert?</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the safest, fastest, and most reliable phone unlocking service in the industry.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300"
              >
                <div className="flex items-start">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0"
                  >
                    <benefit.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </motion.div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/unlock/:model" element={<DeviceUnlock />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/services" element={<Services />} />
        <Route path="/help" element={<Help />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>
    </>
  );
}

export default App;