import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showIpfsModal, setShowIpfsModal] = useState(false);
  const [ipfsContent, setIpfsContent] = useState('');
  const [currentIpfsHash, setCurrentIpfsHash] = useState('');

  const { isAuthenticated = false, user = { role: 'user' } } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isAuthenticated || user.role !== 'admin') {
        setError('You are not authorized to view this page.');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/admin/transactions');
        setTransactions(res.data);
      } catch (err) {
        setError(
          err.response?.data?.msg ||
            err.message ||
            'Failed to fetch transactions'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isAuthenticated, user]);

  const handleViewIpfs = async (ipfsHash) => {
    if (!ipfsHash) {
      return;
    }

    setCurrentIpfsHash(ipfsHash);

    try {
      const res = await api.get(`/admin/ipfs/${ipfsHash}`);
      setIpfsContent(
        typeof res.data?.content === 'object'
          ? JSON.stringify(res.data.content, null, 2)
          : res.data?.content || 'No content'
      );
      setShowIpfsModal(true);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.message ||
          'Failed to fetch IPFS content'
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        Loading transactions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-white mb-6">
        Manage Transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/5 border border-white/10 rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Transaction ID
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                User
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Order ID
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Total Wei
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                IPFS Hash
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Created At
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td className="py-4 px-6 text-sm font-medium text-white">
                  {tx._id}
                </td>

                <td className="py-4 px-6 text-sm text-slate-300">
                  {tx.userId
                    ? `${tx.userId.username} (${tx.userId.email})`
                    : 'N/A'}
                </td>

                <td className="py-4 px-6 text-sm text-slate-300">
                  {tx.orderId?._id || 'N/A'}
                </td>

                <td className="py-4 px-6 text-sm text-slate-300">
                  {tx.totalWei}
                </td>

                <td className="py-4 px-6 text-sm">
                  {tx.ipfsHash ? (
                    <button
                      onClick={() => handleViewIpfs(tx.ipfsHash)}
                      className="text-brand-orange hover:text-orange-700 break-all"
                    >
                      {tx.ipfsHash.slice(0, 10)}...
                    </button>
                  ) : (
                    <span className="text-slate-400">
                      N/A
                    </span>
                  )}
                </td>

                <td className="py-4 px-6 text-sm text-slate-300">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showIpfsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="bg-slate-800 p-8 rounded-xl shadow-xl border border-white/10 w-full max-w-4xl text-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">
              IPFS Content for{' '}
              {currentIpfsHash?.slice(0, 10) || 'N/A'}...
            </h3>

            <pre className="bg-slate-900/60 p-4 rounded-md text-slate-300 whitespace-pre-wrap break-all">
              {ipfsContent}
            </pre>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowIpfsModal(false)}
                className="bg-brand-orange hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
