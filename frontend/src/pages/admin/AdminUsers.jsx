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
            const res = await api.get(
                '/admin/users'
            );
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err.response?.data?.msg || err.message || 'Failed to fetch users');
            setError(err.response?.data?.msg || err.message || 'Failed to fetch users');
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();
    }, [isAuthenticated, user]);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${userId}`);
                setUsers(users.filter((u) => u._id !== userId));
            } catch (err) {
                console.error(err.response?.data?.msg || err.message || 'Failed to delete user');
                setError(err.response?.data?.msg || err.message || 'Failed to delete user');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading users...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">ID</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Username</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Email</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Role</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Metamask Account</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{u._id}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{u.username}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{u.role}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{u.metamaskAccount || 'N/A'}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button
                                        onClick={() => handleDelete(u._id)}
                                        className="text-red-600 hover:text-red-900"
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
