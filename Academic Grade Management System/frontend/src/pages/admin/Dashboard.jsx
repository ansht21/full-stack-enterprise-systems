import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === 'student') {
          // For student, find their student record first
          const { data } = await api.get('/results', { params: { student_id: user.id } });
          setStats({ type: 'student', results: data.data });
        } else {
          const { data } = await api.get('/dashboard/admin');
          setStats({ type: 'admin', ...data.data });
        }
      } catch (error) {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>;

  if (stats?.type === 'student') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Semesters Completed" value={stats.results?.length || 0} icon="📅" color="blue" />
          <StatCard title="Latest SGPA" value={stats.results?.[stats.results.length - 1]?.sgpa || '-'} icon="⭐" color="green" />
          <StatCard title="Status" value={stats.results?.[stats.results.length - 1]?.status?.toUpperCase() || 'N/A'} icon="📊" color="purple" />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Semester Results</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3">Semester</th>
                <th className="pb-3">Percentage</th>
                <th className="pb-3">SGPA</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.results?.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">Semester {r.semester}</td>
                  <td className="py-3">{r.percentage}%</td>
                  <td className="py-3">{r.sgpa}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
      <p className="text-gray-500 mb-6">Welcome back, {user?.name}!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon="🎓" color="blue" />
        <StatCard title="Total Faculty" value={stats?.totalFaculty || 0} icon="👨‍🏫" color="purple" />
        <StatCard title="Total Subjects" value={stats?.totalSubjects || 0} icon="📚" color="orange" />
        <StatCard title="Pass Percentage" value={`${stats?.passPercentage || 0}%`} icon="✅" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Student', href: '/students', icon: '➕' },
              { label: 'Add Faculty', href: '/faculty', icon: '👨‍🏫' },
              { label: 'Add Subject', href: '/subjects', icon: '📚' },
              { label: 'Enter Marks', href: '/marks', icon: '✏️' },
              { label: 'Generate Result', href: '/results', icon: '📊' },
              { label: 'View Rank List', href: '/rank-list', icon: '🏆' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition"
              >
                <span>{action.icon}</span> {action.label}
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Result Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Published Results</span>
              <span className="font-semibold">{stats?.totalResults || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${stats?.passPercentage || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">Pass rate: {stats?.passPercentage || 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
