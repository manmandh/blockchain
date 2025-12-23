import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isAuthenticated = false, user = { role: 'user' } } = useAuth();

  const fetchUsers = async () => {
    if (!isAuthenticated || user.role !== 'admin') {
      setError('You are not authorized to view this page.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.message ||
          'Failed to fetch users'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.message ||
          'Failed to delete user'
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-slate-300">
        Loading users...
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
        Manage Users
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/5 border border-white/10 rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                ID
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Username
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Email
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Role
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                MetaMask Account
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-white/10">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="py-4 px-6 text-sm font-medium text-white break-all">
                  {u._id}
                </td>

                <td className="py-4 px-6 text-sm text-slate-300">
                  {u.username}
                </td>

                <td className="py-4 px-6 text-sm text-slate-300">
                  {u.email}
                </td>

                <td className="py-4 px-6 text-sm text-slate-300">
                  {u.role}
                </td>

                <td className="py-4 px-6 text-sm text-slate-300 break-all">
                  {u.metamaskAccount || 'N/A'}
                </td>

                <td className="py-4 px-6 text-sm font-medium">
                  <button
                    className="text-brand-orange hover:text-orange-700 mr-4"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
