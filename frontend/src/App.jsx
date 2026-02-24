import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Home from './pages/Home.jsx';

import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Workout from './pages/Dashboard/Workout.jsx';
import Diet from './pages/Dashboard/Diet.jsx';
import Progress from "./pages/Dashboard/Progress.jsx";
import Analytics from "./pages/Dashboard/Analytics.jsx";
import Chat from "./pages/Dashboard/Chat.jsx";
import Settings from "./pages/Dashboard/Settings.jsx";
import ScrollToTop from './context/ScrollToTop.jsx';
import PublicLayout from "./Layout.jsx/PublicLayout.jsx";
import PrivateLayout from "./Layout.jsx/PrivateLayout.jsx";

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,     // animation duration (ms)
      once: true,         // animation happens only once
      offset: 100,        // offset from original trigger point
    });
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
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