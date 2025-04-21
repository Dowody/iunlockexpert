import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldOff, Cloud, GlobeLock, 
  Shield, Clock, CheckCircle, 
  Globe, Users, Zap, Lock, Headphones,
  ChevronRight, MousePointerClick
} from 'lucide-react';
import Navigation from './Navigation';
import Footer from './Footer';

const services = [
  {
    icon: ShieldOff,
    title: 'MDM Bypass',
    description: 'Remove Mobile Device Management restrictions',
    price: 'From $39.99',
    features: [
      'Permanent MDM removal',
      'Works for all iOS devices',
      'No jailbreak required',
      'Quick 24-hour processing'
    ],
    type: 'mdm-bypass'
  },
  {
    icon: Cloud,
    title: 'iCloud Unlock',
    description: 'Unlock iCloud-locked Apple devices',
    price: 'From $49.99',
    features: [
      'Official iCloud unlock method',
      'Supports all iPhone models',
      'Worldwide service',
      '100% success guarantee'
    ],
    type: 'icloud-unlock'
  },
  {
    icon: GlobeLock,
    title: 'SIM Unlock',
    description: 'Carrier unlock for mobile devices',
    price: 'From $29.99',
    features: [
      'Permanent carrier unlock',
      'Compatible with all carriers',
      'Global network support',
      'Fast and secure process'
    ],
    type: 'sim-unlock'
  }
];

const features = [
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Advanced security protocols for device unlocking'
  },
  {
    icon: Clock,
    title: 'Fast Processing',
    description: 'Most services completed within 24-48 hours'
  },
  {
    icon: Globe,
    title: 'Worldwide Service',
    description: 'Support for devices from all countries and regions'
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: '24/7 professional assistance via multiple channels'
  },
  {
    icon: CheckCircle,
    title: 'Guaranteed Results',
    description: 'Money-back guarantee if service cannot be completed'
  },
  {
    icon: Lock,
    title: 'Permanent Solution',
    description: 'One-time unlock that maintains device functionality'
  }
];

export default function Services() {
  const navigate = useNavigate();

  const handleServiceSelect = (type: string) => {
    switch(type) {
      case 'mdm-bypass':
        navigate('/services/mdm-bypass');
        break;
      case 'icloud-unlock':
        navigate('/services/icloud-unlock');
        break;
      case 'sim-unlock':
        navigate('/services/sim-unlock');
        break;
    }
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Unlock Your Device</h1>
            <p className="text-xl text-blue-100">
              Professional unlocking solutions for all your Apple device needs
            </p>
          </motion.div>
        </div>
      </div>

      <div id="services" className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
            <MousePointerClick className="w-6 h-6 animate-bounce" />
            <span className="text-lg font-medium">Select a service to view available options</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleServiceSelect(service.type)}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative group"
            >
              <div className="absolute top-4 right-4">
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <service.icon className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-2xl font-bold text-blue-600 mb-6">{service.price}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                    View Options <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 md:mt-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Why Choose Our Unlocking Services?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
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
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Personalized Assistance?</h2>
            <p className="text-gray-600 mb-6">
              Our expert team is ready to help you choose the right unlocking solution
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
