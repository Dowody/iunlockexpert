import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Check, Clock, Phone, Star, AlertCircle, Zap, Lock, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateReceipt } from '../utils/generateReceipt';
import { connectTrustWallet, sendTransaction } from '../utils/trustWallet';

const carriers = [
  "AT&T", "T-Mobile", "Verizon", "Sprint", "O2", "Vodafone", "EE", "Orange",
  "Three", "Rogers", "Bell", "Telus", "MX Iusacell", "Other"
];

interface UnlockService {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  averageTime: string;
  deliveryTime: string;
  successRate: string;
  description: string;
  features: string[];
}

const services: UnlockService[] = [
  {
    id: "premium",
    name: "Premium Unlock",
    originalPrice: 99.95,
    discountedPrice: 79.95,
    averageTime: "1-2 hours",
    deliveryTime: "24 hours guaranteed",
    successRate: "99.9%",
    description: "Our premium unlocking service provides the fastest turnaround time with guaranteed results. Perfect for users who need their device unlocked quickly and reliably.",
    features: [
      "Priority Processing",
      "24/7 Support",
      "Money-back Guarantee",
      "Permanent Unlock"
    ]
  },
  {
    id: "standard",
    name: "Standard Unlock",
    originalPrice: 69.95,
    discountedPrice: 49.95,
    averageTime: "24-48 hours",
    deliveryTime: "3 business days",
    successRate: "99%",
    description: "The most popular option for reliable carrier unlocking. Balanced between speed and cost-effectiveness.",
    features: [
      "Standard Processing",
      "Email Support",
      "Money-back Guarantee",
      "Permanent Unlock"
    ]
  },
  {
    id: "basic",
    name: "Basic Unlock",
    originalPrice: 49.95,
    discountedPrice: 29.95,
    averageTime: "3-5 days",
    deliveryTime: "7 business days",
    successRate: "98%",
    description: "Economic solution for users who don't mind waiting longer for their unlock code. Same reliable service at a lower price.",
    features: [
      "Regular Processing",
      "Email Support",
      "Money-back Guarantee",
      "Permanent Unlock"
    ]
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
  const navigate = useNavigate();
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

  const handleContinue = () => {
    if (step === 2) {
      const imeiValidation = validateIMEI(imei);
      const emailValidation = validateEmail(email);
      
      setImeiError(imeiValidation);
      setEmailError(emailValidation);
      
      if (!acceptedTerms) {
        setShowTermsError(true);
        return;
      }
      
      if (imeiValidation || emailValidation) {
        return;
      }
    }
    setStep(step + 1);
  };

  const handleCryptoPayment = async (cryptoType: typeof cryptoPayments[0]) => {
    setIsProcessing(true);
    setPaymentError("");
    
    try {
      // Calculate final price with crypto discount
      const basePrice = (selectedService?.discountedPrice || 0) + (includeBlacklistCheck ? 2.95 : 0);
      const discount = (basePrice * cryptoType.discount) / 100;
      const finalPrice = basePrice - discount;

      if (cryptoType.symbol === 'USDT') {
        const { provider } = await connectTrustWallet();
        
        const tx = await sendTransaction(
          provider,
          '0x64202323B358bbd9fF1B8F62718Fd893d9Ae6A9A',
          finalPrice.toString()
        );

        // Generate receipt data
        const receiptData = {
          orderId: `ORD${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          device: model || '',
          service: selectedService?.name || '',
          originalPrice: basePrice,
          discount: discount,
          finalPrice: finalPrice,
          paymentMethod: cryptoType.name,
          email: email,
          imei: imei,
          transactionHash: tx.hash
        };

        // Generate PDF receipt
        const pdfUrl = generateReceipt(receiptData);

        // Navigate to receipt page with data
        navigate('/receipt', { 
          state: { 
            receiptData,
            pdfUrl
          }
        });
      } else {
        // Handle other crypto payments...
        window.location.href = `https://link.trustwallet.com/send?asset=${cryptoType.symbol}&address=${cryptoType.address}&amount=${finalPrice}`;
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
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
                  onClick={() => setSelectedCarrier(carrier)}
                >
                  {carrier}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Service</h2>
            <div className="space-y-6">
              {services.map((service) => (
                <div 
                  key={service.id}
                  className={`bg-white rounded-lg border p-6 transition-all duration-300 ${
                    selectedService?.id === service.id 
                      ? 'border-blue-600 shadow-lg' 
                      : 'hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedService(service)}
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
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Average: {service.averageTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Timer className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Delivery: {service.deliveryTime}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{service.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 space-y-4">
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
                    I agree to the <Link to="/terms" className="text-blue-600 hover:underline" target="_blank">Terms and Conditions</Link> and accept the use of my info according to the Privacy Policy
                  </label>
                </div>
                {showTermsError && (
                  <p className="text-red-500 text-sm mt-2">
                    Please read and accept the Terms and Conditions before proceeding
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Time</span>
                  <span>{selectedService?.averageTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Time</span>
                  <span>{selectedService?.deliveryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carrier</span>
                  <span>{selectedCarrier}</span>
                </div>
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
                    <span>-€{(selectedService?.originalPrice || 0) - (selectedService?.discountedPrice || 0)}</span>
                  </div>
                  {includeBlacklistCheck && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blacklist Check</span>
                      <span>€2.95</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold mt-2">
                    <span>Total</span>
                    <span>€{((selectedService?.discountedPrice || 0) + (includeBlacklistCheck ? 2.95 : 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="bg-white rounded-lg border p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    €{((selectedService?.discountedPrice || 0) + (includeBlacklistCheck ? 2.95 : 0)).toFixed(2)}
                  </span>
                </div>

                {paymentError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>{paymentError}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Select Cryptocurrency Payment Method</h3>
                  <p className="text-gray-600">Get additional discount when paying with crypto</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cryptoPayments.map((crypto) => (
                      <button
                        key={crypto.name}
                        onClick={() => handleCryptoPayment(crypto)}
                        disabled={isProcessing}
                        className="p-6 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </div>

                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-600">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Fast & Secure Payments</h4>
                        <p className="text-sm text-blue-700">
                          Transactions are processed instantly and securely. Your payment is protected by blockchain technology.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/home" className="text-gray-600 hover:text-blue-600">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/device-catalog" className="text-gray-600 hover:text-blue-600">All Phone Models</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-blue-600">{model}</span>
          </div>
        </div>
      </nav>

      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between max-w-2xl mx-auto">
            {['Operator', 'Service', 'Summary', 'Payment'].map((label, index) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > index + 1 ? 'bg-green-500 text-white' :
                  step === index + 1 ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {step > index + 1 ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span className="text-sm mt-2 text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {renderStepContent()}
          
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {step < 4 && (
              <button
                onClick={handleContinue}
                disabled={
                  (step === 1 && !selectedCarrier) ||
                  (step === 2 && (!imei || !email || !selectedService))
                }
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}