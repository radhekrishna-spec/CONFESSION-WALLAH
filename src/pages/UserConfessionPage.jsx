import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ConfessionForm from '../components/ConfessionForm';
import ConfessionHero from '../components/ConfessionHero';
import NicknameInput from '../components/NicknameInput';
import SubmitSection from '../components/SubmitSection';

export default function UserConfessionPage() {
  const { collegeId } = useParams();
  const activeCollegeId = collegeId || 'miet';

  const [college, setCollege] = useState(null);

  const [formData, setFormData] = useState({
    message: '',
    nickname: '',
    song: '',
  });

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/college/college-info?collegeId=${activeCollegeId}`,
    )
      .then((res) => res.json())
      .then((data) => setCollege(data))
      .catch(console.error);
  }, [activeCollegeId]);

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center">
          {college?.name || 'Campus Confessions'}
        </h1>

        {/* Hero */}
        <ConfessionHero />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-lg font-semibold">12k+</p>
            <p className="text-xs text-gray-400">Confessions</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-lg font-semibold">100%</p>
            <p className="text-xs text-gray-400">Anonymous</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-lg font-semibold">Fast</p>
            <p className="text-xs text-gray-400">Review</p>
          </div>
        </div>

        {/* Form */}
        <ConfessionForm
          confessionText={formData.message}
          setConfessionText={(value) =>
            setFormData((prev) => ({
              ...prev,
              message: value,
            }))
          }
          selectedSong={formData.song}
          setSelectedSong={(value) =>
            setFormData((prev) => ({
              ...prev,
              song: value,
            }))
          }
        />

        {/* Nickname */}
        <NicknameInput
          nickname={formData.nickname}
          setNickname={(value) =>
            setFormData((prev) => ({
              ...prev,
              nickname: value,
            }))
          }
        />

        {/* Submit */}
        <SubmitSection formData={formData} collegeId={activeCollegeId} />
      </div>
    </div>
  );
}
