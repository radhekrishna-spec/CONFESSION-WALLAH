import { useMemo, useState } from 'react';
import ConfessionTable from '../components/ConfessionTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import QuickPreview from '../components/QuickPreview';

export default function AdminDashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedConfession, setSelectedConfession] = useState(null);

  const confessions = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        nickname: `User ${i + 1}`,
        text: `Premium confession text number ${i + 1}`,
        mood: i % 2 === 0 ? 'Happy 😊' : 'Broken 💔',
        date: '04-04-2026',
      })),
    [],
  );

  const filteredData = confessions.filter(
    (item) =>
      item.nickname.toLowerCase().includes(search.toLowerCase()) ||
      item.text.toLowerCase().includes(search.toLowerCase()) ||
      String(item.id).includes(search),
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          ['Total', confessions.length],
          ['Today', 18],
          ['Pending', 4],
          ['Starred', 12],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <h2 className="text-2xl font-bold text-violet-700">{value}</h2>
          </div>
        ))}
      </div>

      <SearchBar
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <ConfessionTable
            confessions={paginatedData}
            onSelect={setSelectedConfession}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <QuickPreview confession={selectedConfession} />
      </div>
    </div>
  );
}
