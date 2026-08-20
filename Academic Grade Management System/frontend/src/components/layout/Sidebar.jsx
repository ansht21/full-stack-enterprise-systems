import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/students', label: 'Students', icon: '🎓' },
  { to: '/faculty', label: 'Faculty', icon: '👨‍🏫' },
  { to: '/subjects', label: 'Subjects', icon: '📚' },
  { to: '/marks', label: 'Marks Entry', icon: '✏️' },
  { to: '/results', label: 'Results', icon: '📊' },
  { to: '/rank-list', label: 'Rank List', icon: '🏆' },
];

const facultyLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/marks', label: 'Marks Entry', icon: '✏️' },
  { to: '/results', label: 'Results', icon: '📊' },
];

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/my-results', label: 'My Results', icon: '📊' },
  { to: '/marksheet', label: 'Marksheet', icon: '📄' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    user?.role === 'student'
      ? studentLinks
      : user?.role === 'faculty'
      ? facultyLinks
      : adminLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-lg font-bold">🎓 SRMS</h1>
        <p className="text-xs text-blue-300 mt-1">Student Result Management</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-lg font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-blue-300 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-red-700 hover:text-white transition-colors"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
