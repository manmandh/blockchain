import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { isAuthenticated = false, user = { role: 'user' } } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || user.role !== 'admin') {
        setError('You are not authorized to view this page.');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/admin/orders');
        setOrders(res.data);
      } catch (err) {
        setError(
          err.response?.data?.msg ||
            err.message ||
            'Failed to fetch orders'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  if (loading) {
    return <div className="text-center py-4">Loading orders...</div>;
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
        Manage Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/5 border border-white/10 rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Order ID
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                User
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Total Amount
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Status
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Created At
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-4 px-6 text-sm font-medium text-white">
                  {order._id}
                </td>
                <td className="py-4 px-6 text-sm text-slate-300">
                  {order.userId
                    ? `${order.userId.username} (${order.userId.email})`
                    : 'N/A'}
                </td>
                <td className="py-4 px-6 text-sm text-slate-300">
                  {order.subtotal}
                </td>
                <td className="py-4 px-6 text-sm text-slate-300">
                  {order.status}
                </td>
                <td className="py-4 px-6 text-sm text-slate-300">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="text-brand-orange hover:text-orange-700"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showOrderDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="bg-slate-800 p-8 rounded-xl shadow-xl border border-white/10 w-full max-w-4xl text-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">
              Order Details for{' '}
              {selectedOrder._id?.slice(0, 10) || 'N/A'}...
            </h3>

            <div className="space-y-3 text-sm">
              <p>
                <strong>Order ID:</strong>{' '}
                <span className="font-mono break-all">
                  {selectedOrder._id || 'N/A'}
                </span>
              </p>

              <p>
                <strong>User:</strong>{' '}
                {selectedOrder.userId
                  ? `${selectedOrder.userId.username} (${selectedOrder.userId.email})`
                  : 'N/A'}
              </p>

              <p>
                <strong>Subtotal:</strong>{' '}
                {selectedOrder.subtotal ?? 'N/A'}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {selectedOrder.status || 'N/A'}
              </p>

              <p>
                <strong>Created At:</strong>{' '}
                {selectedOrder.createdAt
                  ? new Date(
                      selectedOrder.createdAt
                    ).toLocaleString()
                  : 'N/A'}
              </p>

              {selectedOrder.notes && (
                <p>
                  <strong>Notes:</strong> {selectedOrder.notes}
                </p>
              )}

              {selectedOrder.ipfsHash && (
                <p>
                  <strong>IPFS Hash:</strong>{' '}
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${selectedOrder.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-orange break-all hover:underline"
                  >
                    {selectedOrder.ipfsHash}
                  </a>
                </p>
              )}

              {selectedOrder.txHash && (
                <p>
                  <strong>Transaction Hash:</strong>{' '}
                  <span className="font-mono text-xs text-slate-300 break-all">
                    {selectedOrder.txHash}
                  </span>
                </p>
              )}

              {selectedOrder.chainId && (
                <p>
                  <strong>Chain ID:</strong>{' '}
                  {selectedOrder.chainId}
                </p>
              )}

              <h4 className="text-lg font-bold mt-6">
                Items:
              </h4>

              {Array.isArray(selectedOrder.items) &&
              selectedOrder.items.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {selectedOrder.items.map((item, index) => (
                    <li
                      key={item.productId || index}
                      className="text-slate-300"
                    >
                      {item.name || 'Unnamed item'} x{' '}
                      {item.quantity ?? 0} (Ξ
                      {item.price ?? 0})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 italic">
                  No items found for this order.
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowOrderDetailsModal(false)}
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

export default AdminOrders;
