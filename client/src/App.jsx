import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';

// Public Pages
import LandingPage from './pages/LandingPage';
import TempleListing from './pages/TempleListing';
import TempleDetails from './pages/TempleDetails';
import DonationPage from './pages/DonationPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Protected Pages
import SlotSelection from './pages/SlotSelection';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingSuccess from './pages/BookingSuccess';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminTempleManagement from './pages/AdminTempleManagement';
import AdminSlotManagement from './pages/AdminSlotManagement';
import AdminBookingManagement from './pages/AdminBookingManagement';
import AdminUserManagement from './pages/AdminUserManagement';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
        <h3>Loading session...</h3>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />
            <div className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/temples" element={<TempleListing />} />
                <Route path="/temples/:id" element={<TempleDetails />} />
                <Route path="/donations" element={<DonationPage />} />

                {/* User/Devotee Protected Routes */}
                <Route path="/temples/:templeId/slots" element={
                  <ProtectedRoute allowedRoles={['USER', 'ORGANIZER', 'ADMIN']}>
                    <SlotSelection />
                  </ProtectedRoute>
                } />
                <Route path="/temples/:templeId/book" element={
                  <ProtectedRoute allowedRoles={['USER', 'ORGANIZER', 'ADMIN']}>
                    <BookingPage />
                  </ProtectedRoute>
                } />
                <Route path="/temples/:templeId/payment" element={
                  <ProtectedRoute allowedRoles={['USER', 'ORGANIZER', 'ADMIN']}>
                    <PaymentPage />
                  </ProtectedRoute>
                } />
                <Route path="/temples/:templeId/success" element={
                  <ProtectedRoute allowedRoles={['USER', 'ORGANIZER', 'ADMIN']}>
                    <BookingSuccess />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />

                {/* Organizer Specific Routes */}
                <Route path="/organizer" element={
                  <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/organizer/slots" element={
                  <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                    <AdminSlotManagement />
                  </ProtectedRoute>
                } />

                {/* Admin Specific Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/temples" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminTempleManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/slots" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminSlotManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/bookings" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminBookingManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUserManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/donations" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Profile /> {/* Reuses Profile donations log view for Admin */}
                  </ProtectedRoute>
                } />

                {/* Fallback 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
