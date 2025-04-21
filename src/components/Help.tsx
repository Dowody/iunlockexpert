import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Phone, Mail, HelpCircle, ChevronDown,
  Search, Clock, Shield, AlertCircle, CheckCircle, XCircle, Zap, MessageSquare
} from 'lucide-react';
import Navigation from './Navigation';
import Footer from './Footer';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does the unlocking process work?",
    answer: "Our unlocking process is simple and secure. Once you submit your device details and make payment, we process your unlock request through official channels. You'll receive instructions within the guaranteed timeframe, usually 24-48 hours.",
    category: "Process"
  },
  {
    question: "Is my warranty affected?",
    answer: "No, our unlocking method is official and preserves your warranty. We use the same methods as carriers and manufacturers, ensuring your device remains fully supported.",
    category: "General"
  },
  {
    question: "What if the unlock fails?",
    answer: "We offer a 100% money-back guarantee. If we can't unlock your device for any reason, you'll receive a full refund with no questions asked.",
    category: "Support"
  },
  {
    question: "How long does it take?",
    answer: "Processing times vary by service level and device type. Premium service typically completes within 24 hours, while standard service takes 1-3 business days.",
    category: "Process"
  },
  {
    question: "Can all devices be unlocked?",
    answer: "Most devices can be unlocked, but there are some exceptions. Devices must not be reported lost/stolen, and any outstanding financial obligations to the carrier must be settled.",
    category: "General"
  },
  {
    question: "Do I need to send my device?",
    answer: "No, our unlocking process is done remotely. Your device never leaves your possession, making it safe and convenient.",
    category: "Process"
  }
];

export default function Help() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories = ['All', 'Process', 'General', 'Support'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
            <p className="text-xl text-blue-100 mb-8">
              Find answers to common questions or contact our support team
            </p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.question ? null : faq.question)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                      expandedFAQ === faq.question ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedFAQ === faq.question && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">WhatsApp Support</h3>
              <p className="text-gray-600 mb-4">Get instant help via WhatsApp</p>
              <a 
                href="https://wa.me/15793860596" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                Start Chat
              </a>
            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">WhatsApp Support</h3>
              <p className="text-gray-600 mb-4">Quick support via WhatsApp</p>
              <a 
                href="https://wa.me/18007865274" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Connect Now
              </a>
            </motion.div> */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Get help via email</p>
              <a 
                href="mailto:support@iunlockexpert.com" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Send Email
              </a>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
