import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';

// Public Pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const TempleListing = React.lazy(() => import('./pages/TempleListing'));
const TempleDetails = React.lazy(() => import('./pages/TempleDetails'));
const DonationPage = React.lazy(() => import('./pages/DonationPage'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Protected Pages
const SlotSelection = React.lazy(() => import('./pages/SlotSelection'));
const BookingPage = React.lazy(() => import('./pages/BookingPage'));
const PaymentPage = React.lazy(() => import('./pages/PaymentPage'));
const BookingSuccess = React.lazy(() => import('./pages/BookingSuccess'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Notifications = React.lazy(() => import('./pages/Notifications'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminTempleManagement = React.lazy(() => import('./pages/AdminTempleManagement'));
const AdminSlotManagement = React.lazy(() => import('./pages/AdminSlotManagement'));
const AdminBookingManagement = React.lazy(() => import('./pages/AdminBookingManagement'));
const AdminUserManagement = React.lazy(() => import('./pages/AdminUserManagement'));

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

const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '60vh', 
    backgroundColor: 'transparent',
    color: 'var(--text-color)'
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderTop: '3px solid var(--primary-color)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} className="loading-spinner"></div>
      <h4 style={{ margin: 0, fontWeight: 'normal', color: 'var(--text-secondary)' }}>Loading shrine data...</h4>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />
            <div className="main-content">
              <React.Suspense fallback={<PageLoader />}>
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
              </React.Suspense>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
