import { useRef, useState } from 'react';

export default function ConfessionForm({
  confessionText,
  setConfessionText,
  selectedSong,
  setSelectedSong,
}) {
  const charCount = confessionText.length;

  const [songQuery, setSongQuery] = useState(selectedSong || '');
  const [songSuggestions, setSongSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const timeoutRef = useRef(null);

  const handleSongSearch = async (value) => {
    const query = value.trim();

    if (query.length < 2) {
      setSongSuggestions([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);

      const res = await fetch(
        `https://white-pony-main-db1c939.d2.zuplo.dev/search-song?q=${encodeURIComponent(query)}`,
      );

      const data = await res.json();

      const songs = data?.data || [];

      setSongSuggestions(songs.slice(0, 5));
      setShowDropdown(true);
    } catch (error) {
      console.error('Song search error:', error);
      setSongSuggestions([]);
      setShowDropdown(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    setSongQuery(value);
    setSelectedSong('');

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleSongSearch(value);
    }, 400);
  };

  const handleSongSelect = (song) => {
    const selected = `${song.title} - ${song.artist.name}`;

    setSelectedSong(selected);
    setSongQuery(selected);
    setSongSuggestions([]);
    setShowDropdown(false);
  };

  const clearSong = () => {
    setSongQuery('');
    setSelectedSong('');
    setSongSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="rounded-3xl bg-white shadow-lg p-6">
      <label className="font-semibold text-gray-700">
        Is there something you always wanted to tell someone ? *
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

      <div className="mt-4 relative">
        <label className="block mb-2 font-medium text-gray-700">
          Add a Song (optional)
        </label>

        <div className="relative">
          <input
            type="text"
            placeholder="Search song..."
            value={songQuery}
            onChange={handleInputChange}
            className="w-full border rounded-xl p-3 pr-10 outline-none focus:ring-2 focus:ring-violet-400"
          />

          {songQuery && (
            <button
              type="button"
              onClick={clearSong}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          )}
        </div>

        {isSearching && (
          <div className="mt-2 rounded-xl border bg-white p-3 text-sm text-violet-600 shadow">
            Searching songs... 🎵
          </div>
        )}

        {!isSearching && showDropdown && songSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 max-h-56 overflow-y-auto rounded-xl border bg-white shadow-xl z-50">
            {songSuggestions.map((song) => (
              <div
                key={song.id}
                className="p-3 cursor-pointer hover:bg-violet-50 border-b last:border-b-0"
                onClick={() => handleSongSelect(song)}
              >
                <p className="font-medium text-gray-800">{song.title}</p>
                <p className="text-sm text-gray-500">{song.artist.name}</p>
              </div>
            ))}
          </div>
        )}

        {!isSearching &&
          showDropdown &&
          songQuery.trim().length >= 2 &&
          songSuggestions.length === 0 && (
            <div className="mt-2 rounded-xl border bg-white p-3 text-sm text-gray-500 shadow">
              No song found 🎵
            </div>
          )}

        {selectedSong && (
          <div className="mt-3 rounded-xl bg-violet-50 border border-violet-200 p-3 text-sm text-violet-700">
            Selected Song: <span className="font-semibold">{selectedSong}</span>
          </div>
        )}
      </div>
    </div>
  );
}
