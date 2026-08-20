import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Marks = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [form, setForm] = useState({
    student_id: '', subject_id: '', semester: 5,
    internal_marks: '', practical_marks: '', theory_marks: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [loadingMarks, setLoadingMarks] = useState(false);

  useEffect(() => {
    api.get('/students').then(({ data }) => setStudents(data.data));
    api.get('/subjects').then(({ data }) => setSubjects(data.data));
  }, []);

  const fetchMarks = async () => {
    if (!form.student_id || !form.semester) return;
    setLoadingMarks(true);
    try {
      const { data } = await api.get('/marks', { params: { student_id: form.student_id, semester: form.semester } });
      setMarks(data.data);
    } catch {
      toast.error('Failed to load marks.');
    } finally {
      setLoadingMarks(false);
    }
  };

  useEffect(() => { fetchMarks(); }, [form.student_id, form.semester]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const internal = parseFloat(form.internal_marks || 0);
    const practical = parseFloat(form.practical_marks || 0);
    const theory = parseFloat(form.theory_marks || 0);

    if (internal > 20 || practical > 20 || theory > 60) {
      toast.error('Max: Internal=20, Practical=20, Theory=60');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/marks', {
        student_id: form.student_id,
        subject_id: form.subject_id,
        semester: form.semester,
        internal_marks: internal,
        practical_marks: practical,
        theory_marks: theory,
      });
      toast.success('Marks saved!');
      fetchMarks();
      setForm((f) => ({ ...f, subject_id: '', internal_marks: '', practical_marks: '', theory_marks: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save marks.');
    } finally {
      setSubmitting(false);
    }
  };

  const getGrade = (total) => {
    if (total >= 90) return 'O';
    if (total >= 80) return 'A+';
    if (total >= 70) return 'A';
    if (total >= 60) return 'B+';
    if (total >= 50) return 'B';
    if (total >= 40) return 'C';
    return 'F';
  };

  const filteredSubjects = subjects.filter((s) => s.semester == form.semester);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Marks Entry</h2>
        <p className="text-gray-500 text-sm">Enter internal, practical and theory marks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entry Form */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Enter Marks</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700">Student *</label>
              <select required value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Student</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.roll_number} - {s.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Semester *</label>
              <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Subject *</label>
              <select required value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Subject</option>
                {filteredSubjects.map((s) => <option key={s.id} value={s.id}>{s.subject_code} - {s.subject_name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Internal (max 20)</label>
                <input type="number" min="0" max="20" step="0.5" required value={form.internal_marks}
                  onChange={(e) => setForm({ ...form, internal_marks: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Practical (max 20)</label>
                <input type="number" min="0" max="20" step="0.5" required value={form.practical_marks}
                  onChange={(e) => setForm({ ...form, practical_marks: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Theory (max 60)</label>
                <input type="number" min="0" max="60" step="0.5" required value={form.theory_marks}
                  onChange={(e) => setForm({ ...form, theory_marks: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            {form.internal_marks && form.practical_marks && form.theory_marks && (
              <div className="bg-blue-50 rounded-lg p-3 text-sm">
                <p>Total: <strong>{parseFloat(form.internal_marks || 0) + parseFloat(form.practical_marks || 0) + parseFloat(form.theory_marks || 0)}</strong> / 100</p>
                <p>Grade: <strong className="text-blue-700">{getGrade(parseFloat(form.internal_marks || 0) + parseFloat(form.practical_marks || 0) + parseFloat(form.theory_marks || 0))}</strong></p>
              </div>
            )}
            <button type="submit" disabled={submitting}
              className="w-full bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-60">
              {submitting ? 'Saving...' : 'Save Marks'}
            </button>
          </form>
        </div>

        {/* Marks Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            Marks for Selected Student
            {form.student_id && <span className="text-sm text-gray-500 font-normal"> — Semester {form.semester}</span>}
          </h3>
          {loadingMarks ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : marks.length === 0 ? (
            <p className="text-gray-400 text-sm">No marks entered yet. Select a student to view.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Int</th>
                  <th className="pb-3">Prac</th>
                  <th className="pb-3">Theory</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Grade</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((m) => (
                  <tr key={m.id} className="border-b">
                    <td className="py-2 text-xs">{m.Subject?.subject_name}</td>
                    <td className="py-2">{m.internal_marks}</td>
                    <td className="py-2">{m.practical_marks}</td>
                    <td className="py-2">{m.theory_marks}</td>
                    <td className="py-2 font-semibold">{m.total_marks}</td>
                    <td className="py-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${m.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {m.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marks;
