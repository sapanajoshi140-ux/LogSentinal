import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from './AuthContext';
import { useEffect } from 'react';

// Components
import Navbar from "./Navbar";
import HeroSlider from "./HeroSlider";
import Features from "./Features";
import Footer from "./Footer";
import VerifyEmail from "./VerifyEmail";
import ResetPassword from "./Passwordreset";

const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const LandingPage = () => {
  // Clear any auth query params when landing page mounts
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('auth') || url.searchParams.has('showLogin')) {
      // Remove query params without adding to history
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('auth');
      newUrl.searchParams.delete('showLogin');
      window.history.replaceState({}, '', newUrl.pathname);
    }
  }, []);

  return (
    <MainLayout>
      <HeroSlider />
      <Features />
    </MainLayout>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  // Store the attempted location and redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-800 mb-2">Lost in space?</p>
        <p className="text-gray-500 mb-6">That page doesn't exist.</p>
        <button 
          onClick={() => navigate('/', { replace: true })}
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg cursor-pointer"
        >
          Back to Safety
        </button>
      </div>
    </div>
  );
};

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="p-10 bg-red-50 text-red-700 border border-red-200 m-10 rounded-xl">
        <h2 className="font-bold text-xl">Configuration Error</h2>
        <p>Missing <code>VITE_GOOGLE_CLIENT_ID</code> in your .env file. The app cannot start without this.</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth Flows */}
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Dashboard Route */}
            

            {/* 404 Catch-all - Must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;