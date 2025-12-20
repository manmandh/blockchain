import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated = false, user = { role: 'user' } } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated || user.role !== 'admin') {
                setError('You are not authorized to view this page.');
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(
                    '/admin/orders'
                );
                setOrders(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err.response?.data?.msg || err.message || 'Failed to fetch orders');
                setError(err.response?.data?.msg || err.message || 'Failed to fetch orders');
                setLoading(false);
            }
        };
        fetchOrders();
    }, [isAuthenticated, user]);

    if (loading) {
        return <div className="text-center py-4">Loading orders...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Orders</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Order ID</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">User</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Total Amount</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Created At</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{order.userId?.username} ({order.userId?.email})</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{order.subtotal}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{order.status}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
