import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { Suspense, lazy, useEffect, useState } from "react";

// Layouts
import PublicLayout from "./Layout/PublicLayout";
import PrivateLayout from "./Layout/PrivateLayout";
import { PageLoader } from "./components/Common/Loaders";
import { useAuth } from "./Context/AuthContext";
import ScrollToTop from "./Context/ScrollToTop";
// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Workout = lazy(() => import("./pages/Dashboard/Workout"));
const Diet = lazy(() => import("./pages/Dashboard/Diet"));
const Progress = lazy(() => import("./pages/Dashboard/Progress"));
const Analytics = lazy(() => import("./pages/Dashboard/Analytics"));
const Chat = lazy(() => import("./pages/Dashboard/Chat"));
const Settings = lazy(() => import("./pages/Dashboard/Settings"));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}



// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        // Validate token and user data
        if (token && user) {
          try {
            JSON.parse(user); // Validate user data is valid JSON
            setIsAuthenticated(true);
          } catch (e) {
            console.error(e + "Invalid user data in localStorage");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const { loading } = useAuth()

  if (isLoading || loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
          try {
            JSON.parse(user);
            setIsAuthenticated(true);
          } catch (e) {

            console.log(e);

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};




const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 max-w-md">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </button>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop/>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Home />
                  </PublicRoute>
                }
              />

            </Route>

            {/* Private Routes */}
            <Route element={<PrivateLayout />}>

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />


              <Route
                path="/dashboard"
                element={
                  // <ProtectedRoute>
                  <Dashboard />
                  // </ProtectedRoute>
                }
              />

              <Route
                path="/workout"
                element={
                  // <ProtectedRoute>
                  <Workout />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/diet"
                element={
                  // <ProtectedRoute>
                  <Diet />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  // <ProtectedRoute>
                  <Progress />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  // <ProtectedRoute>
                  <Analytics />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  // <ProtectedRoute>
                  <Chat />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  // <ProtectedRoute>
                  <Settings />
                  // </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 Route - Catch all unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;