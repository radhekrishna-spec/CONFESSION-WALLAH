import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '../config';

export default function ConfessionForm({
  confessionText,
  setConfessionText,
  selectedSong,
  setSelectedSong,
}) {
  const charCount = confessionText.length;

  const [songQuery, setSongQuery] = useState(
    selectedSong ? `${selectedSong.title} - ${selectedSong.artist}` : '',
  );

  const [songSuggestions, setSongSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const searchSongs = async (value) => {
    if (value.trim().length < 2) return;

    setIsSearching(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/song-search?q=${encodeURIComponent(
          value,
        )}`,
      );

      const data = await res.json();
      setSongSuggestions(data.data || []);
      setShowDropdown(true);
    } catch {
      setSongSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setSongQuery(value);
    setSelectedSong(null);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      searchSongs(value);
    }, 400);
  };

  const selectSong = (song) => {
    const selected = {
      title: song.title,
      artist: song.artist?.name || 'Unknown',
    };

    setSelectedSong(selected);
    setSongQuery(`${selected.title} - ${selected.artist}`);
    setShowDropdown(false);
  };

  const clearSong = () => {
    setSongQuery('');
    setSelectedSong(null);
    setSongSuggestions([]);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-white">
      {/* TEXT */}
      <label className="text-sm text-gray-400">Write your confession</label>

      <textarea
        rows={5}
        value={confessionText}
        onChange={(e) => setConfessionText(e.target.value)}
        className="mt-3 w-full rounded-2xl bg-white/5 border border-white/10 p-4 outline-none focus:border-white/30 resize-none"
        placeholder="Write anonymously..."
      />

      <p className="text-right text-xs text-gray-500 mt-2">{charCount}/6000</p>

      {/* SONG (OPTIONAL) */}
      <div className="hidden mt-6 relative" ref={dropdownRef}>
        <label className="text-sm text-gray-400 mb-2 block">
          Add Song (optional)
        </label>

        <input
          value={songQuery}
          onChange={handleChange}
          placeholder="Search song..."
          className="w-full rounded-2xl bg-white/5 border border-white/10 p-3 outline-none focus:border-white/30"
        />

        {/* LOADING */}
        {isSearching && (
          <div className="absolute w-full mt-2 p-3 rounded-2xl bg-black border border-white/10 text-sm text-gray-400">
            Searching...
          </div>
        )}

        {/* LIST */}
        {!isSearching && showDropdown && songSuggestions.length > 0 && (
          <div className="absolute w-full mt-2 max-h-60 overflow-y-auto rounded-2xl bg-black border border-white/10 z-50">
            {songSuggestions.map((song) => (
              <div
                key={song.id}
                onClick={() => selectSong(song)}
                className="p-3 cursor-pointer hover:bg-white/10"
              >
                <p className="text-sm">{song.title}</p>
                <p className="text-xs text-gray-400">{song.artist?.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* SELECTED */}
        {selectedSong && (
          <div className="mt-3 flex justify-between items-center text-sm text-gray-300">
            <span>🎵 {selectedSong.title}</span>

            <button onClick={clearSong} className="text-red-400">
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
