'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from '../components/Login';

const LoginPage = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            router.replace('/');
        }
    }, [router]);

    return <Login />;
};

export default LoginPage;
