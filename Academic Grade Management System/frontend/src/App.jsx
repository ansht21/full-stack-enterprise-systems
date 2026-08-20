import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import Faculty from './pages/admin/Faculty';
import Subjects from './pages/admin/Subjects';
import Marks from './pages/admin/Marks';
import Results from './pages/admin/Results';
import RankList from './pages/admin/RankList';
import MyResults from './pages/student/MyResults';
import Marksheet from './pages/student/Marksheet';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Admin / Faculty routes */}
      <Route path="/students" element={<PrivateRoute allowedRoles={['super_admin', 'admin', 'faculty']}><Students /></PrivateRoute>} />
      <Route path="/faculty" element={<PrivateRoute allowedRoles={['super_admin', 'admin']}><Faculty /></PrivateRoute>} />
      <Route path="/subjects" element={<PrivateRoute allowedRoles={['super_admin', 'admin', 'faculty']}><Subjects /></PrivateRoute>} />
      <Route path="/marks" element={<PrivateRoute allowedRoles={['super_admin', 'admin', 'faculty']}><Marks /></PrivateRoute>} />
      <Route path="/results" element={<PrivateRoute allowedRoles={['super_admin', 'admin', 'faculty']}><Results /></PrivateRoute>} />
      <Route path="/rank-list" element={<PrivateRoute allowedRoles={['super_admin', 'admin', 'faculty']}><RankList /></PrivateRoute>} />

      {/* Student routes */}
      <Route path="/my-results" element={<PrivateRoute allowedRoles={['student']}><MyResults /></PrivateRoute>} />
      <Route path="/marksheet" element={<PrivateRoute allowedRoles={['student']}><Marksheet /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
