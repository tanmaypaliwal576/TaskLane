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

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/user/dashboard" element={<UserDashboard />} />

        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      
      </Routes>
    </Router>
  );
};

export default App;
