export default function ConfessionHero() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-white">
      {/* Banner */}
      <div className="h-40 rounded-2xl bg-gradient-to-r from-gray-900 via-black to-gray-900 flex items-center justify-center border border-white/10">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          💌 Anonymous Confession
        </h1>
      </div>

      {/* Text */}
      <p className="text-gray-400 text-center mt-6 leading-7">
        Share your thoughts freely.
        <br />
        No judgement. No identity.
        <br />
        Just your voice.
      </p>
    </div>
  );
}
