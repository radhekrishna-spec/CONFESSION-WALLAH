export default function NicknameInput() {
  return (
    <div className="rounded-3xl bg-white shadow-lg p-6">
      <label className="font-semibold text-gray-700">Optional Nickname</label>

      <input
        id="nickname"
        type="text"
        className="mt-4 w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-violet-400"
        placeholder="Stay anonymous if you want"
      />
    </div>
  );
}
