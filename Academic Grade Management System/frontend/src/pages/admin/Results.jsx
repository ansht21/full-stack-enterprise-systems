import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Results = () => {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/students').then(({ data }) => setStudents(data.data));
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/results');
      setResults(data.data);
    } catch {
      toast.error('Failed to load results.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedStudent || !selectedSemester) {
      toast.error('Select a student and semester.');
      return;
    }
    setGenerating(true);
    try {
      await api.post('/results/generate', { student_id: selectedStudent, semester: selectedSemester });
      toast.success('Result generated!');
      fetchResults();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate result.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async (student_id, semester) => {
    try {
      await api.post('/results/publish', { student_id, semester });
      toast.success('Result published!');
      fetchResults();
    } catch {
      toast.error('Failed to publish.');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Results</h2>
        <p className="text-gray-500 text-sm">Generate and publish semester results</p>
      </div>

      {/* Generate Panel */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">Generate Result</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs font-medium text-gray-700">Student</label>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}
              className="mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]">
              <option value="">Select Student</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.roll_number} - {s.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Semester</label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}
              className="mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <button onClick={handleGenerate} disabled={generating}
            className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
            {generating ? 'Generating...' : '⚡ Generate Result'}
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Student</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Roll No.</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Semester</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Percentage</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">SGPA</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Status</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Published</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="py-10 text-center text-gray-400">Loading...</td></tr>
            ) : results.length === 0 ? (
              <tr><td colSpan={8} className="py-10 text-center text-gray-400">No results generated yet.</td></tr>
            ) : (
              results.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{r.Student?.full_name}</td>
                  <td className="py-3 px-4 font-mono text-blue-700">{r.Student?.roll_number}</td>
                  <td className="py-3 px-4">Sem {r.semester}</td>
                  <td className="py-3 px-4 font-semibold">{r.percentage}%</td>
                  <td className="py-3 px-4">{r.sgpa}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.status === 'pass' ? 'bg-green-100 text-green-700' : r.status === 'fail' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {r.is_published
                      ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">Published</span>
                      : <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">Draft</span>}
                  </td>
                  <td className="py-3 px-4">
                    {!r.is_published && (
                      <button onClick={() => handlePublish(r.student_id, r.semester)}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        Publish
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
