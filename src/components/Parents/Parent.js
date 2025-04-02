import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import LoginUI from "./components/LoginUi";
// import LoginTwo from "./components/LoginTwo";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Attendance from "./pages/Attendance";
import ChatApp from "./pages/ChatApp";
import AssignmentNotifications from "./pages/Assignment";



function Parent() {
  return (
    <BrowserRouter> {/* ✅ Use BrowserRouter instead of Router */}
    <Routes>
      {/* <Route path="/" element={<LoginUI />} /> */}
      {/* <Route path="/login" element={<LoginTwoWrapper />} /> */}
      <Route path="/header" element={<Header />} />
      <Route path="/sidebar" element={<Sidebar />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/chatapp" element={<ChatApp />} />
      <Route path="/assignment" element={<AssignmentNotifications />} />
    </Routes>
  </BrowserRouter>
  );
}

export default Parent;
