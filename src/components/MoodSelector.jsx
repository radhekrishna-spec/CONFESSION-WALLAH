import { useState } from 'react';

export default function MoodSelector() {
  const moods = [
    'Happy 😊',
    'Confused 😔',
    'Broken 💔',
    'In Love ❤️',
    'Regret 😞',
    'Sad 😓',
  ];

  const [selectedMood, setSelectedMood] = useState('');

  return (
    <div className="rounded-3xl bg-white shadow-lg p-6">
      <p className="font-semibold text-gray-700 mb-4">Your Mood Right Now?</p>

      <div className="grid grid-cols-2 gap-3">
        {moods.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => setSelectedMood(mood)}
            className={`rounded-2xl p-4 border transition ${
              selectedMood === mood
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-violet-50'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      <input type="hidden" id="selectedMood" value={selectedMood} />
    </div>
  );
}
