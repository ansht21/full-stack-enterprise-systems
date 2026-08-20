import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/client'
import { PageHeader, Spinner, EmptyState, Modal, Pagination } from '../components/ui'

// Shared page for creating multi-line purchases and viewing history.
export default function Purchases() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [modal, setModal] = useState(false)
  const [supplierId, setSupplierId] = useState('')
  const [items, setItems] = useState([{ productId: '', quantity: 1, unitPrice: '' }])
  const [detail, setDetail] = useState(null)

  function load() {
    setLoading(true)
    api
      .get('/purchases', { params: { page, size: 10 } })
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    api.get('/products', { params: { size: 100 } }).then((r) => setProducts(r.data.content))
    api.get('/suppliers', { params: { size: 100 } }).then((r) => setSuppliers(r.data.content))
  }, [])

  function setItem(i, field, value) {
    const next = [...items]
    next[i] = { ...next[i], [field]: value }
    setItems(next)
  }

  const total = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0,
  )

  async function submit(e) {
    e.preventDefault()
    const payload = {
      supplierId: supplierId ? Number(supplierId) : null,
      items: items.map((it) => ({
        productId: Number(it.productId),
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
      })),
    }
    if (payload.items.some((it) => !it.productId)) {
      toast.error('Select a product for every line')
      return
    }
    try {
      await api.post('/purchases', payload)
      toast.success('Purchase recorded — stock updated')
      setModal(false)
      setItems([{ productId: '', quantity: 1, unitPrice: '' }])
      setSupplierId('')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Purchases"
        subtitle="Record incoming stock from suppliers"
        action={
          <button className="btn-primary" onClick={() => setModal(true)}>
            + New Purchase
          </button>
        }
      />

      <div className="card overflow-x-auto">
        {loading ? (
          <Spinner />
        ) : data.content.length === 0 ? (
          <EmptyState message="No purchases yet." />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-th">Reference</th>
                <th className="table-th">Supplier</th>
                <th className="table-th">Items</th>
                <th className="table-th">Total</th>
                <th className="table-th">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.content.map((p) => (
                <tr
                  key={p.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setDetail(p)}
                >
                  <td className="table-td font-mono text-xs">{p.referenceNo}</td>
                  <td className="table-td">{p.supplierName || '—'}</td>
                  <td className="table-td">{p.items.length}</td>
                  <td className="table-td font-medium">₹{p.totalAmount}</td>
                  <td className="table-td">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
      </div>

      {modal && (
        <Modal title="New Purchase" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Supplier</label>
              <select
                className="input"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="">— None —</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 items-end gap-2">
                <div className="col-span-6">
                  <label className="label">Product</label>
                  <select
                    className="input"
                    value={it.productId}
                    onChange={(e) => setItem(i, 'productId', e.target.value)}
                  >
                    <option value="">— Select —</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label">Qty</label>
                  <input
                    type="number"
                    min="1"
                    className="input"
                    value={it.quantity}
                    onChange={(e) => setItem(i, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <label className="label">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={it.unitPrice}
                    onChange={(e) => setItem(i, 'unitPrice', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-1">
                  {items.length > 1 && (
                    <button
                      type="button"
                      className="btn-danger px-2"
                      onClick={() => setItems(items.filter((_, j) => j !== i))}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setItems([...items, { productId: '', quantity: 1, unitPrice: '' }])}
            >
              + Add Line
            </button>

            <div className="flex items-center justify-between border-t pt-4">
              <p className="font-semibold">Total: ₹{total.toFixed(2)}</p>
              <div className="flex gap-2">
                <button type="button" className="btn-secondary" onClick={() => setModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary">Record Purchase</button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {detail && (
        <Modal title={`Purchase ${detail.referenceNo}`} onClose={() => setDetail(null)}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-th">Product</th>
                <th className="table-th">Qty</th>
                <th className="table-th">Unit Price</th>
                <th className="table-th">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {detail.items.map((it, i) => (
                <tr key={i}>
                  <td className="table-td">{it.productName}</td>
                  <td className="table-td">{it.quantity}</td>
                  <td className="table-td">₹{it.unitPrice}</td>
                  <td className="table-td">₹{it.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-right font-semibold">Total: ₹{detail.totalAmount}</p>
        </Modal>
      )}
    </div>
  )
}
