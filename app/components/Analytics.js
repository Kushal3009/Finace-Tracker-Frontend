'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
    const router = useRouter();
    const [currencySymbol, setCurrencySymbol] = useState('₹');

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            router.replace('/login');
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const currencyOptions = {
            INR: { name: 'Indian Rupee', symbol: '₹' },
            USD: { name: 'US Dollar', symbol: '$' },
            EUR: { name: 'Euro', symbol: '€' },
            GBP: { name: 'British Pound', symbol: '£' },
            JPY: { name: 'Japanese Yen', symbol: '¥' },
            CAD: { name: 'Canadian Dollar', symbol: 'C$' },
            AUD: { name: 'Australian Dollar', symbol: 'A$' },
            CNY: { name: 'Chinese Yuan', symbol: '¥' },
            RUB: { name: 'Russian Ruble', symbol: '₽' },
            BRL: { name: 'Brazilian Real', symbol: 'R$' },
            ZAR: { name: 'South African Rand', symbol: 'R' },
        };

        if (userInfo && userInfo.currency) {
            setCurrencySymbol(currencyOptions[userInfo.currency]?.symbol || userInfo.currency);
        }
    }, [router]);

    // Monthly spending data
    const monthlyData = [
        { month: 'Jan', expense: 2400, income: 4000 },
        { month: 'Feb', expense: 1398, income: 3000 },
        { month: 'Mar', expense: 9800, income: 2000 },
        { month: 'Apr', expense: 3908, income: 2780 },
        { month: 'May', expense: 4800, income: 1890 },
        { month: 'Jun', expense: 3800, income: 2390 },
    ];

    // Category breakdown data
    const categoryData = [
        { name: 'Housing', value: 1200, color: '#8B5CF6' },
        { name: 'Food', value: 500, color: '#EC4899' },
        { name: 'Transportation', value: 300, color: '#3B82F6' },
        { name: 'Entertainment', value: 200, color: '#10B981' },
        { name: 'Utilities', value: 150, color: '#F59E0B' },
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8 text-white">Financial Analytics</h1>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { title: 'Monthly Average Expense', value: `${currencySymbol}2,850`, change: '+12%', color: 'text-red-500' },
                    { title: 'Monthly Average Income', value: `${currencySymbol}5,200`, change: '+8%', color: 'text-green-500' },
                    { title: 'Net Savings', value: `${currencySymbol}2,350`, change: '+15%', color: 'text-blue-500' },
                ].map((item, index) => (
                    <div key={index} className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                        <h3 className="text-gray-400 mb-2">{item.title}</h3>
                        <p className="text-2xl font-bold text-white mb-2">{item.value}</p>
                        <p className={`${item.color}`}>{item.change} from last month</p>
                    </div>
                ))}
            </div>

            {/* Income vs Expense Chart */}
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700 mb-8">
                <h2 className="text-xl font-bold mb-6 text-white">Income vs Expenses</h2>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    color: '#fff'
                                }}
                            />
                            <Bar dataKey="income" fill="#10B981" name="Income" />
                            <Bar dataKey="expense" fill="#EF4444" name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-6 text-white">Spending by Category</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        color: '#fff'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Spending Insights */}
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-6 text-white">Financial Insights</h2>
                    <div className="space-y-4">
                        {[
                            { insight: 'Housing expenses are 40% of your monthly budget', trend: 'Higher than recommended (30%)', color: 'text-red-500' },
                            { insight: 'Your savings rate is 25% of income', trend: 'On track with your goal', color: 'text-green-500' },
                            { insight: 'Entertainment spending decreased by 15%', trend: 'Lower than last month', color: 'text-blue-500' },
                            { insight: 'You\'ve reached 80% of your savings goal', trend: `${currencySymbol}2,000 more to reach target`, color: 'text-purple-500' },
                        ].map((item, index) => (
                            <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                                <p className="text-white mb-1">{item.insight}</p>
                                <p className={`text-sm ${item.color}`}>{item.trend}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;