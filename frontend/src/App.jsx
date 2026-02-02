import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashBoard";
import ManagerDashboard from "./pages/ManagerDashBoard";
import Contact from "./pages/Contact";
import { Toaster } from 'react-hot-toast';


const App = () => {
  return (
    <Router>
        <Toaster position="top-center" />

      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/user/dashboard" element={<UserDashboard />} />

        <Route path="/manager/dashboard" element={<ManagerDashboard />} />

        <Route path="/contact" element={<Contact />} />
      
      </Routes>
    </Router>
  );
};

export default App;
