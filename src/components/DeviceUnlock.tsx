import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Shield, Check, Clock, Phone, Star } from 'lucide-react';

const carriers = [
  "AT&T", "T-Mobile", "Verizon", "Sprint", "O2", "Vodafone", "EE", "Orange",
  "Three", "Rogers", "Bell", "Telus", "Other"
];

export default function DeviceUnlock() {
  const { model } = useParams();
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/" className="text-gray-600 hover:text-blue-600">All Phone Models</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-blue-600">{model}</span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Unlock {model}</h1>
          <p className="text-xl text-blue-100">
            The most recommended method for safely unlocking your {model}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Unlock Process */}
          <div className="md:col-span-2">
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between mb-8">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {num}
                    </div>
                    <span className="text-sm mt-2 text-gray-600">
                      {num === 1 ? 'Carrier' : 
                       num === 2 ? 'Service' :
                       num === 3 ? 'Summary' : 'Payment'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step Content */}
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
                <div className="mt-8 flex justify-end">
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    onClick={() => setStep(2)}
                    disabled={!selectedCarrier}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Price Box */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Price and Delivery</h3>
                <p className="text-sm text-gray-600 mb-4">starting at</p>
                <p className="text-3xl font-bold text-blue-600 mb-2">€3.95 EUR</p>
                <p className="text-sm text-gray-600">1 to 2 hours delivery</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Why Choose Us</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">Trust & Safety</h4>
                    <p className="text-sm text-gray-600">Official unlocking method recommended by manufacturers</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">Guaranteed Results</h4>
                    <p className="text-sm text-gray-600">100% success rate or money back</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">Fast Delivery</h4>
                    <p className="text-sm text-gray-600">Most devices unlocked within hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">24/7 Support</h4>
                    <p className="text-sm text-gray-600">Expert assistance available anytime</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">22,700+ Reviews</h4>
                    <p className="text-sm text-gray-600">Trusted by millions worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}