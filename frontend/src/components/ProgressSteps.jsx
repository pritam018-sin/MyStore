const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-center items-center space-x-2 sm:space-x-4 py-4">
      <div className={`text-center ${step1 ? "text-green-400 font-semibold" : "text-gray-400"}`}>
        <span className="text-xs sm:text-sm">Login</span>
        <div className="mt-1 text-base sm:text-lg">✅</div>
      </div>

      <div
        className={`h-0.5 w-8 sm:w-16 md:w-24 transition-colors ${
          step1 && step2 ? "bg-green-500" : "bg-white/20"
        }`}
      />

      <div className={`text-center ${step2 ? "text-green-400 font-semibold" : "text-gray-400"}`}>
        <span className="text-xs sm:text-sm">Shipping</span>
        <div className="mt-1 text-base sm:text-lg">{step2 ? "✅" : "⚪"}</div>
      </div>

      <div
        className={`h-0.5 w-8 sm:w-16 md:w-24 transition-colors ${
          step1 && step2 && step3 ? "bg-green-500" : "bg-white/20"
        }`}
      />

      <div className={`text-center ${step3 ? "text-green-400 font-semibold" : "text-gray-400"}`}>
        <span className="text-xs sm:text-sm">Summary</span>
        <div className="mt-1 text-base sm:text-lg">{step3 ? "✅" : "⚪"}</div>
      </div>
    </div>
  );
};

export default ProgressSteps;