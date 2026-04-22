import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE } from '../config';

export default function ConfessionDetailPage() {
  const { id, collegeId } = useParams();
  const navigate = useNavigate();

  const [confession, setConfession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConfession = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/confession/${id}?collegeId=${collegeId}`,
      );

      const data = await res.json();
      setConfession(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfession();
  }, [id]);

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  if (!confession) {
    return <div className="text-white p-6">Not found ❌</div>;
  }

  return (
    <div className="text-white p-6 max-w-4xl mx-auto">
      {/* Top Nav */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(`/admin/confession/${+id - 1}`)}
          className="px-4 py-2 rounded-2xl border border-white/20 hover:bg-white/10"
        >
          ← Previous
        </button>

        <h1 className="text-2xl font-bold">Confession #{id}</h1>

        <button
          onClick={() => navigate(`/admin/confession/${+id + 1}`)}
          className="px-4 py-2 rounded-2xl border border-white/20 hover:bg-white/10"
        >
          Next →
        </button>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-6">
        {/* Message */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Message</p>
          <p className="text-gray-200 leading-7 whitespace-pre-wrap">
            {confession.message}
          </p>
        </div>

        {/* Meta */}
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <p>👤 Nickname</p>
            <p className="text-white mt-1">
              {confession.nickname || 'Anonymous'}
            </p>
          </div>

          <div>
            <p>🕒 Created</p>
            <p className="text-white mt-1">
              {new Date(confession.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p>💳 Paid</p>
            <p className="text-white mt-1">
              {confession.isPaid ? 'Yes' : 'No'}
            </p>
          </div>

          <div>
            <p>📌 Type</p>
            <p className="text-white mt-1">{confession.type}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button className="px-4 py-2 rounded-2xl border border-red-400 text-red-400 hover:bg-red-500/10">
            Delete
          </button>

          <button className="px-4 py-2 rounded-2xl border border-green-400 text-green-400 hover:bg-green-500/10">
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
