import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';

// Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LogActPage } from './pages/LogActPage';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Layout wrapper with navbar
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/log-act" element={
            <ProtectedRoute>
              <AppLayout>
                <LogActPage />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Placeholder routes - to be implemented */}

          <Route path="/community" element={
            <ProtectedRoute>
              <AppLayout>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Community Feed - Coming Soon</h1>
                  <p className="text-gray-medium mt-2">This feature is being built</p>
                </div>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <AppLayout>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Leaderboard - Coming Soon</h1>
                  <p className="text-gray-medium mt-2">This feature is being built</p>
                </div>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile/:username" element={
            <ProtectedRoute>
              <AppLayout>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Profile Page - Coming Soon</h1>
                  <p className="text-gray-medium mt-2">This feature is being built</p>
                </div>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <AppLayout>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Settings - Coming Soon</h1>
                  <p className="text-gray-medium mt-2">This feature is being built</p>
                </div>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute>
              <AppLayout>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Admin Dashboard - Coming Soon</h1>
                  <p className="text-gray-medium mt-2">This feature is being built</p>
                </div>
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
