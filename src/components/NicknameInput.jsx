export default function NicknameInput({ nickname, setNickname }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-white">
      <label className="text-sm text-gray-400">Optional Nickname</label>

      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Stay anonymous if you want"
        className="mt-3 w-full rounded-2xl bg-white/5 border border-white/10 p-4 outline-none text-white placeholder:text-gray-500 focus:border-white/30"
      />
    </div>
  );
}
