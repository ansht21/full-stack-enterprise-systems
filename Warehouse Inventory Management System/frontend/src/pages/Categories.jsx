import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { PageHeader, Spinner, EmptyState, Modal, Pagination } from '../components/ui'

export default function Categories() {
  const { isAdmin } = useAuth()
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // { id?, name, description }

  function load() {
    setLoading(true)
    api
      .get('/categories', { params: { search: search || undefined, page, size: 10 } })
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
        await api.put(`/categories/${modal.id}`, modal)
        toast.success('Category updated')
      } else {
        await api.post('/categories', modal)
        toast.success('Category added')
      }
      setModal(null)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this category?')) return
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Category deleted')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Organize your products"
        action={
          isAdmin && (
            <button className="btn-primary" onClick={() => setModal({ name: '', description: '' })}>
              + Add Category
            </button>
          )
        }
      />

      <form onSubmit={onSearch} className="mb-4 flex gap-2">
        <input
          className="input max-w-xs"
          placeholder="Search categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-secondary">Search</button>
      </form>

      <div className="card overflow-x-auto">
        {loading ? (
          <Spinner />
        ) : data.content.length === 0 ? (
          <EmptyState message="No categories found." />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-th">Name</th>
                <th className="table-th">Description</th>
                {isAdmin && <th className="table-th text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.content.map((c) => (
                <tr key={c.id}>
                  <td className="table-td font-medium">{c.name}</td>
                  <td className="table-td">{c.description}</td>
                  {isAdmin && (
                    <td className="table-td text-right">
                      <button
                        className="mr-3 text-brand-600 hover:underline"
                        onClick={() => setModal(c)}
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:underline" onClick={() => remove(c.id)}>
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
        <Modal title={modal.id ? 'Edit Category' : 'Add Category'} onClose={() => setModal(null)}>
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
            <div>
              <label className="label">Description</label>
              <textarea
                className="input"
                rows={3}
                value={modal.description || ''}
                onChange={(e) => setModal({ ...modal, description: e.target.value })}
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
