'use client'

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Optional: use any icon library or plain text
import Link from 'next/link';
import { handleLogin } from '../services/login';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 👈 New state
    const router = useRouter();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await handleLogin({ email, password });
            if (data.data) {
                toast.success('Login successful');
            }
            const token = data.data.token;
            const currency = data.data.currency_type || '₹';
            localStorage.setItem('authToken', token);
            // Save currency in userInfo for global access
            const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
            userInfo.currency = currency;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            router.push('/');
        } catch (error) {
            toast.error(error.message)
            console.error('Login error:', error.message);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden px-2">
            <div className="absolute top-1/2 right-4 md:right-20 w-40 h-40 md:w-64 md:h-64 rounded-full bg-purple-800 blur-xl opacity-50"></div>
            <div className="absolute bottom-10 right-10 md:right-40 w-20 h-20 md:w-32 md:h-32 rounded-full bg-purple-700 blur-xl opacity-30"></div>

            <div className="w-full max-w-5xl px-0 md:px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
                <div className="flex-1 text-white pr-0 md:pr-8 max-w-xs md:max-w-md mb-8 md:mb-0 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome Back.!</h1>
                    <button className="px-2 md:px-6 py-2 inline-block text-sm md:text-base">
                        Seamlessly track your finances and manage tasks — all in one unified platform.
                    </button>
                </div>

                <div className="flex-1 w-full max-w-xs md:max-w-md">
                    <div className="bg-black/40 backdrop-blur-sm p-4 md:p-8 rounded-lg border border-gray-700 text-white">
                        <div className="mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-center">Login</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-white text-sm md:text-base"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
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

                            <div className="mb-6 flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="mr-2"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                <label htmlFor="remember" className="text-sm text-gray-300">Remember me</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:bg-gradient-to-l transition duration-300 ease-in-out cursor-pointer text-sm md:text-base"
                            >
                                Login
                            </button>
                            <div className="text-center mt-4">
                                <a href="#" className="text-sm text-gray-300">Forgot password?</a>
                            </div>

                            <div className="mt-6 text-center">
                                <div className="flex items-center justify-center">
                                    <div className="border-t border-gray-700 flex-1"></div>
                                    <span className="mx-4 text-gray-400 text-sm">or</span>
                                    <div className="border-t border-gray-700 flex-1"></div>
                                </div>

                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-300">
                                    Don't Have an Account? <Link href="/signup" className="text-white">Sign Up</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
