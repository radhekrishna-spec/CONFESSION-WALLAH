import { useEffect, useRef, useState } from 'react';

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
  const dropdownRef = useRef(null);

  // OUTSIDE CLICK CLOSE
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSongSearch = async (value) => {
    setSongQuery(value);

    if (value.trim().length < 2) {
      setSongSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(
        `https://testing-confe-backend.onrender.com/api/song-search?q=${encodeURIComponent(
          value.trim(),
        )}`,
      );

      const data = await res.json();

      console.log('SONG API RESPONSE:', data);

      const songs = data.data || [];

      setSongSuggestions(songs);
      setShowDropdown(true);
    } catch (error) {
      console.error('Song search error', error);
      setSongSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    setSongQuery(value);
    setSelectedSong('');
    setShowDropdown(true);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleSongSearch(value);
    }, 400);
  };

  const handleSongSelect = (song) => {
    const selected = `${song.title} - ${song.artist?.name || 'Unknown Artist'}`;

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
    <div className="rounded-3xl bg-white shadow-xl p-6 border border-gray-100">
      <label className="font-semibold text-gray-700">
        Is there something you always wanted to tell someone? *
      </label>

      <textarea
        rows={6}
        maxLength={6000}
        value={confessionText}
        onChange={(e) => setConfessionText(e.target.value)}
        className="mt-4 w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-violet-400 resize-none"
        placeholder="Write your confession here..."
      />

      <p className="text-right text-sm text-gray-500 mt-2">{charCount}/6000</p>

      <div className="mt-6 relative" ref={dropdownRef}>
        <label className="block mb-2 font-medium text-gray-700">
          Add a Song (optional)
        </label>

        <div className="relative">
          <input
            type="text"
            placeholder="Search song..."
            value={songQuery}
            onChange={handleInputChange}
            onFocus={() => songSuggestions.length > 0 && setShowDropdown(true)}
            className="w-full border rounded-2xl p-3 pr-10 outline-none focus:ring-2 focus:ring-violet-400 shadow-sm"
          />

          {songQuery && (
            <button
              type="button"
              onClick={clearSong}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* LOADING */}
        {isSearching && (
          <div className="absolute left-0 right-0 mt-2 rounded-2xl border bg-white p-3 shadow-lg z-50">
            <div className="flex items-center gap-2 text-violet-600 text-sm">
              <div className="h-4 w-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              Searching songs...
            </div>
          </div>
        )}

        {/* SUGGESTIONS */}
        {!isSearching && showDropdown && songSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 max-h-72 overflow-y-auto rounded-2xl border bg-white shadow-2xl z-50">
            {songSuggestions.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-violet-50 transition border-b last:border-b-0"
                onClick={() => handleSongSelect(song)}
              >
                <img
                  src={song.album?.cover || 'https://via.placeholder.com/50'}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-800">{song.title}</p>
                  <p className="text-sm text-gray-500">{song.artist?.name}</p>
                </div>

                <button
                  type="button"
                  className="text-xs bg-violet-100 text-violet-600 px-3 py-1 rounded-full"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}

        {/* NO RESULT */}
        {!isSearching &&
          showDropdown &&
          songQuery.trim().length >= 2 &&
          songSuggestions.length === 0 && (
            <div className="absolute left-0 right-0 mt-2 rounded-2xl border bg-white p-3 text-sm text-gray-500 shadow-lg z-50">
              No song found 🎵
            </div>
          )}

        {/* SELECTED */}
        {selectedSong && (
          <div className="mt-4 rounded-2xl bg-violet-50 border border-violet-200 px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-xs text-violet-500">Selected Song</p>
              <p className="font-semibold text-violet-700">{selectedSong}</p>
            </div>

            <button
              type="button"
              onClick={clearSong}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
