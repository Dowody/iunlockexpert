import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

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
  transactionHash?: string;
}

export const generateReceipt = async (data: ReceiptData): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Generate QR Code for transaction verification
  const qrCodeData = `Order ID: ${data.orderId}\nDevice: ${data.device}\nIMEI: ${data.imei}\nTransaction Hash: ${data.transactionHash}`;
  const qrCodeImage = await QRCode.toDataURL(qrCodeData);

  // Page setup
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;

  // Company Logo and Header
  doc.setFontSize(10);
  doc.setTextColor(50);
  
  // Company Logo Placeholder (you can replace with actual logo)
  doc.setFont('helvetica', 'bold');
  doc.text('iUnlockExpert', margin, 20);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Device Unlock Services', margin, 25);
  doc.text('support@iunlockexpert.com', margin, 30);

  // Horizontal Line
  doc.setLineWidth(0.5);
  doc.line(margin, 35, pageWidth - margin, 35);

  // Receipt Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', pageWidth / 2, 45, { align: 'center' });

  // Order Details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let y = 55;
  
  const addDetailRow = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, pageWidth - margin, y, { align: 'right' });
    y += 6;
  };

  addDetailRow('Order ID:', data.orderId);
  addDetailRow('Date:', new Date(data.date).toLocaleString());
  addDetailRow('Email:', data.email);

  // Horizontal Line
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Device Information Section
  doc.setFont('helvetica', 'bold');
  doc.text('DEVICE INFORMATION', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  
  addDetailRow('Device Model:', data.device);
  addDetailRow('IMEI:', data.imei);
  addDetailRow('Service:', data.service);

  // Horizontal Line
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Payment Details Section
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT DETAILS', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');

  addDetailRow('Original Price:', `€${data.originalPrice.toFixed(2)}`);
  
  // Discount in green
  doc.setTextColor(0, 128, 0);
  addDetailRow('Discount:', `-€${data.discount.toFixed(2)}`);
  
  // Reset text color
  doc.setTextColor(50);
  addDetailRow('Payment Method:', data.paymentMethod);

  // Horizontal Line
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Total Amount
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL AMOUNT:', margin, y);
  doc.text(`€${data.finalPrice.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
  y += 10;

  // Transaction Hash
  if (data.transactionHash) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Transaction Hash:', margin, y);
    y += 5;
    doc.text(data.transactionHash, margin, y, { maxWidth: pageWidth - (2 * margin) });
  }

  // QR Code
  const qrCodeX = pageWidth - margin - 30;
  const qrCodeY = pageHeight - margin - 30;
  doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, 30, 30);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('© 2024 iUnlockExpert. All rights reserved.', margin, pageHeight - 10);
  doc.text('This is an official receipt for your records.', pageWidth - margin, pageHeight - 10, { align: 'right' });

  // Watermark
  doc.setTextColor(200);
  doc.setFontSize(60);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT', pageWidth / 2, pageHeight / 2, { 
    align: 'center', 
    angle: -45
  });

  // Directly trigger file download
  const filename = `iUnlockExpert_Receipt_${data.orderId}.pdf`;
  doc.save(filename);
};
