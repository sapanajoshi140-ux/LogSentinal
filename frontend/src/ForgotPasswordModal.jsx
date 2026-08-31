import { useState } from "react";
import { useAuth } from "./AuthContext";
import Modal from "./Modal";
import Input from "./UserInput";
import Button from "./Buttons";

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState(""); // Stores email for resending
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { forgotPassword } = useAuth();

  const handleClose = () => {
    setEmail("");
    setSubmittedEmail("");
    setError("");
    setSuccess("");
    onClose();
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    const emailToSave = email; // Capture email before clearing
    const result = await forgotPassword(email);
    setIsLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setSubmittedEmail(emailToSave);
      setEmail("");
    } else {
      setError(result.error);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    const result = await forgotPassword(submittedEmail);
    setResendLoading(false);

    if (result.success) {
      setSuccess("A new reset link has been sent to your email.");
    } else {
      setError(result.error || "Failed to resend. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={success ? "Link Sent!" : "Forgot Password?"}
    >
      <div className="space-y-4">
        {!success ? (
          <>
            <p className="text-sm text-gray-400 mb-6 text-center">
              Enter your email to receive a password reset link
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" loading={isLoading}>
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          /* SUCCESS VIEW: Shown after first successful send */
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3 className="font-['Cormorant_Garamond'] text-[#F5F0E8] font-semibold text-2xl tracking-[-0.01em] mb-2">
                Check your email
              </h3>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                A reset link was sent to <br />
                <span className="text-blue-300 font-medium">
                  {submittedEmail}
                </span>
              </p>

              <div className="pt-4 border-t border-white/10">
                <p className="text-gray-400 text-xs mb-3">
                  Didn't get it? Check your spam folder or
                </p>
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                >
                  {resendLoading && (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {resendLoading ? "Resending..." : "Resend Reset Link"}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        <p className="mt-8 text-sm text-gray-400 text-center">
          Remember your password?{" "}
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
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;
