const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Modal content */}
          <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 bg-gradient-to-br from-purple-600 via-rose-500 to-orange-500 p-[3px] rounded-2xl shadow-lg z-10">
            <div className="bg-gray-800 p-6 rounded-2xl text-white relative">
              {/* Close button */}
              <button
                className="absolute top-2 right-2 text-white text-xl font-semibold hover:text-gray-300 focus:outline-none"
                onClick={onClose}
              >
                X
              </button>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
