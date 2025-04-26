import React, { useState } from 'react';
import { 
  Search, Smartphone, X, Check, AlertCircle, Shield, Info, Globe, Clock, 
  Wifi, Loader2, Lock, Zap, Star, RefreshCw, Calendar, Cpu 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeviceInfo {
  id: string;
  type: string;
  status: 'waiting' | 'processing' | 'successful' | 'unsuccessful' | 'failed';
  orderId: string | null;
  service: {
    id: number;
    title: string;
  };
  amount: string;
  deviceId: string;
  processedAt: number;
  properties: {
    deviceName?: string;
    image?: string;
    imei?: string;
    imei2?: string;
    serial?: string;
    meid?: string;
    eid?: string;
    estPurchaseDate?: number;
    manufactureDate?: number;
    unitAge?: string;
    assembledIn?: string;
    simLock?: boolean;
    warrantyStatus?: string;
    repairCoverage?: string;
    technicalSupport?: string;
    modelDesc?: string;
    demoUnit?: boolean;
    refurbished?: boolean;
    purchaseCountry?: string;
    'apple/region'?: string;
    fmiOn?: boolean;
    lostMode?: string;
    usaBlockStatus?: string;
    network?: string;
    carrier?: string;
    country?: string;
    gsmaBlacklisted?: boolean;
    blacklistRecords?: string;
    mdmLock?: boolean;
    activated?: boolean;
    acEligible?: boolean;
    validPurchaseDate?: boolean;
    registered?: boolean;
    replaced?: boolean;
    replacement?: boolean;
    loaner?: boolean;
    nextActivationPolicyId?: string;
  };
}

interface Service {
  id: number;
  title: string;
  price: string;
  description: string;
  features: string[];
}

const services: Service[] = [
  {
    id: 1,
    title: "Basic Check",
    price: "",
    description: "Essential device information and basic status check",
    features: [
      "Basic Device Info",
      "Carrier Status",
      "Activation Details"
    ]
  },
  {
    id: 2,
    title: "Advanced Check",
    price: "$0.12",
    description: "Detailed device history and warranty information",
    features: [
      "All Basic Check Features",
      "Warranty Status",
      "Repair History",
      "Find My iPhone Status"
    ]
  },
  {
    id: 3,
    title: "Full Check",
    price: "$0.90",
    description: "Complete device analysis including MDM status",
    features: [
      "All Advanced Check Features",
      "Security Status",
      "MDM Lock Status",
      "Technical Specifications"
    ]
  }
];

export default function IMEIChecker() {
  const [imei, setImei] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedService, setSelectedService] = useState<number>(1);

  const validateIMEI = (imei: string): string => {
    const cleanIMEI = imei.replace(/[^0-9]/g, '');

    if (cleanIMEI.length !== 15) {
      return "Please enter exactly 15 digits";
    }

    if (!/^\d+$/.test(cleanIMEI)) {
      return "IMEI must contain only numbers";
    }

    if (/^0{15}$/.test(cleanIMEI)) {
      return "Invalid IMEI: cannot be all zeros";
    }

    if (/^1{15}$/.test(cleanIMEI)) {
      return "Invalid IMEI: cannot be all ones";
    }

    const tac = cleanIMEI.substring(0, 8);
    if (!/^[0-9]{8}$/.test(tac)) {
      return "Invalid Type Allocation Code (TAC)";
    }

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
      const response = await fetch('https://api.imeicheck.net/v1/checks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_IMEI_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'en'
        },
        body: JSON.stringify({
          deviceId: cleanIMEI,
          serviceId: 1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check IMEI');
      }

      const data = await response.json();
      setDeviceInfo(data);
    } catch (err: any) {
      setError(err.message || 'Failed to check IMEI. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };


  const renderDeviceInfo = () => {
    if (!deviceInfo || deviceInfo.status !== 'successful') return null;

    const info = deviceInfo.properties;

    // Basic Service Containers
    const basicInfo = (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">Basic Device Info</span>
        </div>
        <div className="space-y-2">
          <p><span className="text-gray-600">Model:</span> {info.modelDesc || 'Unknown'}</p>
          <p><span className="text-gray-600">Serial:</span> {info.serial || 'Unknown'}</p>
          <p><span className="text-gray-600">IMEI:</span> {info.imei || 'Unknown'}</p>
        </div>
      </div>
    );

    const carrierStatus = (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Wifi className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">Carrier Status</span>
        </div>
        <div className="space-y-2">
          <p><span className="text-gray-600">Current Carrier:</span> {info.carrier || 'Unknown'}</p>
          <p><span className="text-gray-600">Network:</span> {info.network || 'Unknown'}</p>
          <p><span className="text-gray-600">SIM Lock:</span> {info.simLock ? "Locked" : "Unlocked"}</p>
        </div>
      </div>
    );

    const activationDetails = (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">Activation Details</span>
        </div>
        <div className="space-y-2">
          <p><span className="text-gray-600">Activation Status:</span> {info.activated ? "Yes" : "No"}</p>
          <p><span className="text-gray-600">Region:</span> {info.country || 'Unknown'}</p>
          <p><span className="text-gray-600">Registered:</span> {info.registered ? "Yes" : "No"}</p>
        </div>
      </div>
    );

    // Advanced Service Containers
    const warrantyInfo = (
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">Warranty Status</span>
        </div>
        <div className="space-y-2">
          <p><span className="text-gray-600">Warranty Status:</span> {info.warrantyStatus || 'Unknown'}</p>
          <p><span className="text-gray-600">Coverage:</span> {info.repairCoverage ? "Active" : "Expired"}</p>
          <p><span className="text-gray-600">Support:</span> {info.technicalSupport ? "Available" : "Expired"}</p>
        </div>
      </div>
    );

    const serviceHistory = (
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <RefreshCw className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">Service History</span>
        </div>
        <div className="space-y-2">
          <p><span className="text-gray-600">Replacement Unit:</span> {info.replacement ? "Yes" : "No"}</p>
          <p><span className="text-gray-600">Refurbished:</span> {info.refurbished ? "Yes" : "No"}</p>
          <p><span className="text-gray-600">Parts Modified:</span> {info.replaced ? "Yes" : "No"}</p>
        </div>
      </div>
    );

    const findMyStatus = (
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">Find My iPhone</span>
        </div>
        <div className="space-y-2">
          <p><span className="text-gray-600">Status:</span> {info.fmiOn ? "Enabled" : "Disabled"}</p>
          <p><span className="text-gray-600">Lost Mode:</span> {info.lostMode ? "Active" : "Inactive"}</p>
        </div>
      </div>
    );

    // Full Service Containers
    const securityStatus = (
      <div className="p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">Security Status</span>
        </div>
        <div className="space-y-2">
          <p><span className="text-gray-600">Blacklist Status:</span> {info.usaBlockStatus || 'Unknown'}</p>
          <p><span className="text-gray-600">GSMA Status:</span> {info.gsmaBlacklisted ? "Blacklisted" : "Clean"}</p>
          <p><span className="text-gray-600">Records:</span> {info.blacklistRecords || "0"}</p>
        </div>
      </div>
    );

    const lockStatus = (
      <div className="p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Lock className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">Lock Status</span>
        </div>
        <div className="space-y-2">
          <p><span className="text-gray-600">MDM Lock:</span> {info.mdmLock ? "Yes" : "No"}</p>
          <p><span className="text-gray-600">iCloud Lock:</span> {info.fmiOn ? "Yes" : "No"}</p>
          <p><span className="text-gray-600">Activation Lock:</span> {info.acEligible ? "Eligible" : "Not Eligible"}</p>
        </div>
      </div>
    );

    const technicalStatus = (
      <div className="p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">Technical Status</span>
        </div>
        <div className="space-y-2">
          <p><span className="text-gray-600">Demo Unit:</span> {info.demoUnit ? "Yes" : "No"}</p>
          <p><span className="text-gray-600">Loaner Device:</span> {info.loaner ? "Yes" : "No"}</p>
          <p><span className="text-gray-600">Next Policy:</span> {info.nextActivationPolicyId || "N/A"}</p>
        </div>
      </div>
    );

    const statusBanner = (
      <div className={`p-4 rounded-lg ${
        info.usaBlockStatus === 'Clean' ? 'bg-green-50' : 'bg-red-50'
      }`}>
        <div className="flex items-center justify-center space-x-2">
          {info.usaBlockStatus === 'Clean' ? (
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
              </div>
            </>
          )}
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <Smartphone className="w-8 h-8 text-blue-600" />
          <h3 className="text-xl font-semibold">{info.deviceName || info.modelDesc}</h3>
        </div>

        {statusBanner}

        {/* Basic Service - Level 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {basicInfo}
          {carrierStatus}
          {activationDetails}
        </div>

        {/* Advanced Service - Level 2 */}
        {selectedService >= 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {warrantyInfo}
            {serviceHistory}
            {findMyStatus}
          </div>
        )}

        {/* Full Service - Level 3 */}
        {selectedService === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {securityStatus}
            {lockStatus}
            {technicalStatus}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-8 md:py-12">
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
            <p className="text-gray-600 mb-6">
              Verify device authenticity and check blacklist status through our official database
            </p>
          </motion.div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {/* {services.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedService === service.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-transparent hover:border-blue-200'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                    <span className="text-blue-600 font-bold">{service.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <ul className="space-y-1.5">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))} */}
            </div>

            <div className="relative mb-2">
              <input
                type="text"
                value={displayIMEI(imei)}
                onChange={handleIMEIChange}
                placeholder="Enter IMEI number"
                className={`w-full px-4 py-3 pr-32 border rounded-lg text-lg ${
                  error ? 'border-red-500' : 'border-gray-300'
                } font-sans tracking-wide`}
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
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                ) : (
                  'Check IMEI'
                )}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-3">
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
                  className="bg-blue-50 p-4 rounded-lg mb-3 text-left"
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
                className="mt-3 text-red-500 flex items-center justify-center space-x-2"
              >
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}

            <AnimatePresence>
              {deviceInfo && deviceInfo.status === 'successful' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6"
                >
                  {renderDeviceInfo()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
    
  );
}
