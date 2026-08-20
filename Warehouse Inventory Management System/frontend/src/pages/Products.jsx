import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { PageHeader, Spinner, EmptyState, Modal, Pagination, Badge } from '../components/ui'

const blank = {
  name: '',
  sku: '',
  price: '',
  quantity: 0,
  lowStockThreshold: 5,
  imageUrl: '',
  categoryId: '',
  supplierId: '',
}

export default function Products() {
  const { isAdmin } = useAuth()
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])

  function load() {
    setLoading(true)
    api
      .get('/products', { params: { search: search || undefined, page, size: 10 } })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Load dropdown options once for the add/edit form.
  useEffect(() => {
    api.get('/categories', { params: { size: 100 } }).then((r) => setCategories(r.data.content))
    api.get('/suppliers', { params: { size: 100 } }).then((r) => setSuppliers(r.data.content))
  }, [])

  function onSearch(e) {
    e.preventDefault()
    setPage(0)
    load()
  }

  async function save(e) {
    e.preventDefault()
    const payload = {
      ...modal,
      price: Number(modal.price),
      quantity: Number(modal.quantity),
      lowStockThreshold: Number(modal.lowStockThreshold),
      categoryId: modal.categoryId || null,
      supplierId: modal.supplierId || null,
    }
    try {
      if (modal.id) {
        await api.put(`/products/${modal.id}`, payload)
        toast.success('Product updated')
      } else {
        await api.post('/products', payload)
        toast.success('Product added')
      }
      setModal(null)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Your product catalog"
        action={
          isAdmin && (
            <button className="btn-primary" onClick={() => setModal({ ...blank })}>
              + Add Product
            </button>
          )
        }
      />

      <form onSubmit={onSearch} className="mb-4 flex gap-2">
        <input
          className="input max-w-xs"
          placeholder="Search by name or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-secondary">Search</button>
      </form>

      <div className="card overflow-x-auto">
        {loading ? (
          <Spinner />
        ) : data.content.length === 0 ? (
          <EmptyState message="No products found." />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-th">SKU</th>
                <th className="table-th">Name</th>
                <th className="table-th">Category</th>
                <th className="table-th">Price</th>
                <th className="table-th">Stock</th>
                {isAdmin && <th className="table-th text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.content.map((p) => (
                <tr key={p.id}>
                  <td className="table-td font-mono text-xs">{p.sku}</td>
                  <td className="table-td font-medium">{p.name}</td>
                  <td className="table-td">{p.categoryName || '—'}</td>
                  <td className="table-td">₹{p.price}</td>
                  <td className="table-td">
                    {p.quantity}{' '}
                    {p.lowStock && <Badge color="red">Low</Badge>}
                  </td>
                  {isAdmin && (
                    <td className="table-td text-right">
                      <button
                        className="mr-3 text-brand-600 hover:underline"
                        onClick={() =>
                          setModal({
                            ...p,
                            categoryId: p.categoryId || '',
                            supplierId: p.supplierId || '',
                          })
                        }
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:underline" onClick={() => remove(p.id)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
      </div>

      {modal && (
        <Modal title={modal.id ? 'Edit Product' : 'Add Product'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Name</label>
                <input
                  className="input"
                  value={modal.name}
                  onChange={(e) => setModal({ ...modal, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">SKU</label>
                <input
                  className="input"
                  value={modal.sku}
                  onChange={(e) => setModal({ ...modal, sku: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={modal.price}
                  onChange={(e) => setModal({ ...modal, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Quantity</label>
                <input
                  type="number"
                  className="input"
                  value={modal.quantity}
                  onChange={(e) => setModal({ ...modal, quantity: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Low Stock At</label>
                <input
                  type="number"
                  className="input"
                  value={modal.lowStockThreshold}
                  onChange={(e) => setModal({ ...modal, lowStockThreshold: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={modal.categoryId}
                  onChange={(e) => setModal({ ...modal, categoryId: e.target.value })}
                >
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Supplier</label>
                <select
                  className="input"
                  value={modal.supplierId}
                  onChange={(e) => setModal({ ...modal, supplierId: e.target.value })}
                >
                  <option value="">— None —</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Image URL</label>
              <input
                className="input"
                value={modal.imageUrl || ''}
                onChange={(e) => setModal({ ...modal, imageUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button className="btn-primary">Save</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
