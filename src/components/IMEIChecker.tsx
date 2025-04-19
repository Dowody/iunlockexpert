import React, { useState } from 'react';
import { Search, Smartphone, X, Check, AlertCircle, Shield, Info, Globe, Clock, Wifi, Loader2, Lock, Zap, Star, Factory, Calendar, Cpu } from 'lucide-react';
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
    price: "$0.06",
    description: "Essential device information and basic status check",
    features: [
      "Model & Serial Number",
      "Purchase Date",
      "Basic Lock Status",
      "Network Status"
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
      "Find My iPhone Status",
      "Blacklist Status"
    ]
  },
  {
    id: 3,
    title: "Full Check",
    price: "$0.90",
    description: "Complete device analysis including MDM status",
    features: [
      "All Advanced Check Features",
      "MDM Lock Status",
      "iCloud Status",
      "Activation Status",
      "Technical Specifications",
      "Parts & Service History"
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
          serviceId: selectedService
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

    switch (selectedService) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <Smartphone className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-semibold">{info.deviceName}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Device Info</span>
                </div>
                <div className="space-y-1">
                  <p><span className="text-gray-600">IMEI:</span> {info.imei}</p>
                  <p><span className="text-gray-600">IMEI2:</span> {info.imei2}</p>
                  <p><span className="text-gray-600">Serial:</span> {info.serial}</p>
                  <p><span className="text-gray-600">MEID:</span> {info.meid}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Region Info</span>
                </div>
                <div className="space-y-1">
                  <p><span className="text-gray-600">Country:</span> {info.purchaseCountry}</p>
                  <p><span className="text-gray-600">Region:</span> {info["apple/region"]}</p>
                  <p><span className="text-gray-600">Network:</span> {info.network}</p>
                  <p><span className="text-gray-600">Purchase:</span> {
                    info.estPurchaseDate 
                      ? new Date(info.estPurchaseDate).toLocaleDateString()
                      : 'Unknown'
                  }</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Lock Status</span>
                </div>
                <div className="space-y-1">
                  <p><span className="text-gray-600">Find My iPhone:</span> {info.fmiOn ? "ON" : "OFF"}</p>
                  <p><span className="text-gray-600">SIM Lock:</span> {info.simLock ? "Locked" : "Unlocked"}</p>
                  <p><span className="text-gray-600">Lost Mode:</span> {info.lostMode ? "ON" : "OFF"}</p>
                  <p><span className="text-gray-600">US Block:</span> {info.usaBlockStatus}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Device Status</span>
                </div>
                <div className="space-y-1">
                  <p><span className="text-gray-600">Warranty:</span> {info.warrantyStatus}</p>
                  <p><span className="text-gray-600">Replaced:</span> {info.replaced ? "Yes" : "No"}</p>
                  <p><span className="text-gray-600">Refurbished:</span> {info.refurbished ? "Yes" : "No"}</p>
                  <p><span className="text-gray-600">Demo Unit:</span> {info.demoUnit ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

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
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Device Info</span>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Model:</span> {info.modelDesc}</p>
                  <p><span className="text-gray-600">IMEI:</span> {info.imei}</p>
                  <p><span className="text-gray-600">IMEI2:</span> {info.imei2}</p>
                  <p><span className="text-gray-600">Serial:</span> {info.serial}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Warranty & Support</span>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Warranty:</span> {info.warrantyStatus}</p>
                  <p><span className="text-gray-600">Coverage:</span> {info.repairCoverage}</p>
                  <p><span className="text-gray-600">Support:</span> {info.technicalSupport}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Lock Status</span>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Find My iPhone:</span> {info.fmiOn ? "ON" : "OFF"}</p>
                  <p><span className="text-gray-600">SIM Lock:</span> {info.simLock ? "Locked" : "Unlocked"}</p>
                  <p><span className="text-gray-600">Network:</span> {info.network}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Region Info</span>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Country:</span> {info.purchaseCountry}</p>
                  <p><span className="text-gray-600">Region:</span> {info["apple/region"]}</p>
                  <p><span className="text-gray-600">Purchase Date:</span> {
                    info.estPurchaseDate 
                      ? new Date(info.estPurchaseDate).toLocaleDateString()
                      : 'Unknown'
                  }</p>
                </div>
              </div>
            </div>

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
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Device Details</span>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Model:</span> {info.modelDesc}</p>
                  <p><span className="text-gray-600">IMEI:</span> {info.imei}</p>
                  <p><span className="text-gray-600">IMEI2:</span> {info.imei2}</p>
                  <p><span className="text-gray-600">Serial:</span> {info.serial}</p>
                  <p><span className="text-gray-600">MEID:</span> {info.meid}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Factory className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Manufacturing Info</span>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Assembled In:</span> {info.assembledIn}</p>
                  <p><span className="text-gray-600">Manufacture Date:</span> {
                    info.manufactureDate 
                      ? new Date(info.manufactureDate).toLocaleDateString()
                      : 'Unknown'
                  }</p>
                  <p><span className="text-gray-600">Unit Age:</span> {info.unitAge}</p>
                  <p><span className="text-gray-600">Purchase Date:</span> {
                    info.estPurchaseDate 
                      ? new Date(info.estPurchaseDate).toLocaleDateString()
                      : 'Unknown'
                  }</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Lock Status</span>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Find My iPhone:</span> {info.fmiOn ? "ON" : "OFF"}</p>
                  <p><span className="text-gray-600">Lost Mode:</span> {info.lostMode ? "ON" : "OFF"}</p>
                  <p><span className="text-gray-600">MDM Lock:</span> {info.mdmLock ? "ON" : "OFF"}</p>
                  <p><span className="text-gray-600">Activation:</span> {info.activated ? "Activated" : "Not Activated"}</p>
                  <p><span className="text-gray-600">SIM Lock:</span> {info.simLock ? "Locked" : "Unlocked"}</p>
                  <p><span className="text-gray-600">Carrier:</span> {info.carrier}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Device Status</span>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Replaced by Apple:</span> {info.replaced ? "Yes" : "No"}</p>
                  <p><span className="text-gray-600">Replacement Device:</span> {info.replacement ? "Yes" : "No"}</p>
                  <p><span className="text-gray-600">Demo Unit:</span> {info.demoUnit ? "Yes" : "No"}</p>
                  <p><span className="text-gray-600">Refurbished:</span> {info.refurbished ? "Yes" : "No"}</p>
                  <p><span className="text-gray-600">Loaner Device:</span> {info.loaner ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Warranty & Support</span>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Warranty Status:</span> {info.warrantyStatus}</p>
                  <p><span className="text-gray-600">AppleCare Eligible:</span> {info.acEligible ? "Yes" : "No"}</p>
                  <p><span className="text-gray-600">Repairs Coverage:</span> {info.repairCoverage}</p>
                  <p><span className="text-gray-600">Technical Support:</span> {info.technicalSupport}</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Network & Region</span>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Network:</span> {info.network}</p>
                  <p><span className="text-gray-600">Country:</span> {info.purchaseCountry}</p>
                  <p><span className="text-gray-600">Region:</span> {info["apple/region"]}</p>
                  <p><span className="text-gray-600">Blacklist Records:</span> {info.blacklistRecords || 0}</p>
                </div>
              </div>
            </div>

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
          </div>
        );

      default:
        return null;
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {services.map((service) => (
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
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
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
              {deviceInfo && deviceInfo.status === 'successful' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8"
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