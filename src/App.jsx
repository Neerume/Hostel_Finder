import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';

// Dashboard Layouts & Pages
import DashboardLayout from './components/DashboardLayout';
import UserDashboard from './pages/dashboard/UserDashboard';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import AddHostel from './pages/dashboard/AddHostel';
import EditProfile from './pages/dashboard/EditProfile';
import HostelDetails from './pages/dashboard/HostelDetails';
import { useAuth } from './context/AuthContext';

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;

  const role = user.role;
  return <Navigate to={`/${role}/dashboard`} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login/:type" element={<Login />} />
        <Route path="/register/:type" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User Dashboard Routes */}
        <Route path="/user" element={<DashboardLayout role="user" />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="hostel/:id" element={<HostelDetails />} />
          <Route path="profile" element={<EditProfile />} />
        </Route>

        {/* Owner Dashboard Routes */}
        <Route path="/owner" element={<DashboardLayout role="owner" />}>
          <Route index element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="add-hostel" element={<AddHostel />} />
          <Route path="hostel/:id" element={<HostelDetails />} />
          <Route path="profile" element={<EditProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
