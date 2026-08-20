import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const initialForm = { subject_code: '', subject_name: '', credits: 3, semester: 1, department_id: '', faculty_id: '' };

const departments = [
  { id: 1, name: 'Computer Science' },
  { id: 2, name: 'Information Technology' },
  { id: 3, name: 'Electronics' },
  { id: 4, name: 'Mechanical Engineering' },
];

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [subRes, facRes] = await Promise.all([api.get('/subjects'), api.get('/faculty')]);
      setSubjects(subRes.data.data);
      setFaculty(facRes.data.data);
    } catch {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/subjects/${editId}`, form);
        toast.success('Subject updated.');
      } else {
        await api.post('/subjects', form);
        toast.success('Subject added.');
      }
      setIsModalOpen(false);
      setForm(initialForm);
      setEditId(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (s) => {
    setForm({ subject_code: s.subject_code, subject_name: s.subject_name, credits: s.credits, semester: s.semester, department_id: s.department_id || '', faculty_id: s.faculty_id || '' });
    setEditId(s.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await api.delete(`/subjects/${id}`);
      toast.success('Subject deleted.');
      fetchData();
    } catch { toast.error('Failed to delete.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Subjects</h2>
          <p className="text-gray-500 text-sm">Manage subjects and assign faculty</p>
        </div>
        <button onClick={() => { setForm(initialForm); setEditId(null); setIsModalOpen(true); }}
          className="bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800">
          + Add Subject
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Code</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Subject Name</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Credits</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Semester</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Faculty</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-10 text-center text-gray-400">Loading...</td></tr>
            ) : subjects.length === 0 ? (
              <tr><td colSpan={6} className="py-10 text-center text-gray-400">No subjects found.</td></tr>
            ) : (
              subjects.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-blue-700">{s.subject_code}</td>
                  <td className="py-3 px-4 font-medium">{s.subject_name}</td>
                  <td className="py-3 px-4"><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">{s.credits} cr</span></td>
                  <td className="py-3 px-4"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">Sem {s.semester}</span></td>
                  <td className="py-3 px-4 text-gray-600">{s.assignedFaculty?.full_name || '-'}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700">Subject Code *</label>
              <input required value={form.subject_code} onChange={(e) => setForm({ ...form, subject_code: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Subject Name *</label>
              <input required value={form.subject_name} onChange={(e) => setForm({ ...form, subject_name: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Credits</label>
              <input type="number" min="1" max="6" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Semester *</label>
              <select required value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Department</label>
              <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Assign Faculty</label>
              <select value={form.faculty_id} onChange={(e) => setForm({ ...form, faculty_id: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Faculty</option>
                {faculty.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-60">
              {submitting ? 'Saving...' : editId ? 'Update' : 'Add Subject'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Subjects;
