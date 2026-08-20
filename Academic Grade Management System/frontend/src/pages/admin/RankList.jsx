import React, { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const RankList = () => {
  const [semester, setSemester] = useState(5);
  const [rankList, setRankList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRankList = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/results/rank-list/${semester}`);
      setRankList(data.data);
      if (data.data.length === 0) toast('No published results for this semester.', { icon: 'ℹ️' });
    } catch {
      toast.error('Failed to fetch rank list.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Rank List</h2>
        <p className="text-gray-500 text-sm">Merit list based on published results</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-end gap-4">
          <div>
            <label className="text-xs font-medium text-gray-700">Semester</label>
            <select value={semester} onChange={(e) => setSemester(e.target.value)}
              className="mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <button onClick={fetchRankList} disabled={loading}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-60">
            {loading ? 'Loading...' : 'View Rank List'}
          </button>
        </div>
      </div>

      {rankList.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-700">Semester {semester} Rank List</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-4 text-gray-600 font-medium">Rank</th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium">Student</th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium">Roll No.</th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium">Percentage</th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium">SGPA</th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rankList.map((r) => (
                <tr key={r.id} className={`border-b hover:bg-gray-50 ${r.rank <= 3 ? 'bg-yellow-50' : ''}`}>
                  <td className="py-3 px-4">
                    <span className={`font-bold text-lg ${r.rank === 1 ? 'text-yellow-500' : r.rank === 2 ? 'text-gray-400' : r.rank === 3 ? 'text-orange-400' : 'text-gray-700'}`}>
                      {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : `#${r.rank}`}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">{r.Student?.full_name}</td>
                  <td className="py-3 px-4 font-mono text-blue-700">{r.Student?.roll_number}</td>
                  <td className="py-3 px-4 font-semibold">{r.percentage}%</td>
                  <td className="py-3 px-4">{r.sgpa}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RankList;
