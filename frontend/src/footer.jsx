import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "./AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignupModal from "./SignUpModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import "./App.css";

const Login = ({ img }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("showLogin") === "true") {
      setShowLogin(true);
      setShowSignup(false);
      const p = new URLSearchParams(searchParams);
      p.delete("showLogin");
      setSearchParams(p, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-16 gap-10 md:flex-row md:items-center md:justify-between md:px-16 lg:px-32 xl:px-48 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(13,13,13,0.92),rgba(13,13,13,0.88)),url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        className="flex-1 text-center md:text-left w-full md:w-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-['Cormorant_Garamond'] font-semibold text-[clamp(2.8rem,6.5vw,5rem)] leading-[1.1] tracking-[-0.02em] text-[#F5F0E8]">
          {showLogin ? (
            "Welcome back!"
          ) : (
            <>
              Sign up to
              <br />
              Get Started
            </>
          )}
        </h1>
      </motion.div>

      <motion.div
        className="w-full max-w-md md:min-w-[420px] lg:min-w-[480px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {showSignup && (
          <SignupModal
            isOpen={true}
            onClose={() => {}}
            hideCloseButton={true}
            onSwitchToLogin={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
          />
        )}
        {showLogin && (
          <LoginModal
            isOpen={true}
            onClose={() => {}}
            hideCloseButton={true}
            onSwitchToSignup={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
            onSwitchToForgotPassword={() => setShowForgot(true)}
          />
        )}
      </motion.div>

      <ForgotPasswordModal
        isOpen={showForgot}
        onClose={() => setShowForgot(false)}
        onSwitchToLogin={() => {
          setShowForgot(false);
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
};

const BookIcon = () => (
  <div className="w-9 h-9 border border-[rgba(201,168,76,0.2)] rounded-lg bg-[rgba(201,168,76,0.04)] flex items-center justify-center shrink-0 transition-all duration-[400ms] group-hover:border-[rgba(201,168,76,0.3)] group-hover:bg-[rgba(201,168,76,0.06)]">
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C9A84C"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="13" y2="11" />
    </svg>
  </div>
);

const NavCol = ({ title, links }) => (
  <div className="min-w-[120px]">
    <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#C9A84C] mb-4 font-['Inter']">
      {title}
    </p>
    <ul className="flex flex-col gap-3 list-none p-0 m-0">
      {links.map((link) => (
        <li key={link}>
          <a
            href="#"
            className="text-[13px] text-[#78716C] no-underline font-['Inter'] transition-colors duration-[400ms] hover:text-[#F5F0E8]"
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const SocialBtn = ({ label, icon: Icon }) => (
  <motion.a
    href="#"
    aria-label={label}
    className="w-9 h-9 border border-[rgba(201,168,76,0.12)] rounded-lg flex items-center justify-center text-[#78716C] no-underline transition-all duration-[400ms] hover:border-[rgba(201,168,76,0.3)] hover:text-[#C9A84C]"
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon size={14} />
  </motion.a>
);

const MinimalFooter = () => {
  const navData = [
    { title: "Product", links: ["Features",] },
    { title: "Company", links: ["About", "Contact"] },
   
  ];

  const socials = [
    { label: "Gmail", icon: SiGmail },
    { label: "Instagram", icon: FaInstagram },
    { label: "LinkedIn", icon: FaLinkedinIn },
    { label: "GitHub", icon: FaGithub },
  ];

  return (
    <footer className="bg-[#0D0D0D] border-t border-[rgba(201,168,76,0.08)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-16 pb-12 flex flex-col md:flex-row flex-wrap gap-12 md:gap-16 items-center md:items-start">
        <div className="flex-1 min-w-[200px] max-w-[240px] text-center md:text-left group">
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <img src="/logo.png" alt="ReadWithEase Logo" className="size-8" />

            <span className="font-['Cormorant_Garamond'] text-[20px] font-semibold text-[#F5F0E8]">
              Log<span className="text-[#C9A84C]">Sentinal</span>
            </span>
          </div>
        </div>

        <div className="flex gap-10 md:gap-14 flex-wrap flex-[2_1_380px] justify-center md:justify-start">
          {navData.map((col) => (
            <NavCol key={col.title} {...col} />
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="h-px bg-[rgba(201,168,76,0.08)]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-6 pb-8 flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4">
        <p className="text-[12px] text-[#78716C] m-0 text-center sm:text-left font-['Inter']">
          © {new Date().getFullYear()}{" "}
          <a
            href="#"
            className="text-[#C9A84C] no-underline hover:text-[#E8C96A] transition-colors duration-[400ms]"
          >
            LogSentinal
          </a>
          . All rights reserved.
        </p>

        <div className="flex gap-2">
          {socials.map((s) => (
            <SocialBtn key={s.label} label={s.label} icon={s.icon} />
          ))}
        </div>
      </div>
    </footer>
  );
};

const Footer = () => (
  <div className="overflow-hidden" id="footer-section">
    <Login img="footer.jpg" />
    <MinimalFooter />
  </div>
);

export default Footer;
