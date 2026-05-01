import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSignals, useCreateSignal, useDeleteSignal } from '../hooks/useSignals';
import { Plus, Trash2, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const Dashboard = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading, isError, refetch } = useSignals(page, 10);
  const deleteSignal = useDeleteSignal();
  const createSignal = useCreateSignal();

  // Form state
  const [symbol, setSymbol] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createSignal.mutate({
      symbol,
      entryPrice: Number(entryPrice),
      targetPrice: Number(targetPrice),
      stopLoss: Number(stopLoss),
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setSymbol('');
        setEntryPrice('');
        setTargetPrice('');
        setStopLoss('');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Trade Signals</h1>
            <p className="text-slate-600 text-sm mt-1">Real-time market opportunities and analysis.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => refetch()}
              className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              title="Refresh Signals"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                New Signal
              </button>
            )}
          </div>
        </div>

        {/* Signals Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Symbol</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Entry</th>
                  <th className="px-6 py-4 text-green-600">Target</th>
                  <th className="px-6 py-4 text-red-600">Stop Loss</th>
                  <th className="px-6 py-4 text-right">Date</th>
                  {user?.role === 'ADMIN' && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                        <p>Loading signals...</p>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-red-500">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="w-8 h-8 mb-2" />
                        <p>Failed to load signals. Please try again.</p>
                      </div>
                    </td>
                  </tr>
                ) : data?.signals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <TrendingUp className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-lg font-medium text-slate-900">No active signals</p>
                        <p className="text-sm mt-1">Check back later for new market opportunities.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data?.signals.map((signal: any) => (
                    <tr key={signal.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs mr-3">
                            {signal.symbol.substring(0, 2)}
                          </div>
                          <span className="font-bold text-slate-900">{signal.symbol}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          signal.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          signal.status === 'CLOSED' ? 'bg-slate-100 text-slate-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {signal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                        ${signal.entryPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">
                        ${signal.targetPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-red-600">
                        ${signal.stopLoss.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">
                        {new Date(signal.createdAt).toLocaleDateString()}
                      </td>
                      {user?.role === 'ADMIN' && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this signal?')) {
                                deleteSignal.mutate(signal.id);
                              }
                            }}
                            disabled={deleteSignal.isPending}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-sm text-slate-500">
                Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{data.pagination.totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={!data.pagination.hasMore}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Signal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Create Trade Signal</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Symbol pair (e.g. BTC/USDT)</label>
                <input
                  required
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent uppercase"
                  placeholder="BTC/USDT"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Entry Price</label>
                <input
                  required
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Target Price</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">Stop Loss</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSignal.isPending}
                  className="flex-1 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors disabled:opacity-70"
                >
                  {createSignal.isPending ? 'Creating...' : 'Create Signal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
