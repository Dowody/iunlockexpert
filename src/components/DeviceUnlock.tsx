import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronRight, Shield, Check, Clock, 
  AlertCircle, Zap, Lock, Timer, 
  GlobeLock, Cloud, ShieldOff, Home, ArrowLeft, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateReceipt } from '../utils/generateReceipt';
import { createAppKit } from '@reown/appkit/react'
import { networks, projectId, metadata, ethersAdapter } from './config';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { bsc, mainnet } from 'viem/chains';

createAppKit({
  adapters: [ethersAdapter],
  networks,
  metadata,
  projectId,
  themeMode: 'dark',
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    '--w3m-accent': '#FFFFFF',
  }
})

const carriers = [
  "AT&T", "T-Mobile", "Verizon", "Sprint", 
  "O2", "Vodafone", "EE", "Orange",
  "Three", "Rogers", "Bell", "Telus", 
  "MX Iusacell", "Other"
];

interface UnlockService {
  id: string;
  name: string;
  icon: React.ElementType;
  originalPrice: number;
  discountedPrice: number;
  averageTime: string;
  deliveryTime: string;
  successRate: string;
  description: string;
  detailedDescription: string;
  features: string[];
  type: string;
}

const services: UnlockService[] = [
  {
    id: "mdm",
    name: "MDM Bypass",
    icon: ShieldOff,
    originalPrice: 59.99,
    discountedPrice: 39.99,
    averageTime: "24 hours",
    deliveryTime: "24 hours guaranteed",
    successRate: "99.9%",
    description: "Remove Mobile Device Management restrictions",
    detailedDescription: "Mobile Device Management (MDM) can limit your device's functionality. Our MDM bypass service completely removes these restrictions, giving you full control over your Apple device. This process is safe, permanent, and does not require jailbreaking.",
    features: [
      "Permanent MDM removal",
      "Works for all iOS devices",
      "No jailbreak required",
      "Quick 24-hour processing"
    ],
    type: "mdm-bypass"
  },
  {
    id: "icloud",
    name: "iCloud Unlock",
    icon: Cloud,
    originalPrice: 69.99,
    discountedPrice: 49.99,
    averageTime: "24-48 hours",
    deliveryTime: "3 business days",
    successRate: "99.9%",
    description: "Unlock iCloud-locked Apple devices",
    detailedDescription: "Stuck with an iCloud-locked device? Our professional iCloud unlock service helps you regain full access to your Apple device. We use official methods to remove iCloud activation locks, ensuring your device's integrity and functionality.",
    features: [
      "Official iCloud unlock method",
      "Supports all iPhone models",
      "Worldwide service",
      "100% success guarantee"
    ],
    type: "icloud-unlock"
  },
  {
    id: "sim",
    name: "SIM Unlock",
    icon: GlobeLock,
    originalPrice: 49.95,
    discountedPrice: 29.99,
    averageTime: "3-5 days",
    deliveryTime: "7 business days",
    successRate: "99.9%",
    description: "Carrier unlock for mobile devices",
    detailedDescription: "Free your device from carrier restrictions. Our SIM unlock service allows you to use your phone with any carrier worldwide. We provide a permanent unlock that works across international networks.",
    features: [
      "Permanent carrier unlock",
      "Compatible with all carriers",
      "Global network support",
      "Fast and secure process"
    ],
    type: "sim-unlock"
  }
];

const cryptoPayments = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    discount: 10,
    address: "bc1q7r2ufw8e9xtsa4rca9zxyy35paqw7pmkn2gt5f"
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    discount: 8,
    address: "0x64202323B358bbd9fF1B8F62718Fd893d9Ae6A9A"
  },
  {
    name: "USDT",
    symbol: "USDT",
    discount: 5,
    address: "0x64202323B358bbd9fF1B8F62718Fd893d9Ae6A9A"
  }
];

