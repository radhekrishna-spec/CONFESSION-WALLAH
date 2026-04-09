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

    if (value.trim().length < 2) {
      setSongSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://white-pony-main-db1c939.d2.zuplo.dev/search-song?q=${encodeURIComponent(value.trim())}`,
      );

      const data = await res.json();

      console.log('SEARCH VALUE:', value);
      console.log('API RESPONSE:', data);
      console.log('SONGS:', data?.data);

      const songs = data?.data || [];

      setSongSuggestions(songs.slice(0, 5));
    } catch (error) {
      console.error('Song search error', error);
      setSongSuggestions([]);
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
          value={songQuery || selectedSong}
          onChange={(e) => {
            const value = e.target.value;
            setSongQuery(value);
            setSelectedSong('');

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

        {songQuery.trim().length >= 2 && songSuggestions.length === 0 && (
          <div className="mt-2 rounded border bg-white p-2 text-sm text-gray-500 shadow">
            No song found 🎵
          </div>
        )}
      </div>
    </div>
  );
}
