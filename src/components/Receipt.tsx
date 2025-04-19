import React from 'react';
import { motion } from 'framer-motion';
import { Download, Check, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

interface ReceiptData {
  orderId: string;
  date: string;
  device: string;
  service: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  paymentMethod: string;
  email: string;
  imei: string;
}

export default function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptData = location.state?.receiptData as ReceiptData;

  if (!receiptData) {
    navigate('/');
    return null;
  }

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = location.state.pdfUrl;
    link.download = `receipt-${receiptData.orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Successful</h1>
              <p className="text-gray-600 mt-2">Thank you for your purchase!</p>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
                  <div className="mt-3 space-y-3">
                    <p className="text-gray-900">Order ID: {receiptData.orderId}</p>
                    <p className="text-gray-900">Date: {receiptData.date}</p>
                    <p className="text-gray-900">Email: {receiptData.email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Device Information</h3>
                  <div className="mt-3 space-y-3">
                    <p className="text-gray-900">Device: {receiptData.device}</p>
                    <p className="text-gray-900">IMEI: {receiptData.imei}</p>
                    <p className="text-gray-900">Service: {receiptData.service}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500">Payment Details</h3>
                <div className="mt-3 space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Original Price</p>
                    <p className="text-gray-900">€{receiptData.originalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <p>Discount</p>
                    <p>-€{receiptData.discount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Payment Method</p>
                    <p className="text-gray-900">{receiptData.paymentMethod}</p>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t">
                    <p>Total Amount</p>
                    <p>€{receiptData.finalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">What's Next?</h3>
                <p className="text-blue-600">
                  We'll process your unlock request and send instructions to your email within 24 hours.
                  You can also check your order status anytime using your Order ID.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}