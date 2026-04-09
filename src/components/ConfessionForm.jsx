export default function ConfessionForm({ confessionText, setConfessionText }) {
  const charCount = confessionText.length;
  return (
    <div className="rounded-3xl bg-white shadow-lg p-6">
      <label className="font-semibold text-gray-700">
        Is there something you always wanted to tell someonee ? *
      </label>
      <textarea
        id="confession"
        rows={6}
        maxLength={6000}
        value={confessionText}
        onChange={(e) => setConfessionText(e.target.value)}
        className="mt-4 w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-violet-400"
        placeholder="Write your confession here..."
      />

      <p className="text-right text-sm text-gray-500 mt-2">{charCount}/6000</p>
    </div>
  );
}
