import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "./AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignupModal from "./SignUpModal";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("showLogin") === "true") {
      setShowLogin(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("showLogin");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const modalOpen = showLogin || showSignup || showForgotPassword;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-[1000] w-full transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "h-[64px] bg-[rgba(13,13,13,0.7)] backdrop-blur-[24px] border-b border-[rgba(201,168,76,0.12)] shadow-[0_1px_24px_rgba(0,0,0,0.4)]"
            : "h-[72px] bg-transparent border-b border-[rgba(201,168,76,0.08)]"
        } ${modalOpen ? "blur-[4px] pointer-events-none" : ""}`}
      >
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6 md:px-12">
          {/* Brand */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img src="/logo.png" alt="ReadWithEase Logo" className="size-8" />
            <span className="font-['Cormorant_Garamond'] text-[20px] font-semibold text-[#F5F0E8]">
              Log<span className="text-[#C9A84C]">Sentinal</span>
            </span>
          </motion.div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 bg-transparent border-none cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-[1.5px] bg-[#F5F0E8] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-[#F5F0E8] transition-all duration-[400ms] ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-[#F5F0E8] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-1 list-none m-0 p-0">
              {["About", "Features", "Contact"].map((item) => (
                <li key={item}>
                  <motion.button
                    className="font-['Inter'] text-[14px] font-medium text-[#78716C] bg-transparent border-none cursor-pointer px-4 py-2 rounded-lg transition-all duration-[400ms] hover:text-[#F5F0E8] relative group"
                    onClick={() =>
                      item !== "About" && scrollToSection(item.toLowerCase())
                    }
                    whileHover={{ y: -1 }}
                  >
                    {item}
                    <span className="absolute bottom-1 left-4 right-4 h-[1px] bg-[#C9A84C] scale-x-0 group-hover:scale-x-100 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  </motion.button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="font-['Inter'] text-[13px] font-medium text-[#78716C] px-2">
                    {user?.full_name || user?.email}
                  </span>
                  <motion.button
                    className="font-['Inter'] text-[13px] font-medium text-[#dc5050] bg-transparent border border-[rgba(220,80,80,0.2)] rounded-full px-5 py-2 cursor-pointer transition-all duration-[400ms] hover:border-[rgba(220,80,80,0.4)] hover:bg-[rgba(220,80,80,0.05)]"
                    onClick={handleLogout}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    className="font-['Inter'] text-[13px] font-medium text-[#F5F0E8] bg-transparent border border-[rgba(201,168,76,0.15)] rounded-full px-5 py-2 cursor-pointer transition-all duration-[400ms] hover:border-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.04)]"
                    onClick={() => setShowLogin(true)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    className="font-['Inter'] text-[13px] font-semibold text-[#0D0D0D] bg-[#C9A84C] border-none rounded-full px-6 py-2 cursor-pointer transition-all duration-[400ms] hover:bg-[#E8C96A] shadow-[0_2px_12px_rgba(201,168,76,0.2)] hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                    onClick={() => setShowSignup(true)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="md:hidden fixed top-[72px] left-0 w-full z-[999] bg-[rgba(13,13,13,0.9)] backdrop-blur-[24px] border-b border-[rgba(201,168,76,0.12)] px-6 py-6"
        >
          <ul className="flex flex-col gap-2 list-none m-0 p-0 mb-6">
            {["About", "Features", "Contact"].map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <button
                  className="font-['Inter'] text-[14px] font-medium text-[#78716C] bg-transparent border-none cursor-pointer px-4 py-3 rounded-lg w-full text-left transition-all duration-[400ms] hover:text-[#F5F0E8] hover:bg-[rgba(201,168,76,0.04)]"
                  onClick={() => {
                    item !== "About" && scrollToSection(item.toLowerCase());
                    setMobileMenuOpen(false);
                  }}
                >
                  {item}
                </button>
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <span className="font-['Inter'] text-[13px] font-medium text-[#78716C] px-4">
                  {user?.full_name || user?.email}
                </span>
                <button
                  className="font-['Inter'] text-[13px] font-medium text-[#dc5050] bg-transparent border border-[rgba(220,80,80,0.2)] rounded-full px-5 py-2.5 cursor-pointer transition-all duration-[400ms] hover:border-[rgba(220,80,80,0.4)]"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="font-['Inter'] text-[13px] font-medium text-[#F5F0E8] bg-transparent border border-[rgba(201,168,76,0.15)] rounded-full px-5 py-2.5 cursor-pointer transition-all duration-[400ms]"
                  onClick={() => {
                    setShowLogin(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
                <button
                  className="font-['Inter'] text-[13px] font-semibold text-[#0D0D0D] bg-[#C9A84C] border-none rounded-full px-6 py-2.5 cursor-pointer transition-all duration-[400ms] hover:bg-[#E8C96A]"
                  onClick={() => {
                    setShowSignup(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
        onSwitchToForgotPassword={() => {
          setShowLogin(false);
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
    </>
  );
};

export default Navbar;
