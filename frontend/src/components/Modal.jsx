const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-gradient-to-br from-purple-600 via-rose-500 to-orange-500 p-[3px] rounded-2xl shadow-2xl z-10 w-full max-w-lg">
        <div className="bg-gray-800 p-6 rounded-2xl text-white relative">
          {/* Close button */}
          <button
            className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl font-bold transition-colors focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
