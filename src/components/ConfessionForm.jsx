import { useState } from 'react';

export default function ConfessionForm({
  confessionText,
  setConfessionText,
  selectedSong,
  setSelectedSong,
}) {
  const charCount = confessionText.length;
  const [songQuery, setSongQuery] = useState('');
  const [songSuggestions, setSongSuggestions] = useState([]);

  const handleSongSearch = async (value) => {
    setSongQuery(value);

    if (value.toLowerCase() === 'kesariya') {
      setSongSuggestions([
        {
          id: 1,
          title: 'Kesariya',
          artist: { name: 'Arijit Singh' },
        },
      ]);
      return;
    }

    // if (value.trim().length < 3) {
    //   setSongSuggestions([]);
    //   return;
    // }
    try {
      const res = await fetch(
        `https://white-pony-main-db1c939.d2.zuplo.dev/search-song?q=${encodeURIComponent(value.trim())}`,
      );

      const data = await res.json();

      let songs = data?.data || [];

      // fallback if empty
      if (!songs.length && value.toLowerCase().includes('kes')) {
        songs = [
          {
            id: 1,
            title: 'Kesariya',
            artist: { name: 'Arijit Singh' },
          },
        ];
      }

      setSongSuggestions(songs.slice(0, 5));
    } catch (error) {
      console.error('Song search error', error);
    }
  };

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

      <div className="mt-4">
        <label className="block mb-2">Add a Song (optional)</label>

        <input
          type="text"
          placeholder="Search song..."
          value={songQuery}
          onChange={(e) => {
            const value = e.target.value;
            setSongQuery(value);

            clearTimeout(window.songTimeout);

            window.songTimeout = setTimeout(() => {
              handleSongSearch(value);
            }, 400);
          }}
          className="w-full border rounded p-2"
        />

        {songSuggestions.length > 0 && (
          <div className="border rounded mt-2 max-h-48 overflow-y-auto bg-white shadow-lg relative z-50">
            {songSuggestions.slice(0, 5).map((song) => (
              <div
                key={song.id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  const selected = `${song.title} - ${song.artist.name}`;
                  setSelectedSong(selected);
                  setSongQuery(selected);
                  setSongSuggestions([]);
                }}
              >
                {song.title} - {song.artist.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
