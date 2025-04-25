import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronRight, Shield, Check, Clock, 
  AlertCircle, Zap, Lock, Timer, 
  GlobeLock, Cloud, ShieldOff, Home, ArrowLeft, X, 
  CheckCircle,
  Wallet,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateReceipt } from '../utils/generateReceipt';
import { createAppKit, useAppKit, useAppKitAccount, useAppKitProvider, useAppKitNetworkCore } from '@reown/appkit/react'
import { networks, projectId, metadata, ethersAdapter } from './config';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { bsc, mainnet } from 'viem/chains';
import WhatsAppButton from './WhatsAppButton';
import { BrowserProvider, JsonRpcSigner, parseEther } from 'ethers';
import type { Provider } from '@reown/appkit/react';

createAppKit({
  adapters: [ethersAdapter],
  networks,
  metadata,
  projectId,
  themeMode: 'light',
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    '--w3m-accent': '#000000',
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
    deliveryTime: "24 hours guaranteed",
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
    deliveryTime: "24 hours guaranteed",
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
    address: "bc1q0jjym5ylv66epkmdwu9qxj2cpnemguwtvy7c9d"
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    discount: 8,
    address: "0x9394CD307B4c1C37a0F4713CbD222238c077209a"
  },
  {
    name: "USDT TRC-20",
    symbol: "USDT",
    discount: 5,
    address: "TU4mc5DHHk4eyob4zQArsbiHnVRCFGYDDH"
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
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // AppKit hooks
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const { chainId } = useAppKitNetworkCore();

  // Update wallet connection state when isConnected changes
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected]);

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

  const [isWalletPaymentModalOpen, setIsWalletPaymentModalOpen] = useState(false);
  const [selectedCryptoMethod, setSelectedCryptoMethod] = useState<string | null>(null);

  const handleWalletPayment = async () => {
    if (!isConnected || !walletProvider || !address) {
      setPaymentError('Please connect your wallet first');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);
    setPaymentSuccess(false);
    setTransactionHash(null);

    // Calculate amount outside try block so it's accessible in catch block
    const amountInEth = ((selectedService?.discountedPrice || 0) + (includeBlacklistCheck ? 2.95 : 0)) / 2000;

    try {
      // Create provider and signer
      const provider = new BrowserProvider(walletProvider, chainId);
      const signer = new JsonRpcSigner(provider, address);

      // Prepare transaction
      const transaction = {
        to: "0x9394CD307B4c1C37a0F4713CbD222238c077209a", // Your receiving address
        value: parseEther(amountInEth.toString())
      };

      // Send transaction
      const tx = await signer.sendTransaction(transaction);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        setPaymentSuccess(true);
        setTransactionHash(tx.hash);
        
        // Generate receipt
        const receiptData = {
          orderId: `ORDER-${Date.now()}`,
          service: selectedService?.name || '',
          device: model || '',
          amount: amountInEth,
          originalPrice: selectedService?.originalPrice || 0,
          discount: selectedService?.originalPrice ? selectedService.originalPrice - selectedService.discountedPrice : 0,
          finalPrice: selectedService?.discountedPrice || 0,
          paymentMethod: 'WalletConnect',
          transactionHash: tx.hash,
          date: new Date().toISOString(),
          imei: imei,
          email: email
        };
        
        await generateReceipt(receiptData);
        
        // Close modal after successful payment
        setTimeout(() => {
          setIsWalletPaymentModalOpen(false);
          setStep(6); // Move to success step
        }, 2000);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      // Handle specific error types
      if (error.code === 'INSUFFICIENT_FUNDS') {
        setPaymentError(
          `Insufficient funds in your wallet. Please ensure you have enough ETH to cover the payment amount (${amountInEth} ETH) plus gas fees.`
        );
      } else if (error.code === 'USER_REJECTED') {
        setPaymentError('Transaction was rejected. Please try again if you want to proceed with the payment.');
      } else if (error.code === 'NETWORK_ERROR') {
        setPaymentError('Network error occurred. Please check your internet connection and try again.');
      } else if (error.message?.includes('gas')) {
        setPaymentError('Transaction failed due to gas estimation. Please try again with a different gas price.');
      } else {
        // Extract a more readable error message if available
        const errorMessage = error.error?.message || error.message || 'Transaction failed';
        const readableError = errorMessage
          .replace(/failed with \d+ gas: /, '')
          .replace(/address 0x[a-fA-F0-9]{40}/, 'your wallet')
          .replace(/have \d+ want \d+/, 'have insufficient funds');
        
        setPaymentError(`Payment failed: ${readableError}`);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const WalletPaymentModal = () => (
    <AnimatePresence>
      {isWalletPaymentModalOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0.98, opacity: 1 }}
            exit={{ scale: 0.1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">WalletConnect Payment</h2>
                <button 
                  onClick={() => setIsWalletPaymentModalOpen(false)}
                  className="text-white hover:text-blue-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-blue-100 mt-2">
                Complete your payment for {selectedService?.name}
              </p>
              <div className="mt-2 text-2xl font-bold">
                €{(
                  (selectedService?.discountedPrice || 0) + 
                  (includeBlacklistCheck ? 2.95 : 0)
                ).toFixed(2)}
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6 border-b">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Device</p>
                  <p className="font-semibold">{model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">IMEI</p>
                  <p className="font-semibold">{imei}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-semibold">{selectedService?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unlock Time</p>
                  <p className="font-semibold">{selectedService?.deliveryTime}</p>
                </div>
              </div>
            </div>

            {/* Crypto Method Selection */}
            <div className="p-6 border-b">
              <h3 className="text-md font-semibold mb-3">Select Cryptocurrency</h3>
              <div className="grid grid-cols-3 gap-3"
            >
                {cryptoPayments.map((crypto) => (
                  <motion.button
                    key={crypto.symbol}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setSelectedCryptoMethod(crypto.symbol);
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 border rounded-lg transition-all ${
                      selectedCryptoMethod === crypto.symbol 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">{crypto.symbol}</span>
                      <span className="text-xs text-green-600">
                        {/* Save {crypto.discount}% */}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Wallet Connect */}
            <AnimatePresence>
              {selectedCryptoMethod && (
                <motion.div
                  initial={{ opacity: 1, height: 0 }}
                  animate={{ opacity: 1, height: 0 }}
                  exit={{ opacity: 1, height: 0 }}
                  className="p-6 pb-52 border-b"
                >
                  <h3 className="text-md font-semibold mb-6">Connect Your Wallet</h3>
                  <div className="">
                    <appkit-button />
                  </div>

                  {isWalletConnected && (
                    <motion.div 
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-green-50 p-4 rounded-lg flex items-center space-x-3"
                    >
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">
                          Wallet Connected Successfully
                        </p>
                        <p className="text-sm text-green-700">
                          You can now proceed with the transaction
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pay Button */}
            <div className="p-6">
              <button
                onClick={handleWalletPayment}
                disabled={!selectedCryptoMethod || !isWalletConnected || isProcessingPayment}
                className="w-full bg-blue-600 text-white py-3 rounded-lg 
                  hover:bg-blue-700 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </div>
                ) : !isWalletConnected ? (
                  'Connect Wallet to Pay'
                ) : (
                  `Pay €${((selectedService?.discountedPrice || 0) + (includeBlacklistCheck ? 2.95 : 0)).toFixed(2)}`
                )}
              </button>

              {paymentError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {paymentError}
                </div>
              )}

              {paymentSuccess && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  Payment successful! Transaction hash: {transactionHash}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

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

  const [selectedCrypto, setSelectedCrypto] = useState(cryptoPayments[0].symbol);

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  
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

  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] = useState(false);
  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
  
    const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
  
    return (
      <button 
        onClick={handleCopy}
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    );
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
                      setStep(3); // Go to details for other services
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
        
      case 3:
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
                      setStep(4);
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

      case 4:
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
                  onClick={() => setStep(5)}
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

        case 5:
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

      <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Order Summary
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Device Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Device Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Device Model:</span>
                  <span className="font-medium">{model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IMEI:</span>
                  <span className="font-medium">{imei}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{email}</span>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Service Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                {selectedService?.type === 'sim-unlock' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carrier:</span>
                    <span className="font-medium">{selectedCarrier}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Unlock Time:</span>
                  <span className="font-medium">{selectedService?.deliveryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium text-green-600">{selectedService?.successRate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Original Price</span>
              <span className="line-through">€{selectedService?.originalPrice.toFixed(2)}</span>
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
              <span>Total Amount</span>
              <span>
                €{(
                  (selectedService?.discountedPrice || 0) + 
                  (includeBlacklistCheck ? 2.95 : 0)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Payment Methods Container */}
        <div className="bg-white rounded-xl shadow-lg p-6 ">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Payment Methods
          </h2>

          {/* WalletConnect Section */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-10">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Wallet className="w-6 h-6 mr-3 text-blue-600" />
            WalletConnect Fast Payment
          </h3>
          
          <div className="space-y-4">
            <p className="text-gray-700">
            Pay securely with any crypto wallet using WalletConnect — trusted worldwide.            </p>
            <button
              onClick={() => setIsWalletPaymentModalOpen(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Pay for {selectedService?.name} - €{(
                (selectedService?.discountedPrice || 0) + 
                (includeBlacklistCheck ? 2.95 : 0)
              ).toFixed(2)}
            </button>
          </div>
        </div>

        <WalletPaymentModal />



          {/* Manual Transfer Section */}
          <div>
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-yellow-600" />
                Manual Cryptocurrency Transfer
              </h3>

              <div className="space-y-6">
                {/* Transfer Instructions */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-gray-800">
                    How to Make a Manual Transfer
                  </h4>
                  <ol className="list-decimal list-inside text-gray-700 space-y-2">
                    <li>
                      Choose your preferred cryptocurrency
                    </li>
                    <li>
                      Send exactly €{(
                        (selectedService?.discountedPrice || 0) + 
                        (includeBlacklistCheck ? 2.95 : 0)
                      ).toFixed(2)} to the wallet address
                    </li>
                    <li>
                      Include your order details in the transaction memo
                    </li>
                    <li>
                      Contact WhatsApp support with your transaction hash
                    </li>
                  </ol>
                </div>

                {/* Cryptocurrency Addresses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cryptoPayments.map((crypto) => (
                  <div 
                    key={crypto.name}
                    className="bg-white border rounded-lg p-4 w-full"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-base">{crypto.name}</h4>
                      <span className="text-green-600 text-sm">
                        {/* Save {crypto.discount}% */}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-2 mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm">
                          Wallet Address:
                        </span>
                        <CopyButton text={crypto.address} />
                      </div>
                      <code className="block text-xs text-gray-700 break-words overflow-x-auto max-w-full whitespace-nowrap">
                        {crypto.address}
                      </code>
                    </div>
                  </div>
                ))}
              </div>


                {/* Support Contact */}
                <div className="bg-gray-50 border rounded-lg p-4 text-center">
                  <h4 className="font-semibold mb-3 text-gray-800">
                    Need Help Verifying Your Payment?
                  </h4>
                  <p className='text-gray-500'>Please click the WhatsApp button on the right to reach out to the Admin and verify whether the payment has been received.</p>
                  <WhatsAppButton 
                    phoneNumber="+15793860596"
                    message={`Hello! I've made a manual transfer for my device unlock order. 
Order Details:
- Device: ${model}
- Service: ${selectedService?.name}
- Total Amount: €${(
  (selectedService?.discountedPrice || 0) + 
  (includeBlacklistCheck ? 2.95 : 0)
).toFixed(2)}

Can you help me verify my transaction?`}
                  />
                </div>  
              </div>

              
            </div>
            
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
