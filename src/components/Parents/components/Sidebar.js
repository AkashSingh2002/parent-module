import React, { useState, useEffect } from "react";

const ParentSidebar = ({ isSidebarOpen, setIsSidebarOpen, setActivePage }) => {
  const [openResult, setOpenResult] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  useEffect(() => {
    setActivePage(activeItem);
  }, [activeItem, setActivePage]);

  return (
    <>
      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"} 
          md:w-64 md:translate-x-0 md:relative bg-gray-900 text-white flex flex-col p-5 shadow-lg`}
      >
        {/* School Logo and Name */}
        <div className={`text-center mb-6 ${isSidebarOpen ? "block" : "hidden md:block"}`}>
          <img 
            src="https://arizshad-002-site5.ktempurl.com/SchoolDocs/logo.jpg" 
            alt="School Logo" 
            className="w-12 h-12 mx-auto rounded-full md:w-16 md:h-16"
          />
          <h3 className="text-sm font-semibold mt-3 md:text-lg">JEEVAN ADARSH VIDYALAYA</h3>
        </div>

        {/* Sidebar Menu - Hide when Sidebar is Closed on Mobile */}
        <div className={`${isSidebarOpen ? "block" : "hidden md:block"}`}>
          <ul className="space-y-2">
            {/* Attendance */}
            <li 
              className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-700 ${activeItem === "attendance" ? "bg-gray-700" : ""}`}
              onClick={() => setActiveItem("attendance")}
            >
              🏠 <span className="ml-3 text-white">Dashboard</span>
            </li>

            {/* Result (Collapsible) */}
            <li 
              className="flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-700"
              onClick={() => setOpenResult(!openResult)}
            >
              <span className="flex items-center">
                📊 <span className="ml-3 text-white">Result</span>
              </span>
              <span>{openResult ? "▲" : "▼"}</span>
            </li>
            {openResult && (
              <ul className="ml-6 space-y-1">
                <li 
                  className={`text-sm italic cursor-pointer hover:text-gray-300 ${activeItem === "results" ? "font-bold" : ""}`}
                  onClick={() => setActiveItem("results")}
                >
                  View Results
                </li>
              </ul>
            )}

            {/* Payment (Collapsible) */}
            <li 
              className="flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-700"
              onClick={() => setOpenPayment(!openPayment)}
            >
              <span className="flex items-center">
                💳 <span className="ml-3 text-white">Fee</span>
              </span>
              <span>{openPayment ? "▲" : "▼"}</span>
            </li>
            {openPayment && (
              <ul className="ml-6 space-y-1">
                <li 
                  className="text-sm italic cursor-pointer hover:text-gray-300"
                  onClick={() => setActiveItem("feeReport")}
                >
                  Fee Report
                </li>
              </ul>
            )}
            {/* Time Table */}
            <li 
              className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-700 ${activeItem === "schedule-table" ? "bg-gray-700" : ""}`}
              onClick={() => setActiveItem("schedule-table")}
            >
              🗓️ <span className="ml-3 text-white">Time Table</span>
            </li>
            {/* assignment */}
            <li 
              className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-700 ${activeItem === "chat" ? "bg-gray-700" : ""}`}
              onClick={() => setActiveItem("chat")}
            >
               💬
               <span className="ml-3 text-white">Chat</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay when Sidebar is Open on Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default ParentSidebar;
