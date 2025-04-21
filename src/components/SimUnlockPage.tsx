import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  GlobeLock, Lock, Unlock, CheckCircle, 
  Clock, Globe, HelpCircle, Zap, Search 
} from 'lucide-react';
import Navigation from './Navigation';
import Footer from './Footer';

export default function SimUnlockPage() {
  const navigate = useNavigate();

  const handleStartUnlock = () => {
    navigate('/device-catalog');
  };

  const handleIMEICheck = () => {
    navigate('/imei-check');
  };

  const simFeatures = [
    {
      icon: Lock,
      title: 'Permanent Carrier Unlock',
      description: 'Permanently remove carrier restrictions from your device.'
    },
    {
      icon: Zap,
      title: 'Quick Service',
      description: 'Most SIM unlock requests are processed within 24-48 hours.'
    },
    {
      icon: Globe,
      title: 'Global Compatibility',
      description: 'Works with carriers from all countries and regions.'
    }
  ];

  const unlockSteps = [
    'Check device carrier lock status',
    'Provide device details',
    'Select SIM unlock service',
    'Complete secure payment',
    'Receive unlock code/instructions',
    'Apply instructions to unlock device'
  ];

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
            <div className="flex items-center justify-center space-x-4 mb-4">
              <GlobeLock className="w-10 h-10 text-white" />
              <h1 className="text-4xl md:text-5xl font-bold">SIM Unlock Service</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Professional carrier unlock for mobile devices
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What is SIM Unlock?</h2>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              SIM unlock allows you to use your device with any carrier's SIM card. 
              Our service removes carrier restrictions, giving you the freedom to choose your network.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {simFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Unlock Process</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <ol className="space-y-4">
                {unlockSteps.map((step, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-blue-600">{index + 1}.</span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleIMEICheck}
                  className="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors flex items-center justify-center mx-auto space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Check Device IMEI</span>
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartUnlock}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start SIM Unlock
          </motion.button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
