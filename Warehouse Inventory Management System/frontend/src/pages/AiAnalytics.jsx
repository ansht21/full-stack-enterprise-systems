import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Sparkles, AlertTriangle, CheckCircle, TrendingUp, RefreshCw, Clock, Box } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AiAnalytics() {
  const [summary, setSummary] = useState(null);
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, forecastsRes] = await Promise.all([
        API.get('/ai/summary'),
        API.get('/ai/forecast')
      ]);
      setSummary(summaryRes.data);
      setForecasts(forecastsRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load AI demand analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">Critical Stockout</span>;
      case 'WARNING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Reorder Alert</span>;
      case 'OVERSTOCKED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">Overstocked</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Optimal Buffer</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <RefreshCw className="w-8 h-8 animate-spin mb-2 text-indigo-600" />
        <p className="text-sm">Synthesizing predictive stock forecasts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">AI Demand Forecasting & Inventory Intelligence</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Automated Reorder Point (ROP) heuristic calculations and stockout depletion prediction.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Models
        </button>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Monitored SKUs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalTrackedSkus}</p>
                <p className="text-xs text-gray-500 mt-1">{summary.totalStockUnits} Total Units</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <Box className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Critical Risks</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{summary.criticalStockoutRiskCount}</p>
                <p className="text-xs text-gray-500 mt-1">Stockout within 3 days</p>
              </div>
              <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Reorder Alerts</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{summary.warningReorderCount}</p>
                <p className="text-xs text-gray-500 mt-1">Breached Safety ROP</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${Number(summary.totalInventoryValue || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">~{summary.averageDailyBurnRateUnits} units/day burn</p>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Supply Chain Intelligence Digest */}
      {summary && summary.executiveInsights && summary.executiveInsights.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-700" />
            <h2 className="text-base font-semibold text-indigo-900">AI Supply Chain Insights & Action Items</h2>
          </div>
          <ul className="space-y-2">
            {summary.executiveInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-indigo-800">
                <span className="font-bold text-indigo-600">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Forecast Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">SKU Demand Predictions & Replenishment Model</h2>
          <p className="text-xs text-gray-500 mt-0.5">Calculated using 30-day velocity, supplier turnaround lead time, and safety buffer formulas.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Product / SKU</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-right">Current Stock</th>
                <th className="px-6 py-3 text-right">Daily Demand</th>
                <th className="px-6 py-3 text-right">Reorder Point (ROP)</th>
                <th className="px-6 py-3 text-center">Days to Stockout</th>
                <th className="px-6 py-3">Risk Assessment</th>
                <th className="px-6 py-3">AI Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {forecasts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-400">
                    No active product data available for forecasting.
                  </td>
                </tr>
              ) : (
                forecasts.map((f) => (
                  <tr key={f.productId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{f.productName}</div>
                      <div className="text-xs text-gray-400 font-mono">{f.sku}</div>
                    </td>
                    <td className="px-6 py-4">{f.categoryName}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">{f.currentStock}</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-600">{f.avgDailyConsumption} / day</td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-indigo-600">{f.reorderPoint} units</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        f.daysUntilStockout <= 3 ? 'text-red-600' : f.daysUntilStockout <= 7 ? 'text-amber-600' : 'text-gray-700'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {f.daysUntilStockout != null ? `${f.daysUntilStockout} days` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getRiskBadge(f.riskLevel)}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 max-w-xs">{f.recommendationMessage}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
