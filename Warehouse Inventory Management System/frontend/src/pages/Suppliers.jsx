import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { PageHeader, Spinner, EmptyState, Modal, Pagination } from '../components/ui'

const blank = { name: '', email: '', phone: '', address: '' }

export default function Suppliers() {
  const { isAdmin } = useAuth()
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  function load() {
    setLoading(true)
    api
      .get('/suppliers', { params: { search: search || undefined, page, size: 10 } })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function onSearch(e) {
    e.preventDefault()
    setPage(0)
    load()
  }

  async function save(e) {
    e.preventDefault()
    try {
      if (modal.id) {
        await api.put(`/suppliers/${modal.id}`, modal)
        toast.success('Supplier updated')
      } else {
        await api.post('/suppliers', modal)
        toast.success('Supplier added')
      }
      setModal(null)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this supplier?')) return
    try {
      await api.delete(`/suppliers/${id}`)
      toast.success('Supplier deleted')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Suppliers"
        subtitle="Manage your vendors"
        action={
          isAdmin && (
            <button className="btn-primary" onClick={() => setModal({ ...blank })}>
              + Add Supplier
            </button>
          )
        }
      />

      <form onSubmit={onSearch} className="mb-4 flex gap-2">
        <input
          className="input max-w-xs"
          placeholder="Search suppliers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-secondary">Search</button>
      </form>

      <div className="card overflow-x-auto">
        {loading ? (
          <Spinner />
        ) : data.content.length === 0 ? (
          <EmptyState message="No suppliers found." />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-th">Name</th>
                <th className="table-th">Email</th>
                <th className="table-th">Phone</th>
                {isAdmin && <th className="table-th text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.content.map((s) => (
                <tr key={s.id}>
                  <td className="table-td font-medium">{s.name}</td>
                  <td className="table-td">{s.email}</td>
                  <td className="table-td">{s.phone}</td>
                  {isAdmin && (
                    <td className="table-td text-right">
                      <button
                        className="mr-3 text-brand-600 hover:underline"
                        onClick={() => setModal(s)}
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:underline" onClick={() => remove(s.id)}>
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
        <Modal title={modal.id ? 'Edit Supplier' : 'Add Supplier'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                value={modal.name}
                onChange={(e) => setModal({ ...modal, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={modal.email || ''}
                  onChange={(e) => setModal({ ...modal, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  className="input"
                  value={modal.phone || ''}
                  onChange={(e) => setModal({ ...modal, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label">Address</label>
              <textarea
                className="input"
                rows={2}
                value={modal.address || ''}
                onChange={(e) => setModal({ ...modal, address: e.target.value })}
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
