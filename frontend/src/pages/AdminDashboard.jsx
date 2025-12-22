import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
} from 'react-router-dom';
import AdminUsers from './admin/AdminUsers';
import AdminOrders from './admin/AdminOrders';
import AdminTransactions from './admin/AdminTransactions';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === '/admin' ||
      location.pathname === '/admin/'
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab('users');
      navigate('/admin/users', { replace: true });
    } else if (location.pathname.includes('/admin/users')) {
      setActiveTab('users');
    } else if (location.pathname.includes('/admin/orders')) {
      setActiveTab('orders');
    } else if (
      location.pathname.includes('/admin/transactions')
    ) {
      setActiveTab('transactions');
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Admin Dashboard
      </h1>

      <div className="flex border-b border-white/10 mb-6">
        <Link
          to="/admin/users"
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'users'
              ? 'border-b-2 border-brand-orange text-brand-orange'
              : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </Link>

        <Link
          to="/admin/orders"
          className={`ml-4 py-2 px-4 text-sm font-medium ${
            activeTab === 'orders'
              ? 'border-b-2 border-brand-orange text-brand-orange'
              : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </Link>

        <Link
          to="/admin/transactions"
          className={`ml-4 py-2 px-4 text-sm font-medium ${
            activeTab === 'transactions'
              ? 'border-b-2 border-brand-orange text-brand-orange'
              : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </Link>
      </div>

      <div className="bg-slate-900/60 p-6 rounded-lg shadow-md">
        <Routes>
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route
            path="transactions"
            element={<AdminTransactions />}
          />
          <Route path="*" element={<AdminUsers />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
