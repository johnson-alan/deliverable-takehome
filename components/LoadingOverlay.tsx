const LoadingOverlay = () => (
  <div className="absolute z-50 inset-0 bg-white bg-opacity-75 flex flex-col gap-4 items-center justify-center">
    <div className="border-t-4 border-transparent border-t-slate-900 rounded-full w-8 h-8 animate-spin-slow"></div>
    <div className="ml-4 flex">
      <span className='text-slate-900 font-semibold'>Loading</span>
      <span className="font-black animate-dot-1 ml-1">.</span>
      <span className="font-black animate-dot-2 ml-1">.</span>
      <span className="font-black animate-dot-3 ml-1">.</span>
    </div>
  </div>
);

export default LoadingOverlay;
