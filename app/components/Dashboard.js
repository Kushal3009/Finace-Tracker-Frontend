'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart, Plus } from 'lucide-react';
import AddPurchase from './AddPurchase';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineAddBox } from "react-icons/md";
import { useRouter } from 'next/navigation';
import EditSalary from './EditSalary';
import EditPurchase from './EditPurchase';
import { fetchPurchase, deletePurchase } from '../services/purchase';
import Link from 'next/link';
import { fetchEditAccess, fetchSalary } from '../services/dashboard';
import { useCurrency } from './CurrencyContext';

const Dashboard = () => {
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showEditBalanceModal, setShowEditBalanceModal] = useState(false);
    const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editPurchase, setEditPurchase] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [editAccess, setEditAcess] = useState(false);
    const [category, setCategory] = useState([]);
    const router = useRouter();
    const { currencySymbol } = useCurrency();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            router.replace('/login');
        }
    }, [router]);

    useEffect(() => {
        const init = async () => {
            const editAccess = await fetchEditAccess();
            setEditAcess(editAccess.editAccess);
        };

        init();
    });

    const [stats, setStats] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
        savings: 0,
    });

    const handlePurchaseSubmit = (purchaseData) => {
        setShowPurchaseModal(false);
        setRefresh(prev => !prev);
    };

    const handleBalanceUpdate = (newBalance) => {
        setStats(prev => ({
            ...prev,
            balance: typeof newBalance === 'object' && newBalance !== null ? newBalance.amount : newBalance
        }));
        setShowEditBalanceModal(false);
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

    const handleDelete = async (id) => {
        try {
            await deletePurchase(id);
            setRefresh(prev => !prev);
        } catch (error) {
            console.error('Failed to delete purchase:', error.message);
        }
    };

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const query = {
                    type: "dashboard"
                };
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

        const fetchSalarys = async () => {
            try {
                const data = await fetchSalary();
                const salaryDetails = data.salaryDetails[0];
                const categoryDetails = data.categoryDetails;

                if (!data || Object.keys(data).length === 0) {
                    setStats(prev => ({
                        ...prev,
                        balance: 0,
                        income: 0,
                        expenses: 0,
                        savings: 0,
                    }));
                    setCategory([]);
                } else {
                    setStats(prev => ({
                        ...prev,
                        balance: salaryDetails.total_balance ? salaryDetails.total_balance : 0,
                        income: salaryDetails.current_balance || 0,
                        expenses: salaryDetails.total_expense || 0,
                        savings: salaryDetails.total_saving || 0,
                    }));
                    setCategory(data.categoryDetails || []);
                }
            } catch (error) {
                if (error.status == 401) {
                    localStorage.removeItem('authToken');
                    router.push('/login');
                    return;
                }
                console.error('Failed to fetch salary:', error.message);
            }
        };
        fetchPurchases();
        fetchSalarys();
    }, [refresh]);

    return (
        <div className="p-6">

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Financial Overview</h1>

                {editAccess && (
                    <button
                        onClick={() => setShowPurchaseModal(true)}
                        className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        <Plus size={20} />
                        <span>Add Purchase</span>
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-xl">Monthly Salary</h3>
                        <Wallet className="text-purple-500 text-xl" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-white">{currencySymbol}{stats.balance}</p>
                    {editAccess ? (
                        <div className='flex items-center justify-end mt-2'>
                            <button
                                className="text-2xl text-gray-400 mt-2 cursor-pointer"
                                onClick={() => setShowEditBalanceModal(true)}
                            >
                                <FaRegEdit />
                            </button>
                        </div>
                    ) : (
                        <div className='flex items-center justify-end mt-2'>
                            <button
                                className="text-2xl text-gray-400 mt-2 cursor-pointer"
                                onClick={() => setShowAddBalanceModal(true)}
                            >
                                <MdOutlineAddBox />
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-xl">Current Balance</h3>
                        <TrendingUp className="text-green-500 text-xl" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-white">{currencySymbol}{stats.income}</p>
                </div>

                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-xl">Total Expenses</h3>
                        <TrendingDown className="text-red-500 text-xl" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-white">{currencySymbol}{stats.expenses}</p>
                </div>

                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-xl">Total Savings</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">{currencySymbol}{stats.savings}</p>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-white">Recent Transactions</h2>

                    <div className="relative min-h-[200px] flex flex-col justify-center space-y-4">
                        {purchases.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-gray-400 text-center">No Purchase Found</p>
                            </div>
                        ) : (
                            [0, 1, 2].map((i) =>
                                purchases[i] ? (
                                    <div
                                        key={purchases[i].id || i}
                                        className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gray-700 rounded-lg">
                                                <Wallet size={20} className="text-purple-500" />
                                            </div>
                                            <div>
                                                <p className="text-white">
                                                    {purchases[i].purchaseName || 'No Name'}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    {purchases[i].date
                                                        ? new Date(purchases[i].date).toLocaleDateString()
                                                        : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <p className="text-red-500">
                                                -{currencySymbol}
                                                {purchases[i].price}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    className="text-blue-400 hover:text-blue-600 font-semibold text-lg border-1 px-2 hover:cursor-pointer"
                                                    onClick={() => handleEdit(purchases[i])}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-400 hover:text-red-600 font-semibold text-lg border-1 px-2 hover:cursor-pointer"
                                                    onClick={() => handleDelete(purchases[i].id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={i} className="p-3 rounded-lg" style={{ minHeight: '56px' }}></div>
                                )
                            )
                        )}

                        {/* Bottom Button */}
                        <button
                            onClick={() => router.push('/transactions')}
                            className="w-full text-center text-purple-500 hover:text-purple-400 text-sm mt-4 absolute left-0 right-0 bottom-0"
                        >
                            View All Transactions →
                        </button>
                    </div>
                </div>

                {/* Spending Categories */}
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700 flex flex-col justify-between h-full">
                    <h2 className="text-xl font-bold mb-4 text-white flex items-center space-x-2">
                        <PieChart size={20} />
                        <span>Spending by Category</span>
                    </h2>

                    {category.length === 0 ? (
                        <div className="flex-grow space-y-4 flex flex-col justify-center">
                            <p className="text-center text-gray-400">No category found</p>
                        </div>
                    ) : (
                        category.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">{item.category_name}</span>
                                    <span className="text-white">{currencySymbol}{item.totalSpent}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: `${item.spendingPercentage}%` }}
                                    />
                                </div>
                            </div>
                        ))
                    )}

                    <div className="mt-auto pt-4 text-center">
                        {/* <Link href="/transactions" className="text-purple-500 hover:text-purple-400 text-sm">
                            View Detailed Analytics →
                        </Link> */}
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
            {editAccess ? (
                <EditSalary
                    isOpen={showEditBalanceModal}
                    onClose={() => setShowEditBalanceModal(false)}
                    onSubmit={handleBalanceUpdate}
                    currentBalance={stats.balance}
                    mode={stats.balance ? 'edit' : 'add'}
                />
            ) : (
                <EditSalary
                    isOpen={showAddBalanceModal}
                    onClose={() => setShowAddBalanceModal(false)}
                    onSubmit={handleBalanceUpdate}
                    currentBalance={stats.balance}
                    mode={'add'}
                />
            )}
        </div>
    );
};

export default Dashboard;