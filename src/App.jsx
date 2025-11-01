// Main App component with routing and authentication
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/auth';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-blush flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose mx-auto mb-4"></div>
        <p className="text-dark">Loading Photo2Profit...</p>
      </div>
    </div>
  );
}

// Protected route component
function ProtectedRoute({ children, user }) {
  return user ? children : <Navigate to="/auth" replace />;
}

// Public route component (redirects to dashboard if authenticated)
function PublicRoute({ children, user }) {
  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <PublicRoute user={user}>
                <Landing />
              </PublicRoute>
            } 
          />
          <Route 
            path="/auth" 
            element={
              <PublicRoute user={user}>
                <Auth onAuthSuccess={handleAuthSuccess} />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route 
            path="*" 
            element={<Navigate to={user ? "/dashboard" : "/"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}