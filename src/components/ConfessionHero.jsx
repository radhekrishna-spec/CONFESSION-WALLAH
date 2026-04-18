export default function ConfessionHero() {
  return (
    <div className="rounded-3xl backdrop-blur-lg bg-white/70 shadow-xl p-6 border border-white/50">
      <div className="h-40 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 mb-6 flex items-center justify-center shadow-lg">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          Anonymous Confession 💌
        </h1>
      </div>

      <p className="text-gray-600 leading-7 text-center">
        This is your safe space to share feelings freely.
        <br />
        No judgement. No identity reveal.
        <br />
        Speak your heart anonymously.
      </p>
    </div>
  );
}
