import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const PaymentPage = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const token = sessionStorage.getItem("token");
      const studentId = sessionStorage.getItem("employeeId");

      if (!studentId) {
        setError("Student ID not found in session storage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          `${API_URL}/Student/FetchStudentPaymentDetails`,
          { studentID: studentId },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `${token}`,
            },
          }
        );
        setPaymentData(response.data);
      } catch (err) {
        setError("Failed to fetch payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold text-purple-700">Fee Deposit</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : paymentData ? (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Admission NO.</label>
              <input type="text" value={paymentData.admissionNo || "N/A"} readOnly className="w-full p-2 border rounded bg-gray-200" />
            </div>
            <div>
              <label className="block text-gray-700">Receipt Date</label>
              <input type="date" value={paymentData.receiptDate || ""} readOnly className="w-full p-2 border rounded bg-gray-200" />
            </div>
            <div>
              <label className="block text-gray-700">Student Name</label>
              <input type="text" value={paymentData.studentName || "N/A"} readOnly className="w-full p-2 border rounded bg-gray-200" />
            </div>
            <div>
              <label className="block text-gray-700">Father Name</label>
              <input type="text" value={paymentData.fatherName || "N/A"} readOnly className="w-full p-2 border rounded bg-gray-200" />
            </div>
          </div>
        ) : (
          <p>No payment data available</p>
        )}
      </div>

      {paymentData && (
        <div className="bg-gray-100 shadow-md rounded p-6 mt-6">
          <h2 className="text-xl font-semibold">Payment Records</h2>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Date</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.records && paymentData.records.length > 0 ? (
                paymentData.records.map((record, index) => (
                  <tr key={index}>
                    <td className="border p-2">{record.date}</td>
                    <td className="border p-2">${record.amount}</td>
                    <td className="border p-2">{record.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border p-2 text-center">
                    No records available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
