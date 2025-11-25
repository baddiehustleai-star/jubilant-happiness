import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { BrandingProvider } from './contexts/BrandingContext.jsx';

// Lazy load components for better performance
const Landing = React.lazy(() => import('./pages/Landing.jsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'));
const Analytics = React.lazy(() =>
  import('@vercel/analytics/react').then((module) => ({
    default: module.Analytics,
  }))
);
// Protected Route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? children : <Navigate to="/" replace />;
}

// Public Route component (redirects to dashboard if authenticated)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrandingProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <Landing />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Suspense fallback={null}>
                <Analytics />
              </Suspense>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </BrandingProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
