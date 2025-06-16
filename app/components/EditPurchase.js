'use client';

import React, { useState, useEffect } from 'react';
import { fetchCategory } from '../services/category';
import { updatePurchase } from '../services/purchase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { formatDateToInput } from '../services/utilitys';

const EditPurchase = ({ isOpen, onClose, onSubmit, purchase }) => {
    const [categories, setCategories] = useState([]);
    const [purchaseData, setPurchaseData] = useState({
        categoryId: purchase?.categoryId || '',
        purchaseName: purchase?.purchaseName || '',
        date: purchase?.date || new Date().toISOString().split('T')[0],
        price: purchase?.price || '',
        paymentType: purchase?.paymentType || ''
    });
    const router = useRouter();

    const paymentMethods = [
        'Cash',
        'Credit Card',
        'Debit Card',
        'UPI',
        'Bank Transfer'
    ];

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategory();
                setCategories(data);
            } catch (error) {
                if (error.status == 401) {
                    localStorage.removeItem('authToken');
                    router.push('/login');
                    return;
                }
                console.error('Failed to fetch categories:', error.message);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        if (purchase) {
            setPurchaseData({
                categoryId: purchase.categoryId || '',
                purchaseName: purchase.purchaseName || '',
                date: purchase.date || new Date().toISOString().split('T')[0],
                price: purchase.price || '',
                paymentType: purchase.paymentType || ''
            });
        }
    }, [purchase]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPurchaseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updatePurchase(purchase.id, purchaseData);
            toast.success('Purchase updated!');
            onSubmit && onSubmit();
            onClose();
        } catch (error) {
            toast.error(error.message || 'An error occurred while updating the purchase.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-white">Edit Purchase</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Category</label>
                        <select
                            name="categoryId"
                            value={purchaseData.categoryId}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Purchase Name</label>
                        <input
                            type="text"
                            name="purchaseName"
                            value={purchaseData.purchaseName}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            placeholder="Enter purchase name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formatDateToInput(purchaseData.date)}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={purchaseData.price}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            placeholder="Enter amount"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Payment Type</label>
                        <select
                            name="paymentType"
                            value={purchaseData.paymentType}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            required
                        >
                            <option value="">Select Payment Method</option>
                            {paymentMethods.map(method => (
                                <option key={method} value={method}>{method}</option>
                            ))}
                        </select>
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
                            Update Purchase
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPurchase;