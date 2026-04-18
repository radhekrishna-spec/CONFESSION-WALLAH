import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function getEstimatedDate(queueAhead) {
  let dailyPosts = 3;

  if (queueAhead <= 3) dailyPosts = 3;
  else if (queueAhead <= 6) dailyPosts = 6;
  else if (queueAhead <= 10) dailyPosts = 8;
  else dailyPosts = 14;

  const now = new Date();
  const hour = now.getHours();

  let extraDay = 0;

  // agar aaj ke slots almost nikal gaye
  if (hour >= 18) {
    extraDay = 1;
  }

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
    if (!details && !showLoader) {
      // stay on success page
    }
  }, [details, showLoader]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleViewDetails = () => {
    setShowLoader(true);
    setShowDetails(false);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        let next = prev < 95 ? prev + 5 : prev;

        try {
          const saved = JSON.parse(sessionStorage.getItem('confessionDetails'));

          if (
            saved &&
            saved.confessionNo &&
            saved.queueAhead !== undefined &&
            saved.eta
          ) {
            clearInterval(intervalRef.current);

            setTimeout(() => {
              setProgress(100);
              setDetails(saved);

              setTimeout(() => {
                setShowLoader(false);
                setShowDetails(true);
              }, 300);
            }, 200);

            return 100;
          }
        } catch {}

        return next;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-white to-purple-100 px-4 py-10">
      <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl text-center max-w-md w-full border border-violet-100 overflow-hidden">
        {/* glow */}
        <div className="absolute -top-10 -left-10 h-36 w-36 rounded-full bg-violet-300 opacity-20 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-purple-300 opacity-20 blur-3xl" />

        {/* header */}
        <div className="relative z-10">
          <div className="text-6xl mb-3 animate-bounce">💌</div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Submitted Successfully
          </h1>

          <p className="mt-4 text-gray-700 leading-7">
            Your confession has been safely submitted and added to our secure
            processing queue.
          </p>

          <p className="mt-3 text-sm text-gray-500 leading-6">
            🔒 Your identity remains completely anonymous and protected.
          </p>
        </div>

        {/* instruction box */}
        {!showLoader && !showDetails && (
          <div className="mt-6">
            <div className="rounded-2xl bg-violet-50 border border-violet-100 p-4 text-sm text-gray-600 leading-6">
              📋 If you want to check your confession number, queue ahead and
              expected post time, click the button below.
            </div>

            <button
              onClick={handleViewDetails}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              View Submission Details
            </button>

            <button
              onClick={() => navigate('/')}
              className="mt-3 w-full rounded-2xl border border-violet-600 py-3 text-violet-600 font-semibold hover:bg-violet-50 transition"
            >
              Submit Another Confession
            </button>
          </div>
        )}

        {/* smart loader */}
        {showLoader && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">
              ✨ Processing your submission details...
            </p>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-violet-600 to-purple-600 h-3 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-3 text-sm font-medium text-violet-600">
              {progress}% completed
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Please wait while we fetch your latest submission info.
            </p>
          </div>
        )}

        {/* details */}
        {showDetails && details && (
          <div className="mt-6 border-t border-violet-100 pt-6 text-left">
            <h2 className="text-lg font-semibold text-violet-700 mb-4 text-center">
              📋 Submission Details
            </h2>

            <div className="space-y-4">
              <div className="rounded-2xl bg-violet-50 p-4 border border-violet-100">
                <p className="text-sm text-gray-500">Confession Number</p>
                <p className="text-lg font-semibold text-violet-700">
                  #{details.confessionNo}
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4 border border-purple-100">
                <p className="text-sm text-gray-500">Queue Ahead</p>
                <p className="text-lg font-semibold text-purple-700">
                  {details.queueAhead} confessions
                </p>
              </div>

              <div className="rounded-2xl bg-indigo-50 p-4 border border-indigo-100">
                <p className="text-sm text-gray-500">Estimated Posting Date</p>
                <p className="text-lg font-semibold text-indigo-700">
                  Likely by {getEstimatedDate(details.queueAhead)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on current queue volume and posting schedule
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Submit Another Confession
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
