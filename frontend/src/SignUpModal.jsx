import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "./AuthContext";
import Modal from "./Modal";
import Input from "./UserInput";
import Button from "./Buttons";

const SignupModal = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  hideCloseButton = false,
}) => {
  // --- Form State ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // --- Status State ---
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Resend State ---
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const { signup, googleLogin } = useAuth();

  const handleClose = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setResendMessage("");
    setSubmittedEmail("");
    setAgreedToTerms(false);
    onClose();
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResendMessage("");

    if (!validateForm()) return;

    setIsLoading(true);
    // Capture email before clearing state
    const emailForResend = email;
    const result = await signup(fullName, email, password, confirmPassword);
    setIsLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setSubmittedEmail(emailForResend);
      // Reset form
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreedToTerms(false);
    } else {
      setError(result.error);
    }
  };

  const handleResendLink = async () => {
    setResendLoading(true);
    setResendMessage("");

    try {
      const response = await fetch(
        "http://localhost:8000/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: submittedEmail }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        setResendMessage("✅ A new link has been sent!");
      } else {
        setResendMessage(data.detail || "Failed to resend. Try again later.");
      }
    } catch (err) {
      setResendMessage("❌ Network error. Check your connection.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setIsLoading(true);
    setError("");
    const result = await googleLogin(tokenResponse.access_token);
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const signupWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google Signup Failed"),
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={success ? "Success!" : "Create your Account"}
      hideCloseButton={hideCloseButton}
    >
      <div className="space-y-4">
        {/* VIEW 1: SUCCESS BOX (Shown after successful API call) */}
        {success ? (
          <div className="text-left animate-in fade-in zoom-in duration-500">
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-[#F5F0E8] font-semibold text-2xl tracking-[-0.01em]">
                  Check your email
                </h3>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                We've sent a verification link to{" "}
                <span className="text-blue-300 font-medium">
                  {submittedEmail}
                </span>
                . Please click it to activate your account.
              </p>

              {/* ACTION: Go to Login Button */}
              <button
                onClick={() => {
                  handleClose();
                  onSwitchToLogin();
                }}
                className="w-full mt-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Go to Login
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>

              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-gray-400 text-[11px] mb-2 uppercase tracking-widest">
                  Didn't receive it?
                </p>
                <button
                  onClick={handleResendLink}
                  disabled={resendLoading}
                  className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {resendLoading && (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {resendLoading ? "Sending..." : "Resend Verification Email"}
                </button>

                {resendMessage && (
                  <p
                    className={`mt-3 text-xs font-medium p-2 rounded-lg ${resendMessage.includes("✅") ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}
                  >
                    {resendMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: SIGNUP FORM (Standard View) */
          <>
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl text-sm animate-pulse">
                  {error}
                </div>
              )}

              <div className="flex items-center text-xs pt-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="accent-indigo-500 mt-0.5"
                  />
                  <span className="text-gray-400">
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>
              </div>

              <Button type="submit" loading={isLoading}>
                Sign Up
              </Button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-1 h-[1px] bg-white/10"></div>
              <span className="px-3 text-xs text-white opacity-40 uppercase">
                Or
              </span>
              <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>

            <button
              onClick={() => signupWithGoogle()}
              className="w-full py-3 flex items-center justify-center gap-3 border border-white/20 rounded-full hover:bg-white/5 transition"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="G"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-white">
                Sign Up with Google
              </span>
            </button>

            <p className="mt-6 text-sm text-gray-400 text-center">
              Already have an account?{" "}
              <button
                className="text-blue-300 underline underline-offset-4 font-medium hover:text-blue-200"
                onClick={(e) => {
                  e.preventDefault();
                  handleClose();
                  onSwitchToLogin();
                }}
              >
                Log In
              </button>
            </p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default SignupModal;
