'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Signup from '../components/Signup';

const SignupPage = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            router.replace('/');
        }
    }, [router]);

    return (
        <div>
            <Signup />
        </div>
    );
};

export default SignupPage;
