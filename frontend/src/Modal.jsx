const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  hideCloseButton = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`${hideCloseButton ? "relative" : "fixed inset-0 z-[1100] flex items-center justify-center bg-[rgba(13,13,13,0.85)] backdrop-blur-[16px]"}`}
      onClick={hideCloseButton ? undefined : onClose}
    >
      <div
        className={`relative w-full max-w-md p-8 ${hideCloseButton ? "" : "mx-6"} rounded-3xl bg-[#161614] border border-[rgba(201,168,76,0.15)] text-[#F5F0E8] ${
          hideCloseButton ? "" : "shadow-[0_8px_48px_rgba(0,0,0,0.6)]"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {!hideCloseButton && (
          <button
            className="absolute top-5 right-5 text-2xl text-[#78716C] hover:text-[#F5F0E8] transition-colors duration-[400ms]"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        )}

        {title && (
          <div className="mb-6 text-center">
            <h1
              id="modal-title"
              className="font-['Cormorant_Garamond'] text-3xl font-semibold tracking-[-0.01em] text-[#F5F0E8]"
            >
              {title}
            </h1>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
