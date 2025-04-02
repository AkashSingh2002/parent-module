import React from "react";

const PaymentPage = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Fee Deposit Form */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold text-purple-700">Fee Deposit</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Admission NO.</label>
            <input type="text" value="ADM/2024/05" readOnly className="w-full p-2 border rounded bg-gray-200" />
          </div>
          <div>
            <label className="block text-gray-700">Receipt Date</label>
            <input type="date" value="2025-03-08" readOnly className="w-full p-2 border rounded bg-gray-200" />
          </div>
          <div>
            <label className="block text-gray-700">Student Name</label>
            <input type="text" value="Akshay (Roll No-3)" readOnly className="w-full p-2 border rounded bg-gray-200" />
          </div>
          <div>
            <label className="block text-gray-700">Father Name</label>
            <input type="text" placeholder="Father Name" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700">Class</label>
            <input type="text" value="Nur" readOnly className="w-full p-2 border rounded bg-gray-200" />
          </div>
          <div>
            <label className="block text-gray-700">Section</label>
            <input type="text" value="A" readOnly className="w-full p-2 border rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Records Section */}
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
            <tr>
              <td className="border p-2">10-03-2025</td>
              <td className="border p-2">$500</td>
              <td className="border p-2">Paid</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Update Form */}
      <div className="bg-white shadow-md rounded p-6 mt-6">
        <h2 className="text-xl font-semibold">Payment Update</h2>
        <form>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Total Amount" className="border p-2 rounded" />
            <input type="text" placeholder="Paid Amount" className="border p-2 rounded" />
            <input type="text" placeholder="Discount Amount" className="border p-2 rounded" />
            <input type="text" placeholder="Balance" className="border p-2 rounded" />
            <input type="text" placeholder="Concession" className="border p-2 rounded" />
            <input type="text" placeholder="Fine" className="border p-2 rounded" />
            <input type="text" placeholder="Advance Amount" className="border p-2 rounded" />
            <input type="text" placeholder="Wallet Amount" className="border p-2 rounded" />
          </div>
          <div className="mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded ml-2">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
