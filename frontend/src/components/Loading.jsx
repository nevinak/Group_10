const Loading = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-4 shadow-xl">
      <span className="loading loading-spinner loading-md text-sky-400"></span>
      <span className="text-sm font-medium">Preparing your chat workspace...</span>
    </div>
  </div>
);

export default Loading;
