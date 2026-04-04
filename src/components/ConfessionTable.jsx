
export default function ConfessionTable({ confessions, onSelect }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-violet-100">
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Nickname</th>
            <th className="p-4 text-left">Preview</th>
            <th className="p-4 text-left">Mood</th>
            <th className="p-4 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {confessions.map((item) => (
            <tr
              key={item.id}
              onClick={() => onSelect(item)}
              className="border-b hover:bg-violet-50 cursor-pointer transition"
            >
              <td className="p-4">{item.id}</td>
              <td className="p-4">{item.nickname}</td>
              <td className="p-4 truncate max-w-xs">{item.text}</td>
              <td className="p-4">{item.mood}</td>
              <td className="p-4">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
