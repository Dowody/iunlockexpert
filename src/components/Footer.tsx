import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Mail, Clock, CheckCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const paymentMethods = [
  'Bitcoin', 'ETH', 'USDT'
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 mb-6"
            >
              <img 
                src="logo3.png" 
                alt="iUnlockExpert Logo" 
                className="w-45 h-10 md:w-45 md:h-10"
              />
              {/* <span className="text-2xl font-bold">iUnlockExpert</span> */}
            </motion.div>
            <p className="text-gray-400 mb-6">
              Your trusted phone unlocking service provider since 2024. We offer professional unlocking solutions for all Apple devices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/order-status" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5" />
                <span>support@iunlockexpert.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Clock className="w-5 h-5" />
                <span>24/7 Support Available</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>Global Service Coverage</span>
              </li>
            </ul>
          </div>

          {/* Trust Badges */}
          <div>
            <h4 className="text-lg font-semibold mb-6">We Accept</h4>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method}
                  className="bg-gray-800 rounded px-3 py-2 text-xs text-center text-gray-400"
                >
                  {method}
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-2 text-gray-400">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Globe className="w-5 h-5 text-blue-500" />
                <span>Worldwide Service</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Money-back Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 iUnlockExpert. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}