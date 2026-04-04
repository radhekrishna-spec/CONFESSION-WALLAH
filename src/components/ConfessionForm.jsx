export default function ConfessionForm({ charCount, setCharCount }) {
  return (
    <div className="rounded-3xl bg-white shadow-lg p-6">
      <label className="font-semibold text-gray-700">
        Is there something you always wanted to tell someone? *
      </label>

      <textarea
        id="confession"
        rows={6}
        maxLength={500}
        onChange={(e) => setCharCount(e.target.value.length)}
        className="mt-4 w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-violet-400"
        placeholder="Write your confession here..."
      />

      <p className="text-right text-sm text-gray-500 mt-2">{charCount}/500</p>
    </div>
  );
}
