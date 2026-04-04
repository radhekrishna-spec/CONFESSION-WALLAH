import { useNavigate, useParams } from 'react-router-dom';

export default function ConfessionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <button onClick={() => navigate(`/admin/confession/${+id - 1}`)}>
          ← Previous
        </button>

        <h1>Confession #{id}</h1>

        <button onClick={() => navigate(`/admin/confession/${+id + 1}`)}>
          Next →
        </button>
      </div>
    </div>
  );
}
