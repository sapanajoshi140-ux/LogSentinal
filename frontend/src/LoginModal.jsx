import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "./AuthContext";
import Modal from "./Modal";
import UserInput from "./UserInput";
import Buttons from "./Buttons";

const LoginModal = ({
  isOpen,
  onClose,
  onSwitchToSignup,
  onSwitchToForgotPassword,
  hideCloseButton = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResendOption, setShowResendOption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, googleLogin, resendVerification } = useAuth();

  // Show success message if redirected from email verification
  useEffect(() => {
    if (isOpen && searchParams.get("verified") === "true") {
      setSuccess("🎉 Email verified successfully! You can now log in.");

      // Auto-clear success message after 10 seconds
      const timer = setTimeout(() => {
        setSuccess("");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, searchParams]);

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
    setShowResendOption(false);
    onClose();
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setIsLoading(true);
    setError("");
    const result = await googleLogin(tokenResponse.access_token);

    if (result.success) {
      handleClose();
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google Login Failed"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return setError("Email is required.");
    if (!emailRegex.test(email))
      return setError("Please enter a valid email address.");
    if (!password) return setError("Password is required.");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      handleClose();
      navigate("/dashboard");
    } else {
      setError(result.error);
      if (result.error.includes("Verify email first")) {
        setShowResendOption(true);
      }
    }
    setIsLoading(false);
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError("");
    const result = await resendVerification(email);
    setIsLoading(false);

    if (result.success) {
      setSuccess("✉️ Verification email sent! Please check your inbox.");
      setShowResendOption(false);
    } else {
      setError(result.error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Welcome back!"
      hideCloseButton={hideCloseButton}
    >
      <p className="text-center font-['Cormorant_Garamond'] text-[15px] italic mb-6 text-[#78716C]">
        Please login to your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <UserInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <UserInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
          placeholder="Enter your password"
        />

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {showResendOption && (
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={isLoading}
            className="w-full py-3 bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 rounded-xl hover:bg-yellow-500/30 transition text-sm font-medium disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "📧 Resend Verification Email"}
          </button>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-sm flex items-start gap-3 animate-in fade-in zoom-in duration-300">
            <span className="text-lg">✅</span>
            <span className="flex-1">{success}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition">
            <input type="checkbox" className="accent-indigo-500" /> Remember me
          </label>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClose();
              onSwitchToForgotPassword();
            }}
            className="text-blue-300 hover:text-blue-200 transition"
          >
            Forgot password?
          </a>
        </div>

        <Buttons type="submit" loading={isLoading}>
          Log In
        </Buttons>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 h-[1px] bg-white/10"></div>
        <span className="px-3 text-xs text-white uppercase opacity-60">Or</span>
        <div className="flex-1 h-[1px] bg-white/10"></div>
      </div>

      <button
        onClick={() => loginWithGoogle()}
        disabled={isLoading}
        className="w-full py-3 flex items-center justify-center gap-3 border border-white/20 rounded-full hover:bg-white/5 transition disabled:opacity-50"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
          alt="G"
          className="w-5 h-5"
        />
        <span className="text-sm font-medium">Sign In with Google</span>
      </button>

      <p className="mt-8 text-sm text-gray-400 text-center">
        Don't have an account?{" "}
        <a
          href="#"
          className="text-blue-300 underline underline-offset-4 font-medium hover:text-blue-200 transition"
          onClick={(e) => {
            e.preventDefault();
            handleClose();
            onSwitchToSignup();
          }}
        >
          Sign Up
        </a>
      </p>
    </Modal>
  );
};

export default LoginModal;
