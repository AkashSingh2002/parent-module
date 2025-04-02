import React, { useState } from 'react';
import jsPDF from 'jspdf';

const ReceiptPrint = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/FeeDeposit/MonthFeeReciept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          "paymentId": 14
        }),
      });

      if (response.ok) {
        const interestData = await response.json();
        setData(interestData);
      } else {
        console.error('Failed to fetch interest level data');
      }
    } catch (error) {
      console.error('API request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = async () => {
    fetchData();
  };



  const generatePDF = () => {
    if (!data) return;
  
    const doc = new jsPDF();
    const lineHeight = 7;
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Add logo
    const logo = sessionStorage.getItem('clientLogo');
    const logoSrc = `https://arizshad-002-site5.ktempurl.com${logo.replace('~', '')}`;
    const logoWidth = 20; // Adjust logo width as needed
    const logoHeight = 20; // Adjust logo height as needed
    
    // Add header with blue background
    doc.setFillColor(0, 102, 204); // Blue color
    doc.rect(0, 0, pageWidth, 30, 'F'); // Rectangle for blue background
    doc.setTextColor(255); // White color for text
    doc.setFontSize(18);
    doc.addImage(logoSrc, 'JPEG', 8, 5, logoWidth, logoHeight); // Adjust coordinates for positioning
    doc.text('JEEVAN ADARSH VIDYALAYA', pageWidth / 2, yPos, { align: 'center' });
    yPos += lineHeight;
    doc.setFontSize(12);
    doc.text(`Receipt No: ${data.list[0].recieptNo}`, pageWidth - 10, yPos, { align: 'right' });
    yPos += lineHeight * 2;
  
    // Reset fill color and text color for content
    doc.setFillColor(255); // Reset fill color to white
    doc.setTextColor(0); // Reset text color to black
  
    // Add content

    doc.setFont('times', 'bold');

    doc.text('Name:', 10, yPos);
    doc.text(data.list[0].studentName, 60, yPos);
    doc.text('Date:', 120, yPos);
    doc.text(data.list[0].feePaymentDate, 160, yPos);
    yPos += lineHeight;
  
    doc.text('Class:', 10, yPos);
    doc.text(data.list[0].class, 60, yPos);
    doc.text('Admission No:', 120, yPos);
    doc.text(data.list[0].admissionNo, 160, yPos);
    yPos += lineHeight * 2;


    // Save yPos before drawing the titles
    const yPosBeforeTitles = yPos;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Fee Particulars', 10, yPos);
    doc.text('Amount', 160, yPos);
    yPos += lineHeight;

    // Draw a line below Fee Particulars and Amount titles
    const lineY = yPosBeforeTitles + 2;
    doc.line(10, lineY, 70, lineY); // Line below Fee Particulars
    doc.line(160, lineY, 200, lineY); // Line below Amount

    // Reset font settings for the details
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

  
    doc.setFont('bold');
    doc.text('Fee Particulars', 10, yPos);
    doc.text('Amount', 160, yPos);
    yPos += lineHeight;
  
    data.chargerList.forEach(charge => {
      doc.text(charge.chargeName, 10, yPos);
      doc.text(charge.chargeAmount.toString(), 160, yPos); // Convert chargeAmount to string
      yPos += lineHeight;
    });
  
    doc.text('Total Charge Amount:', 10, yPos);
    doc.text(data.totalChargeAmount.toString(), 160, yPos); // Convert totalChargeAmount to string
    yPos += lineHeight * 2;
  
    doc.text('Payment Details', 10, yPos);
    yPos += lineHeight;
    doc.text('Paid Amount:', 10, yPos);
    doc.text(data.list[0].paidAmount.toString(), 60, yPos); // Convert paidAmount to string
    doc.text('Wallet Amount:', 120, yPos);
    doc.text(data.list[0].walletAmount.toString(), 160, yPos); // Convert walletAmount to string
    yPos += lineHeight;
    doc.text('Balance:', 10, yPos);
    doc.text(data.list[0].balance.toString(), 60, yPos); // Convert balance to string
  
    // Save the PDF
    const pdfBlob = doc.output('blob');
  
    // Create URL for the Blob
    const url = window.URL.createObjectURL(pdfBlob);
  
    // Open PDF in a new tab
    window.open(url, '_blank');
  
    // Release the Object URL
    window.URL.revokeObjectURL(url);

};




  
  


  return (
    <div>
      <button onClick={handleButtonClick}>Fetch Data and Generate PDF</button>
      {isLoading && <div>Loading...</div>}
      {data && (
        <div>
          <button onClick={generatePDF}>Generate PDF</button>
        </div>
      )}
    </div>
  );
};

export default ReceiptPrint;