const Loader = () => {
    return (
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gradient-to-r from-purple-500 via-purple-700 to-indigo-500 shadow-lg"
        style={{
          borderTopColor: "transparent",
          borderLeftColor: "transparent",
          animation: "spin 1.2s linear infinite",
        }}
      ></div>
    );
  };
  
  export default Loader;