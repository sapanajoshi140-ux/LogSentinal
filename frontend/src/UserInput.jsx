import { useState } from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  onKeyPress,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div>
      {label && (
        <label className="font-['Inter'] text-[11px] font-medium tracking-[0.02em] text-[#78716C] ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          className={`w-full mt-1.5 px-4 py-2.5 bg-[rgba(13,13,13,0.4)] border ${error ? "border-[rgba(220,80,80,0.4)]" : "border-[rgba(201,168,76,0.12)]"} rounded-xl focus:outline-none focus:border-[rgba(201,168,76,0.3)] transition-all duration-[400ms] font-['Inter'] text-[14px] text-[#F5F0E8] placeholder-[#78716C]`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#F5F0E8] transition-colors duration-[400ms] text-base"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && (
        <p className="font-['Inter'] text-[rgba(220,80,80,0.9)] text-[11px] mt-1.5 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
