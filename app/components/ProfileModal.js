import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchUserDetails, updateUserDetails } from '../services/login';
import { useCurrency } from './CurrencyContext';

const currencies = [
    'INR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'RUB', 'BRL', 'ZAR'
];

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

const ProfileModal = ({ isOpen, onClose }) => {
    const [user, setUser] = useState({ username: '', email: '', currency_type: 'INR' });
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(user);
    const { updateCurrency } = useCurrency();

    useEffect(() => {
        if (isOpen) {
            (async () => {
                try {
                    const userDetails = await fetchUserDetails();
                    setUser(userDetails);
                    setForm(userDetails); // Ensure userDetails contains currency_type
                } catch (error) {
                    toast.error(error.message || 'Failed to fetch user details');
                }
            })();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const updatedForm = {
                ...form,
                currency_type: currencyOptions[form.currency_type]?.symbol || form.currency_type
            };
            const updatedUser = await updateUserDetails(updatedForm);
            setUser({
                username: updatedUser?.username || updatedForm.username,
                email: updatedUser?.email || updatedForm.email,
                currency: updatedUser?.currency || updatedForm.currency,
                currency_type: updatedUser?.currency_type || updatedForm.currency_type,
            });
            // Update global currency context
            updateCurrency(updatedUser?.currency || updatedForm.currency, updatedUser?.currency_type || updatedForm.currency_type);
            setEditMode(false);
            toast.success('Profile updated!');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm h-screen">
            <div className="bg-black/90 border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md relative flex flex-col items-center justify-center mx-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
                    aria-label="Close"
                >
                    ×
                </button>
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-bold text-white mb-3">
                        {user.username ? user.username[0].toUpperCase() : 'U'}
                    </div>
                    {!editMode ? (
                        <>
                            <h2 className="text-2xl font-bold mb-1 text-white">{user.username || 'User'}</h2>
                            <p className="text-gray-400 text-base mb-1">{user.email}</p>
                            <span className="inline-block px-3 py-1 text-xs bg-purple-700/60 rounded text-purple-100 mb-2">
                                Currency: {currencyOptions[user.currency_type]?.name || user.currency_type}
                            </span>
                            <button
                                onClick={() => setEditMode(true)}
                                className="mt-2 px-5 py-2 bg-purple-500 hover:bg-purple-700 text-white rounded-lg transition font-semibold"
                            >Edit Profile</button>
                        </>
                    ) : (
                        <form className="w-full flex flex-col items-center" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-purple-500 text-lg"
                                placeholder="Username"
                                required
                            />
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                disabled
                                className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-purple-500 text-lg opacity-60 cursor-not-allowed"
                                placeholder="Email"
                            />
                            <select
                                name="currency_type"
                                value={form.currency_type}
                                onChange={handleChange}
                                className="w-full mb-3 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-purple-500 text-lg"
                                required
                            >
                                {currencies.map(cur => (
                                    <option key={cur} value={cur}>
                                        {currencyOptions[cur]?.name || cur}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-4 mt-2">
                                <button
                                    type="button"
                                    onClick={() => { setEditMode(false); setForm(user); }}
                                    className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold"
                                >Cancel</button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-purple-500 hover:bg-purple-700 text-white rounded-lg font-semibold"
                                >Save</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
