import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import AdminUsers from './admin/AdminUsers';
import AdminOrders from './admin/AdminOrders';
import AdminTransactions from './admin/AdminTransactions';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/admin' || location.pathname === '/admin/') {
            setActiveTab('users');
            navigate('/admin/users', { replace: true });
        } else if (location.pathname.includes('/admin/users')) {
            setActiveTab('users');
        } else if (location.pathname.includes('/admin/orders')) {
            setActiveTab('orders');
        } else if (location.pathname.includes('/admin/transactions')) {
            setActiveTab('transactions');
        }
    }, [location.pathname, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
            <div className="flex border-b border-gray-200 mb-6">
                <Link
                    to="/admin/users"
                    className={`py-2 px-4 text-sm font-medium ${
                        activeTab === 'users'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </Link>
                <Link
                    to="/admin/orders"
                    className={`ml-4 py-2 px-4 text-sm font-medium ${
                        activeTab === 'orders'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
                </Link>
                <Link
                    to="/admin/transactions"
                    className={`ml-4 py-2 px-4 text-sm font-medium ${
                        activeTab === 'transactions'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('transactions')}
                >
                    Transactions
                </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <Routes>
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="transactions" element={<AdminTransactions />} />
                    <Route path="*" element={<AdminUsers />} /> {/* Default to users */}
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;
