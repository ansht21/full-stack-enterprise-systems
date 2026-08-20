import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Marksheet = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [semester, setSemester] = useState(5);
  const [marksheet, setMarksheet] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/students', { params: { search: user.email } }).then(({ data }) => {
      setStudent(data.data[0] || null);
    });
  }, [user]);

  const fetchMarksheet = async () => {
    if (!student) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/results/marksheet/${student.id}/${semester}`);
      setMarksheet(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Marksheet not found.');
      setMarksheet(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Marksheet</h2>
        <p className="text-gray-500 text-sm">View and print your detailed marksheet</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-end gap-4">
          <div>
            <label className="text-xs font-medium text-gray-700">Select Semester</label>
            <select value={semester} onChange={(e) => setSemester(e.target.value)}
              className="mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <button onClick={fetchMarksheet} disabled={loading}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-60">
            {loading ? 'Loading...' : 'View Marksheet'}
          </button>
        </div>
      </div>

      {marksheet && (
        <div className="bg-white rounded-xl shadow p-8 print:shadow-none" id="marksheet">
          {/* Header */}
          <div className="text-center border-b pb-6 mb-6">
            <h1 className="text-2xl font-bold text-blue-800">ABC College of Technology</h1>
            <p className="text-gray-500 text-sm">Affiliated to XYZ University</p>
            <h2 className="text-lg font-semibold mt-3 text-gray-700">Semester Grade Report</h2>
            <p className="text-sm text-gray-500">Semester {semester}</p>
          </div>

          {/* Student Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p><span className="font-medium">Student Name:</span> {marksheet.student?.full_name}</p>
              <p><span className="font-medium">Roll Number:</span> {marksheet.student?.roll_number}</p>
              <p><span className="font-medium">Department:</span> {marksheet.student?.Department?.name}</p>
            </div>
            <div>
              <p><span className="font-medium">Email:</span> {marksheet.student?.email}</p>
              <p><span className="font-medium">Batch Year:</span> {marksheet.student?.batch_year}</p>
            </div>
          </div>

          {/* Marks Table */}
          <table className="w-full text-sm border border-gray-200 mb-6">
            <thead className="bg-blue-50">
              <tr>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">Subject Code</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">Subject Name</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">Credits</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">Internal</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">Practical</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">Theory</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">Total</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">Grade</th>
              </tr>
            </thead>
            <tbody>
              {marksheet.marks?.map((m) => (
                <tr key={m.id} className="border-b">
                  <td className="py-3 px-4 font-mono">{m.Subject?.subject_code}</td>
                  <td className="py-3 px-4">{m.Subject?.subject_name}</td>
                  <td className="py-3 px-4">{m.Subject?.credits}</td>
                  <td className="py-3 px-4">{m.internal_marks}</td>
                  <td className="py-3 px-4">{m.practical_marks}</td>
                  <td className="py-3 px-4">{m.theory_marks}</td>
                  <td className="py-3 px-4 font-semibold">{m.total_marks}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${m.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {m.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Result Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-xl font-bold text-blue-700">{marksheet.result?.percentage}%</p>
              <p className="text-xs text-gray-500">Percentage</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-xl font-bold text-purple-700">{marksheet.result?.sgpa}</p>
              <p className="text-xs text-gray-500">SGPA</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xl font-bold text-green-700">{marksheet.result?.obtained_marks}</p>
              <p className="text-xs text-gray-500">Marks Obtained</p>
            </div>
            <div className="text-center p-3 rounded-lg border-2 border-dashed">
              <p className={`text-xl font-bold ${marksheet.result?.status === 'pass' ? 'text-green-700' : 'text-red-700'}`}>
                {marksheet.result?.status?.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500">Result</p>
            </div>
          </div>

          <div className="flex justify-end print:hidden">
            <button onClick={handlePrint}
              className="bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800">
              🖨️ Print Marksheet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marksheet;
