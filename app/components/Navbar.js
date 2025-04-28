'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, ChartBar, Wallet, PieChart, Settings, LogOut, User } from 'lucide-react';
import ProfileModal from './ProfileModal';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check authentication status on mount and after any auth changes
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            setIsAuthenticated(!!token);
            setIsLoading(false);
        };

        // Initial check
        checkAuth();

        // Listen for auth changes
        window.addEventListener('authChange', checkAuth);

        return () => {
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('authChange'));
        router.push('/login');
    };

    // Don't render anything while checking authentication
    if (isLoading) return null;

    // Don't render navbar for unauthenticated users
    if (!isAuthenticated) return null;

    return (
        <nav className="bg-black/40 backdrop-blur-sm p-4 border-b border-gray-700 text-white sticky top-0 z-50">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            FinanceTracker
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-gray-300 hover:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="flex items-center space-x-1 hover:text-purple-500 transition">
                            <ChartBar size={20} />
                            <span>Dashboard</span>
                        </Link>
                        <Link href="/transactions" className="flex items-center space-x-1 hover:text-purple-500 transition">
                            <Wallet size={20} />
                            <span>Transactions</span>
                        </Link>
                        <Link href="/analytics" className="flex items-center space-x-1 hover:text-purple-500 transition">
                            <PieChart size={20} />
                            <span>Analytics</span>
                        </Link>
                        <div className="flex items-center space-x-4 border-l pl-4 border-gray-700">
                            <button
                                onClick={() => setShowProfileModal(true)}
                                className="hover:text-purple-500 transition"
                                aria-label="Profile"
                            >
                                <User size={20} />
                            </button>
                            <Link href="/settings" className="hover:text-purple-500 transition">
                                <Settings size={20} />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hover:text-purple-500 transition"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
                    <div className="flex flex-col space-y-3">
                        <Link href="/dashboard" className="flex items-center space-x-2 hover:text-purple-500 transition p-2">
                            <ChartBar size={20} />
                            <span>Dashboard</span>
                        </Link>
                        <Link href="/transactions" className="flex items-center space-x-2 hover:text-purple-500 transition p-2">
                            <Wallet size={20} />
                            <span>Transactions</span>
                        </Link>
                        <Link href="/analytics" className="flex items-center space-x-2 hover:text-purple-500 transition p-2">
                            <PieChart size={20} />
                            <span>Analytics</span>
                        </Link>
                        <div className="border-t border-gray-700 pt-3">
                            <button
                                onClick={() => setShowProfileModal(true)}
                                className="flex items-center space-x-2 hover:text-purple-500 transition p-2 w-full"
                            >
                                <User size={20} />
                                <span>Profile</span>
                            </button>
                            <Link href="/settings" className="flex items-center space-x-2 hover:text-purple-500 transition p-2">
                                <Settings size={20} />
                                <span>Settings</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 hover:text-purple-500 transition p-2 w-full"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
        </nav>
    );
};

export default Navbar;
