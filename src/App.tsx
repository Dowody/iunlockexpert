import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      initial={false}
      className="border-b border-gray-200 py-3"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left group"
      >
        <h3 className="text-base md:text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-sm md:text-base text-gray-600"
          >
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BenefitCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <motion.div 
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
          <Icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
        </motion.div>
        <div className="ml-3 md:ml-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

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

  const faqs = [
    {
      question: "How do I unlock my phone with iUnlockExpert?",
      answer: "Simply select your device model and current carrier, make the payment, and we'll send you step-by-step instructions within the guaranteed delivery time. Our support team is available 24/7 if you need any assistance."
    },
    {
      question: "How much does it cost to unlock my phone?",
      answer: "Unlocking prices vary based on your device model and current carrier. The exact price will be displayed when you select your specific device. We regularly offer discounts of up to 50% off our standard prices."
    },
    {
      question: "Is the unlocking permanent?",
      answer: "Yes, once your phone is unlocked, it stays unlocked forever. You can update your phone's software and use it with any carrier worldwide without having to unlock it again."
    },
    {
      question: "How long does the process take?",
      answer: "Most devices are unlocked within 24 hours, though exact timing varies by model and carrier. You'll receive an estimated completion time before purchase."
    },
    {
      question: "Can unlocking damage my phone?",
      answer: "No, our unlocking method is official and safe. It's the same method used by carriers and manufacturers, so it won't void your warranty or damage your device."
    },
    {
      question: "What if the unlock doesn't work?",
      answer: "We offer a 100% money-back guarantee. If we can't unlock your device for any reason, you'll receive a full refund."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeaderSlider />

      <div className="container mx-auto px-3 md:px-4 py-6 md:py-12">
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
              <BenefitCard key={index} {...benefit} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-24">
        <div className="container mx-auto px-3 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Frequently Asked Questions</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our phone unlocking service.
            </p>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQ key={index} {...faq} />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-3 md:px-4">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 mb-4 md:mb-6"
              >
                <Unlock className="w-6 h-6 md:w-8 md:h-8" />
                <span className="text-xl md:text-2xl font-bold">iUnlockExpert</span>
              </motion.div>
              <p className="text-sm md:text-base text-gray-400">Your trusted phone unlocking service provider since 2024.</p>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Quick Links</h4>
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors duration-300">Home</Link></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Support</h4>
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Contact</h4>
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-gray-400">
                <li>support@iunlockexpert.com</li>
                <li>1-800-UNLOCK-PRO</li>
                <li>24/7 Customer Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-sm md:text-base text-gray-400">
            <p>&copy; 2024 iUnlockExpert. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/unlock/:model" element={<DeviceUnlock />} />
    </Routes>
  );
}

export default App;