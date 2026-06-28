const Logout = ({ onLogout }) => {
  return (
    <button
      type="button"
      onClick={onLogout}
      className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-rose-500 hover:text-rose-400"
    >
      Logout
    </button>
  );
};

export default Logout;
