import { useEffect, useState } from 'react';
import ConfessionForm from '../components/ConfessionForm';
import ConfessionHero from '../components/ConfessionHero';
import MoodSelector from '../components/MoodSelector';
import NicknameInput from '../components/NicknameInput';
import SubmitSection from '../components/SubmitSection';

export default function UserConfessionPage() {
  const { collegeId } = useParams();
  const [college, setCollege] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [confessionText, setConfessionText] = useState('');

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/college/college-info?collegeId=${collegeId || 'miet'}`,
    )
      .then((res) => res.json())
      .then((data) => setCollege(data))
      .catch((err) => console.log(err));
  }, [collegeId]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 py-8 px-4 overflow-hidden">
      {/* floating background blobs */}
      <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-violet-300/20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 h-52 w-52 rounded-full bg-pink-300/20 blur-3xl animate-pulse"></div>

      <div className="relative max-w-2xl mx-auto space-y-6 animate-fadeIn">
        <h1 className="text-2xl font-bold text-center text-violet-700">
          {college?.name || 'Campus Confessions'}
        </h1>
        <ConfessionHero title={college?.name || 'Campus Confessions'} />

        <div className="grid grid-cols-3 gap-4">
          <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg p-4 text-center">
            <p className="text-xl font-bold text-violet-700">12k+</p>
            <p className="text-sm text-gray-500">Confessions</p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg p-4 text-center">
            <p className="text-xl font-bold text-violet-700">100%</p>
            <p className="text-sm text-gray-500">Anonymous</p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg p-4 text-center">
            <p className="text-xl font-bold text-violet-700">Fast</p>
            <p className="text-sm text-gray-500">Review</p>
          </div>
        </div>

        <ConfessionForm
          charCount={charCount}
          setCharCount={setCharCount}
          confessionText={confessionText}
          setConfessionText={setConfessionText}
        />

        <NicknameInput />

        <MoodSelector />
        <SubmitSection
          confessionText={confessionText}
          collegeId={collegeId || 'miet'}
        />
      </div>
    </div>
  );
}
