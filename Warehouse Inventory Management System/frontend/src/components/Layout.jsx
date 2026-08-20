import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/categories', label: 'Categories', icon: '🗂️' },
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/suppliers', label: 'Suppliers', icon: '🏭' },
  { to: '/inventory', label: 'Inventory', icon: '📥' },
  { to: '/purchases', label: 'Purchases', icon: '🛒' },
  { to: '/sales', label: 'Sales', icon: '🧾' },
  { to: '/reports', label: 'Reports', icon: '📈' },
]

const adminLinks = [{ to: '/users', label: 'Users', icon: '👥' }]

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-brand-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-gray-900 p-4 md:flex">
        <div className="mb-6 px-2">
          <h1 className="text-lg font-bold text-white">WarehousePro</h1>
          <p className="text-xs text-gray-400">Inventory System</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={navClass}>
              <span>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
          {isAdmin &&
            adminLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}>
                <span>{l.icon}</span>
                {l.label}
              </NavLink>
            ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div className="md:hidden font-bold text-brand-700">WarehousePro</div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <NavLink to="/profile" className="btn-secondary">
              Profile
            </NavLink>
            <button onClick={handleLogout} className="btn-danger">
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
