import { useEffect, useState } from 'react'
import api from '../api/client'
import { PageHeader, Spinner, Badge } from '../components/ui'

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/dashboard/summary')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (!data) return null

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your warehouse" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Products" value={data.totalProducts} icon="📦" accent="bg-blue-100" />
        <StatCard label="Categories" value={data.totalCategories} icon="🗂️" accent="bg-purple-100" />
        <StatCard label="Suppliers" value={data.totalSuppliers} icon="🏭" accent="bg-green-100" />
        <StatCard label="Low Stock Items" value={data.lowStockCount} icon="⚠️" accent="bg-red-100" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-3 font-semibold text-gray-800">Recent Purchases</h3>
          {data.recentPurchases.length === 0 ? (
            <p className="text-sm text-gray-500">No purchases yet.</p>
          ) : (
            <ul className="divide-y">
              {data.recentPurchases.map((p) => (
                <li key={p.id} className="flex justify-between py-2 text-sm">
                  <span>{p.referenceNo}</span>
                  <span className="font-medium">₹{p.totalAmount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3 className="mb-3 font-semibold text-gray-800">Recent Sales</h3>
          {data.recentSales.length === 0 ? (
            <p className="text-sm text-gray-500">No sales yet.</p>
          ) : (
            <ul className="divide-y">
              {data.recentSales.map((s) => (
                <li key={s.id} className="flex justify-between py-2 text-sm">
                  <span>
                    {s.invoiceNo} <Badge color="blue">{s.customerName}</Badge>
                  </span>
                  <span className="font-medium">₹{s.totalAmount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
