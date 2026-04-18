import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function getEstimatedDate(queueAhead) {
  let dailyPosts = 3;

  if (queueAhead <= 3) dailyPosts = 3;
  else if (queueAhead <= 6) dailyPosts = 6;
  else if (queueAhead <= 10) dailyPosts = 8;
  else dailyPosts = 14;

  const now = new Date();
  const hour = now.getHours();

  let extraDay = hour >= 18 ? 1 : 0;

  const daysNeeded = Math.ceil(queueAhead / dailyPosts) - 1 + extraDay;

  const estimated = new Date();
  estimated.setDate(now.getDate() + daysNeeded);

  return estimated.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { collegeId } = useParams();

  const intervalRef = useRef(null);

  const initialDetails = useMemo(() => {
    try {
      return (
        location.state ||
        JSON.parse(sessionStorage.getItem('confessionDetails')) ||
        null
      );
    } catch {
      return null;
    }
  }, [location.state]);

  const [details, setDetails] = useState(initialDetails);
  const [showLoader, setShowLoader] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleViewDetails = async () => {
    setShowLoader(true);
    setShowDetails(false);
    setProgress(0);

    const saved = JSON.parse(sessionStorage.getItem('confessionDetails'));

    if (!saved?.confessionNo) return;

    let attempts = 0;
    const maxAttempts = 10;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 3 : prev));
    }, 200);

    const poll = async () => {
      try {
        const res = await fetch(
          `https://testing-confe-backend.onrender.com/api/confessions/by-id?collegeId=${collegeId}&confessionNo=${saved.confessionNo}`,
        );

        const data = await res.json();

        console.log('📡 POLL DATA:', data);

        // 🔥 CHECK: jab tak DB me na aaye
        if (data?.confessionNo === saved.confessionNo) {
          clearInterval(intervalRef.current);

          setProgress(100);

          setTimeout(() => {
            setDetails(data);
            setShowLoader(false);
            setShowDetails(true);
          }, 300);

          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 800);
        } else {
          throw new Error('Timeout waiting for confession');
        }
      } catch (err) {
        clearInterval(intervalRef.current);
        setShowLoader(false);
        console.error(err);
        alert('Thoda wait karo, server slow hai');
      }
    };

    poll();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
        {/* Header */}
        <div>
          <div className="text-5xl mb-3">💌</div>

          <h1 className="text-2xl font-bold">Submitted Successfully</h1>

          <p className="mt-3 text-gray-400 text-sm">
            Your confession is now in queue.
          </p>

          <p className="mt-2 text-xs text-gray-500">
            🔒 Fully anonymous & secure
          </p>
        </div>

        {/* Initial Buttons */}
        {!showLoader && !showDetails && (
          <div className="mt-6 space-y-3">
            <button
              onClick={handleViewDetails}
              className="w-full rounded-2xl bg-white text-black py-3 font-semibold hover:scale-[1.02] transition"
            >
              View Details
            </button>

            <button
              onClick={() => navigate(`/${collegeId}`)}
              className="w-full rounded-2xl border border-white/20 py-3 text-white hover:bg-white/10 transition"
            >
              Submit Another
            </button>
          </div>
        )}

        {/* Loader */}
        {showLoader && (
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-3">Processing...</p>

            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-white h-2 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-gray-400">{progress}%</p>
          </div>
        )}

        {/* Details */}
        {showDetails && details && (
          <div className="mt-6 space-y-4 text-left">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-gray-500">Confession No</p>
              <p className="text-lg font-semibold">#{details.confessionNo}</p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-gray-500">Queue Ahead</p>
              <p className="text-lg font-semibold">{details.queueAhead}</p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-gray-500">Estimated Date</p>
              <p className="text-lg font-semibold">
                {getEstimatedDate(details.queueAhead)}
              </p>
            </div>

            <button
              onClick={() => navigate(`/${collegeId}`)}
              className="w-full mt-4 rounded-2xl bg-white text-black py-3 font-semibold"
            >
              Submit Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
