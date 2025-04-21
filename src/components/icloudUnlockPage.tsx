import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Cloud, Lock, Unlock, CheckCircle, 
  Clock, Globe, HelpCircle, Zap, Search 
} from 'lucide-react';
import Navigation from './Navigation';
import Footer from './Footer';

export default function IcloudUnlockPage() {
  const navigate = useNavigate();

  const handleStartUnlock = () => {
    navigate('/device-catalog');
  };

  const handleIMEICheck = () => {
    navigate('/imei-check');
  };

  const icloudFeatures = [
    {
      icon: Lock,
      title: 'Complete iCloud Unlock',
      description: 'Permanently remove iCloud lock without losing device data.'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Most iCloud unlock requests are processed within 24-48 hours.'
    },
    {
      icon: Globe,
      title: 'Global Compatibility',
      description: 'Works with all iPhone and iPad models worldwide.'
    }
  ];

  const unlockSteps = [
    'Verify device eligibility',
    'Provide device details',
    'Select iCloud unlock service',
    'Complete secure payment',
    'Receive unlock instructions',
    'Apply instructions to remove iCloud lock'
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
              <Cloud className="w-10 h-10 text-white" />
              <h1 className="text-4xl md:text-5xl font-bold">iCloud Unlock Service</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Professional iCloud lock removal for Apple devices
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What is iCloud Unlock?</h2>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              iCloud lock prevents unauthorized access to a device after it's been reset. 
              Our iCloud unlock service helps you regain full access to your Apple device.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {icloudFeatures.map((feature, index) => (
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
            Start iCloud Unlock
          </motion.button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
