import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/client'
import { PageHeader, Spinner, EmptyState, Pagination, Badge } from '../components/ui'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ productId: '', quantity: 1, note: '', type: 'stock-in' })
  const [page, setPage] = useState(0)
  const [logs, setLogs] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)

  function loadLogs() {
    setLoading(true)
    api
      .get('/inventory/history', { params: { page, size: 15 } })
      .then((r) => setLogs(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    api.get('/products', { params: { size: 100 } }).then((r) => setProducts(r.data.content))
  }, [])

  useEffect(() => {
    loadLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  async function submit(e) {
    e.preventDefault()
    if (!form.productId) {
      toast.error('Select a product')
      return
    }
    try {
      await api.post(`/inventory/${form.type}`, {
        productId: Number(form.productId),
        quantity: Number(form.quantity),
        note: form.note || null,
      })
      toast.success(form.type === 'stock-in' ? 'Stock added' : 'Stock removed')
      setForm({ ...form, quantity: 1, note: '' })
      loadLogs()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Adjust stock and view movement history" />

      <div className="mb-6 card">
        <h3 className="mb-3 font-semibold text-gray-800">Stock Adjustment</h3>
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <label className="label">Product</label>
            <select
              className="input"
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
            >
              <option value="">— Select product —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (stock: {p.quantity})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Type</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="stock-in">Stock In</option>
              <option value="stock-out">Stock Out</option>
            </select>
          </div>
          <div>
            <label className="label">Quantity</label>
            <input
              type="number"
              min="1"
              className="input"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full">Apply</button>
          </div>
          <div className="md:col-span-5">
            <label className="label">Note (optional)</label>
            <input
              className="input"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="e.g. Damaged items removed"
            />
          </div>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="mb-3 font-semibold text-gray-800">Movement History</h3>
        {loading ? (
          <Spinner />
        ) : logs.content.length === 0 ? (
          <EmptyState message="No stock movements yet." />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-th">Date</th>
                <th className="table-th">Product</th>
                <th className="table-th">Type</th>
                <th className="table-th">Qty</th>
                <th className="table-th">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.content.map((l) => (
                <tr key={l.id}>
                  <td className="table-td">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="table-td font-medium">{l.productName}</td>
                  <td className="table-td">
                    <Badge color={l.type === 'STOCK_IN' ? 'green' : 'red'}>
                      {l.type === 'STOCK_IN' ? 'In' : 'Out'}
                    </Badge>
                  </td>
                  <td className="table-td">{l.quantity}</td>
                  <td className="table-td">{l.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} totalPages={logs.totalPages} onChange={setPage} />
      </div>
    </div>
  )
}
