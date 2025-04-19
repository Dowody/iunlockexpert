import React, { useState } from 'react';
import { Search, Clock, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

interface OrderStatus {
  id: string;
  device: string;
  service: string;
  status: 'processing' | 'completed' | 'failed' | 'pending';
  date: string;
  estimatedCompletion?: string;
  message?: string;
}

export default function OrderStatus() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderStatus | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulated API call
    setTimeout(() => {
      if (orderId === 'TEST123') {
        setOrderDetails({
          id: 'TEST123',
          device: 'iPhone 15 Pro Max',
          service: 'Premium Unlock',
          status: 'processing',
          date: '2024-03-15',
          estimatedCompletion: '2024-03-16',
          message: 'Your unlock request is being processed'
        });
      } else {
        setError('Order not found. Please check your order ID and email.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'processing':
        return 'text-blue-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'processing':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const handleViewDetails = () => {
    if (orderDetails?.status === 'failed') {
      navigate('/help');
    } else {
      // Show more detailed tracking information
      window.alert('Detailed tracking information will be displayed here');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Order Status</h1>
              <p className="text-gray-600">Track the progress of your device unlock request</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6 md:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                    Order ID
                  </label>
                  <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your order ID"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Search className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Track Order</span>
                    </>
                  )}
                </button>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-center mt-4"
                  >
                    {error}
                  </motion.div>
                )}
              </form>

              {orderDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 border-t pt-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Order Details</h2>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(orderDetails.status)}
                      <span className={`font-medium ${getStatusColor(orderDetails.status)}`}>
                        {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-medium">{orderDetails.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">{orderDetails.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Device</p>
                        <p className="font-medium">{orderDetails.device}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service</p>
                        <p className="font-medium">{orderDetails.service}</p>
                      </div>
                    </div>

                    {orderDetails.estimatedCompletion && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <p className="text-blue-600">
                            Estimated completion: {orderDetails.estimatedCompletion}
                          </p>
                        </div>
                      </div>
                    )}

                    {orderDetails.message && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{orderDetails.message}</p>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button 
                        onClick={handleViewDetails}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-300"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}