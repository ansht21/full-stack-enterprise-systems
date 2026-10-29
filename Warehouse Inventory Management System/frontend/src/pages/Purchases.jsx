import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Eye, ShoppingCart } from 'lucide-react';

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ supplierId: '', notes: '', items: [{ productId: '', quantity: '', unitPrice: '' }] });

  const fetchPurchases = () => {
    setLoading(true);
    API.get(`/purchases?page=${page}&size=10`).then(res => {
      setPurchases(res.data.content || []); setTotalPages(res.data.totalPages || 0);
    }).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPurchases(); }, [page]);
  useEffect(() => {
    API.get('/suppliers').then(r => setSuppliers(r.data)).catch(() => {});
    API.get('/products?page=0&size=100').then(r => setProducts(r.data.content || r.data)).catch(() => {});
  }, []);

  const addItem = () => setForm({ ...form, items: [...form.items, { productId: '', quantity: '', unitPrice: '' }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const updateItem = (i, field, val) => {
    const items = [...form.items]; items[i][field] = val; setForm({ ...form, items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      supplierId: parseInt(form.supplierId),
      notes: form.notes,
      items: form.items.map(i => ({ productId: parseInt(i.productId), quantity: parseInt(i.quantity), unitPrice: parseFloat(i.unitPrice) }))
    };
    try {
      await API.post('/purchases', payload);
      toast.success('Purchase created'); setShowModal(false);
      setForm({ supplierId: '', notes: '', items: [{ productId: '', quantity: '', unitPrice: '' }] }); fetchPurchases();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Purchases</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> New Purchase
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Purchase #</th>
              <th className="px-4 py-3 text-left">Supplier</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : purchases.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No purchases yet</td></tr>
            ) : purchases.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs font-medium">{p.purchaseNumber}</td>
                <td className="px-4 py-3">{p.supplier?.name || '-'}</td>
                <td className="px-4 py-3 text-right font-medium">₹{p.totalAmount?.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{p.purchaseDate}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Prev</button>
            <span className="px-3 py-1 text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold mb-4">New Purchase</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Supplier *</label>
                <select value={form.supplierId} onChange={e => setForm({...form, supplierId: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Items</label>
                  <button type="button" onClick={addItem} className="text-indigo-600 text-sm hover:underline">+ Add Item</button>
                </div>
                {form.items.map((item, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <select value={item.productId} onChange={e => updateItem(i, 'productId', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" required>
                      <option value="">Product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} className="w-20 px-3 py-2 border rounded-lg text-sm" required />
                    <input type="number" step="0.01" placeholder="Price" value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', e.target.value)} className="w-28 px-3 py-2 border rounded-lg text-sm" required />
                    {form.items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="text-red-500 text-sm">✕</button>}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows={2} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Create Purchase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
