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
                const res = await api.get(
                    '/admin/transactions'
                );
                setTransactions(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err.response?.data?.msg || err.message || 'Failed to fetch transactions');
                setError(err.response?.data?.msg || err.message || 'Failed to fetch transactions');
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [isAuthenticated, user]);

    const handleViewIpfs = async (ipfsHash) => {
        setCurrentIpfsHash(ipfsHash);
        try {
            const res = await api.get(
                `/admin/ipfs/${ipfsHash}`
            );
            // Assuming content is already JSON, so parse it then stringify for pretty print
            setIpfsContent(JSON.stringify(res.data.content, null, 2));
            setShowIpfsModal(true);
        } catch (err) {
            console.error(err.response?.data?.msg || err.message || 'Failed to fetch IPFS content');
            setError(err.response?.data?.msg || err.message || 'Failed to fetch IPFS content');
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading transactions...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Transactions</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Transaction ID</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">User</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Order ID</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Total Wei</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">IPFS Hash</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transactions.map((tx) => (
                            <tr key={tx._id}>
                                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{tx._id}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{tx.userId?.username} ({tx.userId?.email})</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{tx.orderId?._id}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{tx.totalWei}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                                    {tx.ipfsHash ? (
                                        <button
                                            onClick={() => handleViewIpfs(tx.ipfsHash)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {tx.ipfsHash.substring(0, 10)}...
                                        </button>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showIpfsModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-auto">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">IPFS Content for {currentIpfsHash.substring(0, 10)}...</h3>
                        <pre className="bg-gray-100 p-4 rounded-md text-gray-800 whitespace-pre-wrap break-all">
                            {ipfsContent}
                        </pre>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowIpfsModal(false)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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
