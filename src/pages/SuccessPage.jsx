import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-violet-600">
          💌 Submitted Successfully
        </h1>

        <p className="mt-4 text-lg font-medium">
          Your Confession No: #{state.confessionNo}
        </p>

        <p className="mt-2 text-gray-700">
          {state.queueAhead} confession
          {state.queueAhead !== 1 ? 's' : ''} before you
        </p>

        <p className="mt-2 text-gray-700">Expected post time: {state.eta}</p>

        <p className="mt-4 text-sm text-gray-500">
          We’ll try to post it as per the current queue.
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full rounded-2xl bg-violet-600 py-3 text-white font-semibold hover:scale-[1.02] transition"
        >
          Submit Another Confession
        </button>
      </div>
    </div>
  );
}
