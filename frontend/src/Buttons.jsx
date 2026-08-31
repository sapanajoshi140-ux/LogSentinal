const Button = ({
  children,
  onClick,
  disabled,
  loading,
  variant = "primary",
  type = "button",
}) => {
  const baseStyles =
    "w-full py-2.5 font-['Inter'] font-semibold text-[13px] tracking-[0.02em] rounded-full transition-all duration-[400ms] disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#C9A84C] text-[#0D0D0D] hover:bg-[#E8C96A] shadow-[0_2px_16px_rgba(201,168,76,0.2)] hover:shadow-[0_4px_24px_rgba(201,168,76,0.3)]",
    secondary:
      "bg-transparent text-[#F5F0E8] border border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.04)]",
    google:
      "bg-transparent text-[#F5F0E8] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.25)] hover:bg-[rgba(201,168,76,0.04)]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
