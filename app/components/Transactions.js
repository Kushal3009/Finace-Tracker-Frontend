'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { fetchPurchase, deletePurchase } from '../services/purchase';
import AddPurchase from './AddPurchase';
import EditPurchase from './EditPurchase';

const Transactions = () => {
    const router = useRouter();
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            router.replace('/login');
        }
    }, [router]);

    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchases, setPurchases] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editPurchase, setEditPurchase] = useState(null);

    const categories = ["Food & Dining", "Groceries", "Rent/Mortgage", "Utilities", "Transportation", "Entertainment", "Health & Fitness", "Shopping", "Education", "Insurance", "Travel", "Loan Payments", "Savings & Investments", "Charity & Donations"];

    const handlePurchaseSubmit = (purchaseData) => {
        console.log('Purchase Data Submitted:', purchaseData); // ✅ check this logs
        setShowPurchaseModal(false);
        setRefresh(prev => !prev); // Trigger refresh after adding purchase
    };

    const handleDelete = async (id) => {
        await deletePurchase(id);
        setRefresh(prev => !prev);
    };

    const handleEdit = (purchase) => {
        setEditPurchase(purchase);
        setEditModalOpen(true);
    };

    const handleEditSubmit = () => {
        setEditModalOpen(false);
        setEditPurchase(null);
        setRefresh(prev => !prev);
    };

    useEffect(() => {
        const fetchPurchases = async () => {
            console.log('Fetching purchases...'); // ✅ Check this shows on refresh

            try {
                const query = {
                    type: "transection"
                }
                const data = await fetchPurchase(query);
                setPurchases(data);
            } catch (error) {
                if (error.status == 401) {
                    localStorage.removeItem('authToken');
                    router.push('/login');
                    return;
                }
                console.error('Failed to fetch purchases:', error.message);
            }
        };
        fetchPurchases();
    }, [refresh]);

    const filteredPurchases = selectedCategory
        ? purchases.filter(p => p.category_name === selectedCategory)
        : purchases;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Transactions</h1>
                <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus size={20} />
                    <span>Add Transaction</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="w-full bg-black/40 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        className="w-full bg-black/40 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white appearance-none focus:outline-none focus:border-purple-500"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="relative">
                    <select className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none focus:outline-none focus:border-purple-500">
                        <option value="">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-gray-700">
                <div className="p-4">
                    {filteredPurchases && filteredPurchases.length > 0 ? (
                        filteredPurchases.map((transaction, idx) => (
                            <div
                                key={transaction._id || idx}
                                className="flex items-center justify-between p-4 hover:bg-gray-800/50 rounded-lg transition"
                            >
                                <div className="flex items-center space-x-4">
                                    {transaction.type === 'income' ? (
                                        <ArrowUpCircle className="text-green-500" size={24} />
                                    ) : (
                                        <ArrowDownCircle className="text-red-500" size={24} />
                                    )}
                                    <div>
                                        <p className="text-white font-medium">{transaction.purchaseName || transaction.description || 'No Description'}</p>
                                        <p className="text-sm text-gray-400">{transaction.category_name || 'No Category'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.price}
                                    </p>
                                    <p className="text-sm text-gray-400">{transaction.date}</p>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => handleEdit(transaction)} className="text-blue-400 hover:text-blue-600 border-2 px-2 hover:cursor-pointer text-xl">Edit</button>
                                        <button onClick={() => handleDelete(transaction.id)} className="text-red-400 hover:text-red-600 border-2 px-2 hover:cursor-pointer text-xl">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No transactions found.</p>
                    )}
                </div>
            </div>

            <AddPurchase
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                onSubmit={handlePurchaseSubmit}
            />

            <EditPurchase
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSubmit={handleEditSubmit}
                purchase={editPurchase}
            />
        </div>
    );
};

export default Transactions;