export default function DeviceUnlock() {
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

  const openWalletModal = () => setWalletModalOpen(true);
  const closeWalletModal = () => setWalletModalOpen(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { model } = useParams();
  const [step, setStep] = useState(1);
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [selectedService, setSelectedService] = useState<UnlockService | null>(null);
  const [imei, setImei] = useState("");
  const [email, setEmail] = useState("");
  const [includeBlacklistCheck, setIncludeBlacklistCheck] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [imeiError, setImeiError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Validation methods
  const validateIMEI = (imei: string) => {
    if (!/^\d{15}$/.test(imei)) {
      return "IMEI must be exactly 15 digits";
    }
    
    let sum = 0;
    let isEven = false;
    
    for (let i = imei.length - 1; i >= 0; i--) {
      let digit = parseInt(imei[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    if (sum % 10 !== 0) {
      return "Invalid IMEI number";
    }
    
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleIMEIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 15);
    setImei(value);
    setImeiError(validateIMEI(value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    // Reset all state
    setStep(1);
    setSelectedCarrier("");
    setSelectedService(null);
    setImei("");
    setEmail("");
    setIncludeBlacklistCheck(false);
    setAcceptedTerms(false);
    
    // Navigate to home
    navigate('/');
  };


  
  const CancelModal = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Confirm Cancellation</h2>
          <button 
            onClick={() => setShowCancelModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel? All entered information will be lost.
        </p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={() => setShowCancelModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            No, Continue
          </button>
          <button 
            onClick={confirmCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Yes, Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderServiceSummaryBar = () => {
    if (!selectedService) return null;

    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <selectedService.icon className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">{selectedService.name}</h3>
            <p className="text-sm text-blue-700">
              {selectedService.description} | €{selectedService.discountedPrice}
            </p>
          </div>
        </div>
        {selectedService.type === 'sim-unlock' && selectedCarrier && (
          <div className="text-sm text-blue-800">
            <strong>Carrier:</strong> {selectedCarrier}
          </div>
        )}
      </div>
    );
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Shimmering gold effect animation
  const shimmerVariants = {
    initial: { backgroundPosition: '0 0' },
    animate: {
      backgroundPosition: ['0 0', '100% 0'],
      transition: {
        repeat: Infinity,
        repeatType: "mirror" as const,
        duration: 3,
        ease: "linear"
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => navigate('/device-catalog')}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Device Catalog</span>
              </button>
              <button 
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>

            <h2 className="text-xl font-semibold mb-4">Select Service</h2>
            <div className="space-y-6">
              {services.map((service) => (
                <motion.div 
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white rounded-lg border p-6 transition-all duration-300 cursor-pointer ${
                    selectedService?.id === service.id 
                      ? 'border-blue-600 shadow-lg' 
                      : 'hover:border-blue-300'
                  }`}
                  onClick={() => {
                    setSelectedService(service);
                    if (service.type === 'sim-unlock') {
                      setStep(2); // Go to carrier selection for SIM unlock
                    } else {
                      setStep(2); // Go to details for other services
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600">{service.name}</h3>
                      <p className="text-green-600">Success rate: {service.successRate}</p>
                    </div>
                    <div className="text-right">
                      <span className="line-through text-gray-500">€{service.originalPrice}</span>
                      <span className="text-2xl font-bold text-blue-600 ml-2">€{service.discountedPrice}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{service.detailedDescription}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {showCancelModal && <CancelModal />}
            </AnimatePresence>
          </div>
        );

      case 2:
        // Carrier selection for SIM unlock
        if (selectedService?.type === 'sim-unlock') {
          return (
            <div>
              {renderServiceSummaryBar()}
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => setStep(1)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button 
                  onClick={handleCancel}
                  className="text-red-600 hover:text-red-700 flex items-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
              <h2 className="text-xl font-semibold mb-4">Select Original Carrier</h2>
              <p className="text-gray-600 mb-6">
                Please select the original network provider to which your device is locked
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {carriers.map((carrier) => (
                  <button
                    key={carrier}
                    className={`p-4 border rounded-lg text-left ${
                      selectedCarrier === carrier
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                    onClick={() => {
                      setSelectedCarrier(carrier);
                      setStep(3);
                    }}
                  >
                    {carrier}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {showCancelModal && <CancelModal />}
              </AnimatePresence>
            </div>
          );
        }
        
        // Details form for MDM and iCloud
        return (
          <div>
            {renderServiceSummaryBar()}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button 
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4">Enter Device Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">IMEI Number</label>
                <input
                  type="text"
                  placeholder="Type *#06# to find IMEI"
                  className={`w-full p-2 border rounded ${imeiError ? 'border-red-500' : ''}`}
                  value={imei}
                  onChange={handleIMEIChange}
                />
                {imeiError && <p className="text-red-500 text-sm mt-1">{imeiError}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full p-2 border rounded ${emailError ? 'border-red-500' : ''}`}
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="blacklistCheck"
                  checked={includeBlacklistCheck}
                  onChange={(e) => setIncludeBlacklistCheck(e.target.checked)}
                />
                <label htmlFor="blacklistCheck">Include Blacklist Check (+€2.95)</label>
              </div>

              <div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      setShowTermsError(false);
                    }}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm">
                    I agree to the <Link to="/terms" className="text-blue-600 hover:underline" target="_blank">Terms and Conditions</Link> and accept the use of my info
                  </label>
                </div>
                {showTermsError && (
                  <p className="text-red-500 text-sm mt-2">
                    Please read and accept the Terms and Conditions
                  </p>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    const imeiValidation = validateIMEI(imei);
                    const emailValidation = validateEmail(email);
                    
                    setImeiError(imeiValidation);
                    setEmailError(emailValidation);
                    
                    if (!acceptedTerms) {
                      setShowTermsError(true);
                      return;
                    }
                    
                    if (!imeiValidation && !emailValidation) {
                      setStep(3);
                    }
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showCancelModal && <CancelModal />}
            </AnimatePresence>
          </div>
        );

      case 3:
        return (
          <div>
            {renderServiceSummaryBar()}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => selectedService?.type === 'sim-unlock' ? setStep(2) : setStep(2)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button 
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-white rounded-lg border p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Device</span>
                  <span className="font-semibold">{model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-semibold">{selectedService?.name}</span>
                </div>
                {selectedService?.type === 'sim-unlock' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carrier</span>
                    <span>{selectedCarrier}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">IMEI</span>
                  <span>{imei}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span>{email}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Price</span>
                    <span className="line-through">€{selectedService?.originalPrice}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -€{(
                        (selectedService?.originalPrice || 0) - 
                        (selectedService?.discountedPrice || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  {includeBlacklistCheck && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blacklist Check</span>
                      <span>€2.95</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold mt-2">
                    <span>Total</span>
                    <span>
                      €{(
                        (selectedService?.discountedPrice || 0) + 
                        (includeBlacklistCheck ? 2.95 : 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setStep(4)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showCancelModal && <CancelModal />}
            </AnimatePresence>
          </div>
        );

      case 4:
        return (
          <div>
            {renderServiceSummaryBar()}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setStep(3)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button 
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            <div className="bg-white rounded-lg border p-6">
              {/* <WalletButton /> */}


              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cryptoPayments.map((crypto) => (
                  <button
                    key={crypto.name}
                    onClick={() => handleCryptoPayment(crypto)}
                    disabled={isProcessing}
                    className="p-6 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono text-sm">
                        {crypto.symbol}
                      </div>
                      <span className="font-medium">{crypto.name}</span>
                      <span className="text-green-600 font-semibold">Save {crypto.discount}%</span>
                    </div>
                  </button>
                ))}
              </div> */}

          <div className="relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 ">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-900 opacity-100 "></div>
          <motion.div 
            className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-20"
            animate={{
              backgroundPosition: ['0px 0px', '100px 100px'],
              transition: {
                duration: 40,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }
            }}
          ></motion.div>
          {/* Gold accent lines */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"
            initial={{ opacity: 0, x: -200 }}
            animate={{ 
              opacity: [0, 0.7, 0], 
              x: ['-100%', '200%'],
              transition: {
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 3
              }
            }}
          ></motion.div>
        </div>

        
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24 lg:py-32">
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
              animate={{ scale: [1, 1.01, 1], transition: { duration: 5, repeat: Infinity } }}
            >
              <span className="block text-white">Secure Payment</span>
              <motion.span 
                className="block bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              >
                With Crypto
              </motion.span>
            </motion.h1>
            
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300">
             Allowing all kind of Crypto wallets to pay with.
            </p>

            <div className="flex justify-center pt-10 m-0">
              <appkit-button/>
            </div>
            
            <div className="mt-10 flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(245, 158, 11, 0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={openWalletModal}
                className="py-4 px-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg font-bold shadow-lg transition-all text-gray-900 flex items-center gap-2 hover:from-amber-400 hover:to-yellow-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Pay Now
              </motion.button>
              
            </div>
            
          </motion.div>
        </div>
      </div>


            </div>

            <AnimatePresence>
              {showCancelModal && <CancelModal />}
            </AnimatePresence>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
