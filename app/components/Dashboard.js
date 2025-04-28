'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart, Plus } from 'lucide-react';
import AddPurchase from './AddPurchase';
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import EditSalary from './EditSalary';
import EditPurchase from './EditPurchase';
import { fetchPurchase, deletePurchase } from '../services/purchase';
import currencyOptions from './ProfileModal';
import Link from 'next/link';

const Dashboard = () => {
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showEditBalanceModal, setShowEditBalanceModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editPurchase, setEditPurchase] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [currencySymbol, setCurrencySymbol] = useState('₹');
    const [refresh, setRefresh] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            router.replace('/login');
        }
    }, [router]);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.currency) {
            setCurrencySymbol(currencyOptions[userInfo.currency]?.symbol || userInfo.currency);
        }
    }, []);

    // This would be replaced with real data from your API
    const [stats, setStats] = useState({
        balance: 5240.50,
        income: 8500,
        expenses: 3259.50,
        savings: 2000,
    });

    const handlePurchaseSubmit = (purchaseData) => {
        setShowPurchaseModal(false);
        setRefresh(prev => !prev);
    };

    const handleBalanceUpdate = (newBalance) => {
        setStats(prev => ({
            ...prev,
            balance: newBalance
        }));
        setShowEditBalanceModal(false);
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

    const handleDelete = async (id) => {
        try {
            await deletePurchase(id);
            setRefresh(prev => !prev);
        } catch (error) {
            // Optionally show a toast or error message
            console.error('Failed to delete purchase:', error.message);
        }
    };

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const query = {
                    type: "dashboard"
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


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Financial Overview</h1>
                <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus size={20} />
                    <span>Add Purchase</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-xl">Monthly Salary</h3>
                        <Wallet className="text-purple-500 text-xl" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-white">{currencySymbol}{stats.balance.toLocaleString()}</p>
                    <div className='flex items-center justify-end mt-2'>
                        <button
                            className="text-2xl text-gray-400 mt-2 cursor-pointer"
                            onClick={() => setShowEditBalanceModal(true)}
                        >
                            <FaRegEdit />
                        </button>
                    </div>
                </div>

                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-xl">Current Balance</h3>
                        <TrendingUp className="text-green-500 text-xl" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-white">{currencySymbol}{stats.income.toLocaleString()}</p>
                    <p className="text-sm text-green-500 mt-2">+12% from last month</p>
                </div>

                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-xl">Total Expenses</h3>
                        <TrendingDown className="text-red-500 text-xl" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-white">{currencySymbol}{stats.expenses.toLocaleString()}</p>
                    <p className="text-sm text-red-500 mt-2">-8% from last month</p>
                </div>

                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-xl">Total Savings</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">{currencySymbol}{stats.savings.toLocaleString()}</p>
                    <p className="text-sm text-blue-500 mt-2">On track for goal</p>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-white">Recent Transactions</h2>
                    <div className="space-y-4 relative min-h-[120px]">
                        {purchases.length === 0 ? (
                            <>
                                {/* Render 3 blank spaces if no transactions */}
                                <p className='flex items-center justify-center'>No Purchase Found</p>
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="p-3 rounded-lg" style={{ minHeight: '56px' }}></div>
                                ))}
                            </>

                        ) : (
                            [0, 1, 2].map((i) =>
                                purchases[i] ? (
                                    <div key={purchases[i].id || i} className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gray-700 rounded-lg">
                                                <Wallet size={20} className="text-purple-500" />
                                            </div>
                                            <div>
                                                <p className="text-white">{purchases[i].purchaseName || 'No Name'}</p>
                                                <p className="text-sm text-gray-400">{purchases[i].date ? new Date(purchases[i].date).toLocaleDateString() : ''}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <p className="text-red-500">-{currencySymbol}{purchases[i].price}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    className="text-blue-400 hover:text-blue-600  font-semibold text-lg border-1 px-2 hover:cursor-pointer"
                                                    onClick={() => handleEdit(purchases[i])}
                                                >Edit</button>
                                                <button
                                                    className="text-red-400 hover:text-red-600 font-semibold text-lg border-1 px-2 hover:cursor-pointer"
                                                    onClick={() => handleDelete(purchases[i].id)}
                                                >Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={i} className="p-3 rounded-lg" style={{ minHeight: '56px' }}></div>
                                )
                            )
                        )}
                        <button
                            onClick={() => { router.push('/transactions') }}
                            className="w-full text-center text-purple-500 hover:text-purple-400 text-sm mt-4 cursor-pointer absolute left-0 right-0 bottom-0"
                            style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
                        >
                            View All Transactions →
                        </button>
                    </div>
                </div>

                {/* Spending Categories */}
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-white flex items-center space-x-2">
                        <PieChart size={20} />
                        <span>Spending by Category</span>
                    </h2>
                    <div className="space-y-4">
                        {[
                            { category: 'Housing', amount: 1200, percentage: 40 },
                            { category: 'Food', amount: 500, percentage: 25 },
                            { category: 'Transportation', amount: 300, percentage: 15 },
                        ].map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">{item.category}</span>
                                    <span className="text-white">{currencySymbol}{item.amount}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        <button className="w-full text-center text-purple-500 hover:text-purple-400 text-sm mt-4 cursor-pointer">
                            <Link href={'/transactions'} >
                                View Detailed Analytics →
                            </Link>
                        </button>
                    </div>
                </div>
            </div>

            {/* AddPurchase Modal */}
            <AddPurchase
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                onSubmit={handlePurchaseSubmit}
            />

            {/* EditPurchase Modal */}
            <EditPurchase
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSubmit={handleEditSubmit}
                purchase={editPurchase}
            />

            {/* EditSalary Modal */}
            <EditSalary
                isOpen={showEditBalanceModal}
                onClose={() => setShowEditBalanceModal(false)}
                onSubmit={handleBalanceUpdate}
                currentBalance={stats.balance}
            />
        </div>
    );
};

export default Dashboard;