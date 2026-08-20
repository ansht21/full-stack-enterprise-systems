import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const MyResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get student record by user email
        const { data: allStudents } = await api.get('/students', { params: { search: user.email } });
        const myStudent = allStudents.data[0];
        if (myStudent) {
          setStudent(myStudent);
          const { data } = await api.get('/results', { params: { student_id: myStudent.id } });
          setResults(data.data.filter((r) => r.is_published));
        }
      } catch {
        toast.error('Failed to load results.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading your results...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">My Results</h2>
      {student && (
        <p className="text-gray-500 text-sm mb-6">
          {student.roll_number} · {student.Department?.name} · Semester {student.semester}
        </p>
      )}

      {results.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
          No published results yet. Check back after your exams.
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-lg">Semester {r.semester}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${r.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {r.status?.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">{r.percentage}%</p>
                  <p className="text-xs text-gray-500 mt-1">Percentage</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-700">{r.sgpa}</p>
                  <p className="text-xs text-gray-500 mt-1">SGPA</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{r.obtained_marks}</p>
                  <p className="text-xs text-gray-500 mt-1">Marks Obtained</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-700">{r.total_marks}</p>
                  <p className="text-xs text-gray-500 mt-1">Total Marks</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResults;
