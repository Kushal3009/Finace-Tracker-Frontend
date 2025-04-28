'use client';

import React, { useState } from 'react';

const EditSalary = ({ isOpen, onClose, onSubmit, currentBalance }) => {
    const [balance, setBalance] = useState(currentBalance || 0);
    const [currency, setCurrency] = useState('USD');

    const currencies = [
        { code: 'USD', symbol: '$' },
        { code: 'EUR', symbol: '€' },
        { code: 'GBP', symbol: '£' },
        { code: 'JPY', symbol: '¥' },
        { code: 'INR', symbol: '₹' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ amount: balance, currency });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-white">Update Monthly Salary</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Balance Amount</label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                value={balance}
                                onChange={(e) => setBalance(Number(e.target.value))}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 custom-number-input"
                                placeholder="Enter new balance"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                        >
                            Save Balance
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSalary;
