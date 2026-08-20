import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Products from './pages/Products'
import Suppliers from './pages/Suppliers'
import Inventory from './pages/Inventory'
import Purchases from './pages/Purchases'
import Sales from './pages/Sales'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Wraps an authenticated page in the shared layout.
function Page({ children, adminOnly }) {
  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Page><Dashboard /></Page>} />
      <Route path="/categories" element={<Page><Categories /></Page>} />
      <Route path="/products" element={<Page><Products /></Page>} />
      <Route path="/suppliers" element={<Page><Suppliers /></Page>} />
      <Route path="/inventory" element={<Page><Inventory /></Page>} />
      <Route path="/purchases" element={<Page><Purchases /></Page>} />
      <Route path="/sales" element={<Page><Sales /></Page>} />
      <Route path="/reports" element={<Page><Reports /></Page>} />
      <Route path="/users" element={<Page adminOnly><Users /></Page>} />
      <Route path="/profile" element={<Page><Profile /></Page>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
