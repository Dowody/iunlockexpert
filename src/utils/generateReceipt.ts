import { jsPDF } from 'jspdf';

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

export const generateReceipt = (data: ReceiptData): string => {
  // Create new document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set initial coordinates
  let y = 20;
  const leftMargin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const lineHeight = 7;

  // Helper function for centered text
  const centerText = (text: string, y: number) => {
    const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Add company logo placeholder
  doc.setFontSize(24);
  doc.setTextColor(0, 87, 183); // Blue color
  centerText('iUnlockExpert', y);

  // Add receipt title
  y += 15;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  centerText('Payment Receipt', y);

  // Add horizontal line
  y += 5;
  doc.setLineWidth(0.5);
  doc.line(leftMargin, y, pageWidth - leftMargin, y);

  // Reset font for content
  doc.setFontSize(10);
  y += 10;

  // Add receipt details
  const addField = (label: string, value: string) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, leftMargin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(value, leftMargin + 40, y);
    y += lineHeight;
  };

  // Order information
  doc.setFont('helvetica', 'bold');
  doc.text('Order Information', leftMargin, y);
  y += lineHeight;

  addField('Order ID:', data.orderId);
  addField('Date:', data.date);
  addField('Email:', data.email);

  // Device information
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Device Information', leftMargin, y);
  y += lineHeight;

  addField('Device:', data.device);
  addField('IMEI:', data.imei);
  addField('Service:', data.service);

  // Payment details
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Details', leftMargin, y);
  y += lineHeight;

  addField('Original Price:', `€${data.originalPrice.toFixed(2)}`);
  addField('Discount:', `€${data.discount.toFixed(2)}`);
  addField('Payment Method:', data.paymentMethod);

  // Final amount
  y += 5;
  doc.setFillColor(240, 247, 255);
  doc.rect(leftMargin, y, pageWidth - (leftMargin * 2), 12, 'F');
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total Amount:', leftMargin + 2, y);
  doc.text(`€${data.finalPrice.toFixed(2)}`, pageWidth - leftMargin - 25, y);

  // Add footer
  y = doc.internal.pageSize.height - 30;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  centerText('Thank you for choosing iUnlockExpert for your device unlocking needs.', y);
  y += 5;
  centerText('This receipt serves as proof of payment. Please keep it for your records.', y);
  y += 5;
  centerText('For support, contact us at support@iunlockexpert.com', y);

  // Add company details at the bottom
  y += 5;
  doc.setFontSize(7);
  centerText('iUnlockExpert Inc. | 123 Tech Street, Digital City, 12345 | +1-800-UNLOCK-PRO', y);

  // Return the PDF as a data URL
  return doc.output('datauristring');
};