import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticating } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Mark auth check as complete once loading finishes
    if (!loading) {
      setHasCheckedAuth(true);
    }
  }, [loading]);

  // Show loading only during initial auth check OR during login/register
  if (loading || isAuthenticating) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  // If no user after auth check, redirect to login
  if (!user) {
    // Clear any stale tokens
    if (localStorage.getItem('accessToken')) {
      console.warn('⚠️ Token exists but no user, clearing stale auth');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    return <Navigate to="/login" replace />;
  }

  // User exists - render children
  return children;
};

export default ProtectedRoute;