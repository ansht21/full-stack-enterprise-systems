import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const initialForm = { full_name: '', email: '', phone: '', department_id: '', designation: '' };

const departments = [
  { id: 1, name: 'Computer Science' },
  { id: 2, name: 'Information Technology' },
  { id: 3, name: 'Electronics' },
  { id: 4, name: 'Mechanical Engineering' },
];

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchFaculty = async () => {
    try {
      const { data } = await api.get('/faculty');
      setFaculty(data.data);
    } catch {
      toast.error('Failed to load faculty.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaculty(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/faculty/${editId}`, form);
        toast.success('Faculty updated.');
      } else {
        await api.post('/faculty', form);
        toast.success('Faculty added. Login: email / Faculty@123');
      }
      setIsModalOpen(false);
      setForm(initialForm);
      setEditId(null);
      fetchFaculty();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (f) => {
    setForm({ full_name: f.full_name, email: f.email, phone: f.phone || '', department_id: f.department_id || '', designation: f.designation || '' });
    setEditId(f.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this faculty member?')) return;
    try {
      await api.delete(`/faculty/${id}`);
      toast.success('Faculty deleted.');
      fetchFaculty();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Faculty</h2>
          <p className="text-gray-500 text-sm">Manage faculty members</p>
        </div>
        <button onClick={() => { setForm(initialForm); setEditId(null); setIsModalOpen(true); }}
          className="bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800">
          + Add Faculty
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Name</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Email</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Department</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Designation</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-10 text-center text-gray-400">Loading...</td></tr>
            ) : faculty.length === 0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-gray-400">No faculty found.</td></tr>
            ) : (
              faculty.map((f) => (
                <tr key={f.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{f.full_name}</td>
                  <td className="py-3 px-4 text-gray-600">{f.email}</td>
                  <td className="py-3 px-4 text-gray-600">{f.Department?.name || '-'}</td>
                  <td className="py-3 px-4">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">{f.designation || '-'}</span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => handleEdit(f)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? 'Edit Faculty' : 'Add Faculty'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700">Full Name *</label>
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Email *</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Designation</label>
              <input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-700">Department</label>
              <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-60">
              {submitting ? 'Saving...' : editId ? 'Update' : 'Add Faculty'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Faculty;
