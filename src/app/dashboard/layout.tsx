'use client';
import { useEffect, useState } from "react";
import axios, { AxiosError } from 'axios';
import { useRouter } from "next/navigation";

interface UserResponse {
    user: {
        userType: string;
    } | null;
    error: AxiosError | null;
}

async function getUser(): Promise<UserResponse> {
    try {
        const { data } = await axios.get('/api/cookie');
        return {
            user: data.user,
            error: null,
        };
    } catch (e) {
        const error = e as AxiosError;
        return {
            user: null,
            error,
        };
    }
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { user, error } = await getUser();

            if (error || !user) {
                router.push('/login');
                return;
            }

            switch (user.userType) {
                case 'consumer':
                    router.push('/dashboard');
                    break;
                case 'admin':
                    router.push('/dashboard/admin');
                    break;
                case 'seller':
                    router.push('/dashboard/seller');
                    break;
                case 'super-admin':
                    router.push('/dashboard/super-admin');
                    break;
                case 'delivery-partner':
                    router.push('/dashboard/delivery-partner');
                    break;
                default:
                    router.push('/');
                    return;
            }

            setIsSuccess(true);
        })();
    }, [router]);

    if (!isSuccess) {
        return <p className="mx-auto my-auto">Loading...</p>;
    }

    return (
        <main>
            {children}
        </main>
    );
}