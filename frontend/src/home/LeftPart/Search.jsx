const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4">
      <input
        className="input input-bordered w-full bg-slate-900/80"
        placeholder="Search contacts"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
    </div>
  );
};

export default Search;
