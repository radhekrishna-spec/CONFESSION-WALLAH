export default function FilterBar({
  moodFilter,
  setMoodFilter,
  sortOrder,
  setSortOrder,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mt-4 flex gap-4">
      <select
        value={moodFilter}
        onChange={(e) => setMoodFilter(e.target.value)}
        className="border rounded-xl p-2"
      >
        <option>All</option>
        <option>Happy 😊</option>
        <option>Broken 💔</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="border rounded-xl p-2"
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
