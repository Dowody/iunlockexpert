import React, { useState } from 'react';
import { Search, Smartphone, X, Check, AlertCircle, Shield, Info, Globe, Clock, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeviceInfo {
  specifications: {
    model_name: string;
    manufacturer: string;
    model_number: string;
    device_type: string;
    release_date: string;
  };
  blacklist: {
    status: string;
    reported_date: string | null;
    reason: string | null;
  };
  additional_info: {
    carrier: string;
    country: string;
    warranty: string;
    activation_status: string;
  };
}

export default function IMEIChecker() {
  const [imei, setImei] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const validateIMEI = (imei: string): string => {
    // Remove any non-digit characters
    const cleanIMEI = imei.replace(/[^0-9]/g, '');

    // Check length
    if (cleanIMEI.length !== 15) {
      return "Please enter exactly 15 digits";
    }

    // Check if all characters are digits
    if (!/^\d+$/.test(cleanIMEI)) {
      return "IMEI must contain only numbers";
    }

    // Check for invalid sequences
    if (/^0{15}$/.test(cleanIMEI)) {
      return "Invalid IMEI: cannot be all zeros";
    }

    if (/^1{15}$/.test(cleanIMEI)) {
      return "Invalid IMEI: cannot be all ones";
    }

    // TAC validation (first 8 digits)
    const tac = cleanIMEI.substring(0, 8);
    if (!/^[0-9]{8}$/.test(tac)) {
      return "Invalid Type Allocation Code (TAC)";
    }

    // Luhn algorithm validation
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanIMEI.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanIMEI[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0 ? "" : "Invalid IMEI checksum - please check and try again";
  };

  const handleIMEIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9\s-]/g, '');
    if (value.replace(/[\s-]/g, '').length <= 15) {
      setImei(value);
      setError('');
      setDeviceInfo(null);
    }
  };

  const formatIMEI = (imei: string): string => {
    const cleanIMEI = imei.replace(/[^0-9]/g, '');
    return cleanIMEI.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const displayIMEI = (imei: string): string => {
    const formatted = formatIMEI(imei);
    return formatted.length > 0 ? formatted : imei;
  };

  const checkIMEI = async () => {
    const cleanIMEI = imei.replace(/[^0-9]/g, '');
    const validationError = validateIMEI(cleanIMEI);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/api/check-imei?imei=${cleanIMEI}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check IMEI');
      }

      setDeviceInfo(data);
    } catch (err: any) {
      setError(err.message || 'Failed to check IMEI. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Official IMEI Device Checker
              </h2>
            </div>
            <p className="text-gray-600 mb-8">
              Verify device authenticity and check blacklist status through our official database
            </p>
          </motion.div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="relative mb-2">
              <input
                type="text"
                value={displayIMEI(imei)}
                onChange={handleIMEIChange}
                placeholder="Enter IMEI number"
                className={`w-full px-4 py-3 pr-32 border rounded-lg text-lg ${
                  error ? 'border-red-500' : 'border-gray-300'
                } font tracking-wide`}
                maxLength={19}
              />
              <button
                onClick={checkIMEI}
                disabled={isLoading || imei.replace(/[^0-9]/g, '').length !== 15}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Search className="w-5 h-5" />
                  </motion.div>
                ) : (
                  'Check IMEI'
                )}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-300"
              >
                <Info className="w-4 h-4" />
                <span>How to find your IMEI</span>
              </button>
            </div>

            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 p-4 rounded-lg mb-4 text-left"
                >
                  <h4 className="font-semibold mb-2">How to find your IMEI:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Dial *#06# on your device</li>
                    <li>Check in Settings → General → About</li>
                    <li>Look on the device packaging or original receipt</li>
                    <li>Check the SIM tray or back of the device</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-red-500 flex items-center justify-center space-x-2"
              >
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}

            <AnimatePresence>
              {deviceInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 space-y-6"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Smartphone className="w-8 h-8 text-blue-600" />
                    <h3 className="text-xl font-semibold">{deviceInfo.specifications.model_name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Brand</span>
                      <p className="font-semibold">{deviceInfo.specifications.manufacturer}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Model Number</span>
                      <p className="font-semibold">{deviceInfo.specifications.model_number}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Device Type</span>
                      <p className="font-semibold">{deviceInfo.specifications.device_type}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Release Date</span>
                      <p className="font-semibold">{deviceInfo.specifications.release_date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-600">Carrier & Region</span>
                      </div>
                      <p className="font-semibold">{deviceInfo.additional_info.carrier}</p>
                      <p className="text-sm text-gray-600">{deviceInfo.additional_info.country}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-600">Warranty Status</span>
                      </div>
                      <p className="font-semibold">{deviceInfo.additional_info.warranty}</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    deviceInfo.blacklist.status === 'clean' ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <div className="flex items-center justify-center space-x-2">
                      {deviceInfo.blacklist.status === 'clean' ? (
                        <>
                          <Check className="w-6 h-6 text-green-600" />
                          <span className="font-semibold text-green-800">
                            Device is clean and ready to use
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="w-6 h-6 text-red-600" />
                          <div className="text-red-800">
                            <p className="font-semibold">Device is blacklisted</p>
                            {deviceInfo.blacklist.reported_date && (
                              <p className="text-sm mt-1">
                                Reported on: {new Date(deviceInfo.blacklist.reported_date).toLocaleDateString()}
                              </p>
                            )}
                            {deviceInfo.blacklist.reason && (
                              <p className="text-sm mt-1">
                                Reason: {deviceInfo.blacklist.reason}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wifi className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">Activation Status</span>
                    </div>
                    <p className="font-semibold">{deviceInfo.additional_info.activation_status}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}