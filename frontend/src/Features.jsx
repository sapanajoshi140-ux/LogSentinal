import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from './AuthContext';
import LoginModal from './LoginModal';
import SignupModal from './SignUpModal';
import ForgotPasswordModal from './ForgotPasswordModal';

const Feature = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const processedParams = useRef(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (loading) return;
    if (processedParams.current) return;
    
    const shouldShowLogin = searchParams.get('showLogin') === 'true';
    const shouldShowSignup = searchParams.get('showSignup') === 'true';
    const shouldShowForgotPassword = searchParams.get('showForgotPassword') === 'true';
    
    if (shouldShowLogin || shouldShowSignup || shouldShowForgotPassword) {
      processedParams.current = true;
      if (shouldShowLogin) setShowLogin(true);
      else if (shouldShowSignup) setShowSignup(true);
      else if (shouldShowForgotPassword) setShowForgotPassword(true);
      
      const params = new URLSearchParams(searchParams);
      params.delete('showLogin');
      params.delete('showSignup');
      params.delete('showForgotPassword');
      if (!shouldShowLogin) params.delete('verified');
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams, loading]);

  const features = [
    {
      
    },
    {
      
    },
    {
     
    },
  ];

  const handleFeatureClick = () => {
    setShowSignup(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    const params = new URLSearchParams(searchParams);
    params.delete('verified');
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  };

  // ─── YOUR ORIGINAL ANIMATION VARIANTS ───
  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1.3 }
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#2D241F]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[rgba(201,168,76,0.2)] border-t-[#C9A84C] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 font-['Inter'] text-sm font-medium text-[#8A8279]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section 
      id="features"
      className="w-full py-24 relative overflow-hidden bg-[#181814]"
    >
      {/* Subtle warm ambient glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.06] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, #C9A84C 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* ─── HERO HEADER WITH YOUR ORIGINAL DELAYS ─── */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h2 className="font-['Inter'] text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight mb-4 tracking-[-0.02em] text-[#F5F0E8]">
           
          </h2>
          
          <p className="font-['Inter'] text-base font-normal text-[#A8A29E] max-w-xl mx-auto leading-relaxed">
           
          </p>
        </motion.div>

        
        <div className="space-y-24">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className={`flex flex-col md:flex-row items-center gap-10 ${
                f.reverse ? "md:flex-row-reverse" : ""
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={featureVariants}
            >
              {/* Image Card */}
              <motion.div 
                className="w-full md:w-[45%] relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div 
                  className="aspect-[16/10] rounded-2xl overflow-hidden relative flex items-center justify-center"
                  style={{
                    background: 'rgba(35, 32, 29, 0.6)',
                    border: '0.5px solid rgba(201, 168, 76, 0.15)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 0.5px 0 rgba(201,168,76,0.06)',
                  }}
                >
                  <img 
                    src={f.img} 
                    alt={f.title} 
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                  />
                </div>
              </motion.div>

              {/* Text Content */}
              <div className="w-full md:w-[55%] text-center md:text-left px-2">
                <span className="font-['Inter'] text-[11px] font-medium tracking-[0.15em] uppercase mb-3 block text-[#C9A84C]">
                  Feature {String(i + 1).padStart(2, '0')}
                </span>
                
                <h3 className="font-['Inter'] text-[clamp(1.4rem,2.2vw,1.9rem)] font-semibold mb-3 tracking-[-0.01em] leading-tight text-[#F5F0E8]">
                  {f.title}
                </h3>
                
                <p className="font-['Inter'] text-[15px] leading-relaxed font-normal mb-8 max-w-md text-[#A8A29E]">
                  {f.desc}
                </p>
                
                {/* ─── BUTTON WITH YOUR ORIGINAL ANIMATION ─── */}
                <motion.button 
                  onClick={handleFeatureClick}
                  className="font-['Inter'] text-[13px] font-medium tracking-[0.02em] rounded-full px-8 py-3 cursor-pointer transition-all duration-200 inline-flex items-center gap-2 text-[#F5F0E8] bg-transparent border border-[rgba(201,168,76,0.2)] hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.06)]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── BOTTOM CTA WITH YOUR ORIGINAL DELAY ─── */}
        <motion.div 
          className="text-center mt-20 pt-16"
          style={{ borderTop: '0.5px solid rgba(201, 168, 76, 0.1)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <h3 className="font-['Inter'] text-xl font-semibold mb-3 text-[#F5F0E8] tracking-[-0.01em]">
            Ready to <span className="text-[#C9A84C]">Begin</span>?
          </h3>
          
          <p className="font-['Inter'] text-sm text-[#A8A29E] mb-6">
            Join and transform your learning experience.
          </p>
          
          <motion.button
            onClick={handleFeatureClick}
            className="font-['Inter'] text-[13px] font-semibold tracking-[0.02em] rounded-full px-8 py-3 cursor-pointer transition-all duration-200 text-[#2A2724] bg-[#C9A84C] hover:bg-[#E8C96A]"
            style={{ boxShadow: '0 4px 20px rgba(201,168,76,0.15)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Reading Now
          </motion.button>
        </motion.div>
      </div>

      {/* Modals */}
      <LoginModal 
        isOpen={showLogin}
        onClose={handleCloseLogin}
        onSwitchToSignup={() => {
          handleCloseLogin();
          setShowSignup(true);
        }}
        onSwitchToForgotPassword={() => {
          handleCloseLogin();
          setShowForgotPassword(true);
        }}
      />
      <SignupModal 
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSwitchToLogin={() => {
          setShowForgotPassword(false);
          setShowLogin(true);
        }}
      />
    </section>
  );
};

export default Feature;