import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function Inventory() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    API.get(`/inventory?page=${page}&size=20`).then(res => {
      setLogs(res.data.content || []); setTotalPages(res.data.totalPages || 0);
    }).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, [page]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Inventory History</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-center">Type</th>
              <th className="px-4 py-3 text-right">Quantity</th>
              <th className="px-4 py-3 text-left">Reference</th>
              <th className="px-4 py-3 text-left">Notes</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No inventory logs yet</td></tr>
            ) : logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{log.product?.name || '-'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${log.type === 'STOCK_IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {log.type === 'STOCK_IN' ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                    {log.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium">{log.quantity}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{log.referenceType || '-'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{log.notes || '-'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{log.createdAt?.replace('T', ' ').substring(0, 16)}</td>
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
    </div>
  );
}
