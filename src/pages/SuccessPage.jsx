import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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

  // 🔥 BUTTON CLICK HANDLER (MAIN LOGIC)
  const handleViewDetails = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setShowLoader(true);
    setShowDetails(false);
    setProgress(0);

    let attempts = 0;
    const maxAttempts = 60;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 2 : prev));
    }, 200);

    const poll = async () => {
      try {
        const saved = JSON.parse(sessionStorage.getItem('confessionDetails'));

        // console.log('🔁 polling...', saved);

        if (!saved || !saved.confessionNo) {
          attempts++;

          if (attempts >= maxAttempts) {
            clearInterval(intervalRef.current);
            setShowLoader(false);
            alert('Server slow hai, thoda wait karo');
            return;
          }

          setTimeout(poll, 1500);
          return;
        }

        // ✅ NUMBER READY
        clearInterval(intervalRef.current);
        setProgress(100);

        setTimeout(() => {
          setDetails(saved);
          setShowLoader(false);
          setShowDetails(true);
        }, 300);
      } catch (err) {
        console.error(err);
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

        {/* 🔥 BUTTONS (IMPORTANT) */}
        {!showLoader && !showDetails && (
          <div className="mt-6 space-y-3">
            <button
              onClick={handleViewDetails}
              disabled={showLoader}
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

        {/* 🔄 LOADER */}
        {showLoader && (
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-3">
              Generating your confession number...
            </p>

            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-white h-2 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-gray-400">{progress}%</p>
          </div>
        )}

        {/* ✅ RESULT */}
        {showDetails && details && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">Your Confession Number</p>

            <p className="text-4xl font-bold mt-2">#{details.confessionNo}</p>

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
