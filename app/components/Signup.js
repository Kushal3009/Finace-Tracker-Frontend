'use client'

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Optional: use any icon library or plain text
import Link from 'next/link';
import { handleSignup } from '../services/signup';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [currency, setCurrency] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await handleSignup({ username, email, password, currency });

            if (data.status === "success") {
                console.log('Sign Up attempt:', data);
                toast.success("Sign Up Successful");
                router.push('/login');
            }
        } catch (error) {
            toast.error(error.message)
            console.error('Sign Up error:', error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden px-2">
            <div className="absolute top-1/2 right-4 md:right-20 w-40 h-40 md:w-64 md:h-64 rounded-full bg-purple-800 blur-xl opacity-50"></div>
            <div className="absolute bottom-10 right-10 md:right-40 w-20 h-20 md:w-32 md:h-32 rounded-full bg-purple-700 blur-xl opacity-30"></div>

            <div className="w-full max-w-5xl px-0 md:px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
                <div className="flex-1 text-white pr-0 md:pr-8 max-w-xs md:max-w-md mb-8 md:mb-0 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 whitespace-nowrap">Create Your Account</h1>
                    <button className="px-2 md:px-6 py-2 inline-block text-sm md:text-base">
                        Gain full control over your finances and productivity. It's quick and easy to get started!
                    </button>
                </div>

                <div className="flex-1 w-full max-w-xs md:max-w-md">
                    <div className="bg-black/40 backdrop-blur-sm p-4 md:p-8 rounded-lg border border-gray-700 text-white">
                        <div className="mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-center">Sign Up</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="username"
                                    className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-white text-sm md:text-base"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-white text-sm md:text-base"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <select
                                    className="w-full bg-black border border-gray-600 rounded-md p-2 text-white text-sm md:text-base"
                                    value={currency}
                                    onChange={e => setCurrency(e.target.value)}
                                    required
                                >
                                    <option value="">Select Currency</option>
                                    {Object.entries(currencyOptions).map(([code, obj]) => (
                                        <option key={code} value={obj.symbol}>{obj.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4 relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-white pr-10 text-sm md:text-base"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:bg-gradient-to-l transition duration-300 ease-in-out cursor-pointer text-sm md:text-base"
                            >
                                Sign Up
                            </button>

                            <div className="mt-6 text-center">
                                <div className="flex items-center justify-center">
                                    <div className="border-t border-gray-700 flex-1"></div>
                                    <span className="mx-4 text-gray-400 text-sm">or</span>
                                    <div className="border-t border-gray-700 flex-1"></div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-300">
                                    Already have an account? <Link href="/login" className="text-white">Login</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
