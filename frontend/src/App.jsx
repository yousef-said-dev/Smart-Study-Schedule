import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const HowToUse = React.lazy(() => import('./pages/HowToUse'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Subjects = React.lazy(() => import('./pages/Subjects'));
const AddEditSubject = React.lazy(() => import('./pages/AddEditSubject'));
const Schedule = React.lazy(() => import('./pages/Schedule'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Tasks = React.lazy(() => import('./pages/Tasks'));
const FocusTracker = React.lazy(() => import('./pages/FocusTracker'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Header = React.lazy(() => import('./components/layout/Header'));
const ProtectedRoute = React.lazy(() => import('./components/layout/ProtectedRoute'));

function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log('🎯 App state update:', {
      user: user?.email,
      loading,
      hasToken: !!localStorage.getItem('accessToken'),
      path: window.location.pathname,
    });
  }, [user, loading]);

  // Handle auth state changes
  useEffect(() => {
    if (!loading && user && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
      setTimeout(() => {
        console.log('✅ User logged in, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }, 0);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingSpinner message="Loading application..." />;
  }

  return (
    <React.Suspense fallback={<LoadingSpinner message="Loading page..." />}>
      <div className="min-h-screen text-slate-100 antialiased">
        {user && window.location.pathname !== '/' && <Header />}

        <main className="">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" replace /> : <Register />}
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects"
              element={
                <ProtectedRoute>
                  <Subjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects/new"
              element={
                <ProtectedRoute>
                  <AddEditSubject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects/:id"
              element={
                <ProtectedRoute>
                  <AddEditSubject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/focus"
              element={
                <ProtectedRoute>
                  <FocusTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/how-to-use"
              element={<HowToUse />}
            />
            <Route
              path="/"
              element={<Home />}
            />
          </Routes>
        </main>
      </div>
    </React.Suspense>
  );
}

export default App;