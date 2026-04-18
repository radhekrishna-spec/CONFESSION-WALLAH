export default function ConfessionResponseCard({ response }) {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-3xl font-bold text-violet-700">
          Anonymous Confession 💌
        </h2>

        <p className="mt-2 text-gray-600 leading-7">
          This is a safe space to share your feelings anonymously.
          <br />
          No judgement. No identity reveal.
          <br />
          Speak your heart freely.
        </p>
      </div>

      {/* Confession */}
      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-sm text-gray-500 mb-2">
          Is there something you always wanted to tell someone?
        </p>
        <p className="text-gray-800">{response.confession}</p>
      </div>

      {/* Nickname */}
      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-sm text-gray-500 mb-2">Optional Nickname</p>
        <p className="text-gray-800">{response.nickname}</p>
      </div>

      {/* Mood */}
      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-sm text-gray-500 mb-4">Your Mood Right Now?</p>

        <div className="space-y-3">
          {[
            'Happy 😊',
            'Confused 😔',
            'Broken 💔',
            'In Love ❤️',
            'Regret 😞',
            'Sad 😓',
          ].map((mood) => (
            <label key={mood} className="flex items-center gap-3">
              <input type="radio" checked={response.mood === mood} readOnly />
              {mood}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
