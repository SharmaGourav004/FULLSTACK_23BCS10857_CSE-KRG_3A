// src/components/SearchFilter.jsx
export default function SearchFilter({ query, onQuery, filters, onFilter }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex-1">
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search by name, breed or description..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
        />
      </div>

      <div className="flex gap-3 items-center">
        <select
          value={filters.type}
          onChange={(e) => onFilter({ ...filters, type: e.target.value })}
          className="p-2 rounded border"
        >
          <option>All</option>
          <option>Dog</option>
          <option>Cat</option>
        </select>

        <select
          value={filters.sex}
          onChange={(e) => onFilter({ ...filters, sex: e.target.value })}
          className="p-2 rounded border"
        >
          <option>All</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <button
          onClick={() => { onQuery(""); onFilter({ type: "All", sex: "All" }); }}
          className="px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
