import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/verify-email?token=${token}`);
        
        if (response.ok) {
          const data = await response.json();
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          
          // Redirect to home with showLogin=true and verified=true after 2 seconds
          setTimeout(() => {
            navigate('/?showLogin=true&verified=true');
          }, 2000);
        } else {
          const data = await response.json();
          setStatus('error');
          setMessage(data.detail || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-md w-full mx-4 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
            <p className="mt-6 text-white text-lg font-medium">Verifying your email...</p>
            <p className="mt-2 text-gray-300 text-sm">Please wait a moment</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mt-6">Success!</h1>
            <p className="text-green-200 mt-3 text-lg">{message}</p>
            <p className="text-gray-300 text-sm mt-4">You can now log in to your account</p>
            
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <p className="text-gray-400 text-sm">Redirecting to login...</p>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>

            <button 
              onClick={() => navigate('/?showLogin=true&verified=true')}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold hover:from-blue-600 hover:to-blue-700 transition shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
            >
              Go to Login Now
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mt-6">Verification Failed</h1>
            <p className="text-red-200 mt-3 text-lg">{message}</p>
            <p className="text-gray-300 text-sm mt-4">The link may have expired or is invalid</p>
            
            <div className="mt-6 space-y-3">
              <button 
                onClick={() => navigate('/?showLogin=true')}
                className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold hover:from-blue-600 hover:to-blue-700 transition shadow-lg"
              >
                Try Logging In
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition"
              >
                Go to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;