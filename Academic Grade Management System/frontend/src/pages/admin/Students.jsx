import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const initialForm = {
  roll_number: '', full_name: '', email: '', phone: '',
  department_id: '', semester: 1, batch_year: 2022, dob: '', address: '',
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students', { params: { search } });
      setStudents(data.data);
    } catch {
      toast.error('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    api.get('/dashboard/admin').catch(() => {});
    // Load departments from subjects endpoint or use static
    setDepartments([
      { id: 1, name: 'Computer Science' },
      { id: 2, name: 'Information Technology' },
      { id: 3, name: 'Electronics' },
      { id: 4, name: 'Mechanical Engineering' },
    ]);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/students/${editId}`, form);
        toast.success('Student updated.');
      } else {
        await api.post('/students', form);
        toast.success('Student added. Login: email / Student@123');
      }
      setIsModalOpen(false);
      setForm(initialForm);
      setEditId(null);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setForm({
      roll_number: student.roll_number,
      full_name: student.full_name,
      email: student.email,
      phone: student.phone || '',
      department_id: student.department_id || '',
      semester: student.semester,
      batch_year: student.batch_year,
      dob: student.dob || '',
      address: student.address || '',
    });
    setEditId(student.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted.');
      fetchStudents();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Students</h2>
          <p className="text-gray-500 text-sm">Manage all students</p>
        </div>
        <button
          onClick={() => { setForm(initialForm); setEditId(null); setIsModalOpen(true); }}
          className="bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800"
        >
          + Add Student
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, roll number, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Roll No.</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Name</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Email</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Department</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Semester</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Batch</th>
              <th className="text-left py-4 px-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-10 text-center text-gray-400">Loading...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-center text-gray-400">No students found.</td></tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-blue-700">{s.roll_number}</td>
                  <td className="py-3 px-4 font-medium">{s.full_name}</td>
                  <td className="py-3 px-4 text-gray-600">{s.email}</td>
                  <td className="py-3 px-4 text-gray-600">{s.Department?.name || '-'}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">Sem {s.semester}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{s.batch_year}</td>
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

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700">Roll Number *</label>
              <input required value={form.roll_number} onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
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
              <label className="text-xs font-medium text-gray-700">Department</label>
              <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Semester *</label>
              <select required value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Batch Year *</label>
              <input required type="number" value={form.batch_year} onChange={(e) => setForm({ ...form, batch_year: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Date of Birth</label>
              <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Address</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-60">
              {submitting ? 'Saving...' : editId ? 'Update' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;
