export default function ConfessionResponseCard({ response }) {
  return (
    <div className="max-w-2xl mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-2xl font-bold">💌 Anonymous Confession</h2>

        <p className="mt-3 text-gray-400 leading-7">
          Share your thoughts freely.
          <br />
          No judgement. No identity.
          <br />
          Just your voice.
        </p>
      </div>

      {/* Confession */}
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <p className="text-xs text-gray-500 mb-2">Your Confession</p>

        <p className="text-gray-200 leading-7 whitespace-pre-wrap">
          {response.confession || '—'}
        </p>
      </div>

      {/* Nickname */}
      {response.nickname && (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <p className="text-xs text-gray-500 mb-2">Nickname</p>

          <p className="text-gray-200">{response.nickname}</p>
        </div>
      )}

      {/* Mood */}
      {response.mood && (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <p className="text-xs text-gray-500 mb-3">Mood</p>

          <div className="inline-flex items-center px-4 py-2 rounded-xl bg-white/10 border border-white/10">
            {response.mood}
          </div>
        </div>
      )}
    </div>
  );
}
