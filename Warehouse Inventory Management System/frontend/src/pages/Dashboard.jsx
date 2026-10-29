import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Package, Tags, Truck, AlertTriangle, ShoppingCart, ShoppingBag, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard').then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  if (!data) return <div className="text-center text-gray-500 py-10">Failed to load dashboard</div>;

  const stats = [
    { label: 'Total Products', value: data.totalProducts, icon: Package, color: 'bg-blue-500' },
    { label: 'Categories', value: data.totalCategories, icon: Tags, color: 'bg-green-500' },
    { label: 'Suppliers', value: data.totalSuppliers, icon: Truck, color: 'bg-purple-500' },
    { label: 'Low Stock Items', value: data.lowStockItems, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Total Purchases', value: data.totalPurchases, icon: ShoppingCart, color: 'bg-orange-500' },
    { label: 'Total Sales', value: data.totalSales, icon: ShoppingBag, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-700">Total Purchase Amount</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">₹{data.totalPurchaseAmount?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-700">Total Sale Amount</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">₹{data.totalSaleAmount?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Recent Purchases</h3>
          {data.recentPurchases?.length > 0 ? (
            <div className="space-y-3">
              {data.recentPurchases.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{p.number}</p>
                    <p className="text-xs text-gray-500">{p.party}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">₹{p.amount?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{p.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm">No purchases yet</p>}
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Recent Sales</h3>
          {data.recentSales?.length > 0 ? (
            <div className="space-y-3">
              {data.recentSales.map(s => (
                <div key={s.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{s.number}</p>
                    <p className="text-xs text-gray-500">{s.party || 'Walk-in'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">₹{s.amount?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{s.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm">No sales yet</p>}
        </div>
      </div>
    </div>
  );
}
