'use client';

import React, { useState, useEffect } from 'react';
import { addSalary, updateSalary } from '../services/dashboard';
import toast from 'react-hot-toast';
import { useCurrency } from './CurrencyContext';

const EditSalary = ({ isOpen, onClose, onSubmit, currentBalance, mode }) => {
    const [balance, setBalance] = useState(currentBalance);
    const { setHasSalary } = useCurrency();
    console.log("mode", mode)
    useEffect(() => {
        setBalance(currentBalance);
    }, [currentBalance]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === 'add') {
                if (Number(balance) === 0) {
                    toast.error('Balance cannot be zero');
                    return;
                }
                await addSalary({ salary: Number(balance) });
            } else if (mode === 'edit') {
                await updateSalary({ salary: Number(balance) });
            }
            setHasSalary(true);
            onSubmit({ amount: Number(balance) });
            onClose();
        } catch (err) {
            console.error('Error updating salary:', err);
            toast.error('Failed to update salary');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-white">
                    {mode === 'add' ? 'Add Monthly Salary' : 'Update Monthly Salary'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Balance Amount</label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                value={balance === 0 ? (typeof balance === 'string' ? balance : '') : balance}
                                onChange={(e) => {
                                    let val = e.target.value;
                                    if (val.length > 1 && val.startsWith('0') && !val.startsWith('0.')) {
                                        val = val.replace(/^0+/, '');
                                    }
                                    setBalance(val);
                                }}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 custom-number-input"
                                placeholder="Enter new balance"
                                step="0.01"
                                inputMode="decimal"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                        >
                            {mode === 'add' ? 'Add' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSalary;
