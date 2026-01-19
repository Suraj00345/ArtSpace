// Loader.jsx
const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      {/* The Spinner */}
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>

      {/* Optional Text */}
      <p className="mt-3 text-violet-600 font-medium animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loader;
