'use client';

import { useEffect, useState } from "react";
import axios, { AxiosError } from 'axios';
import { useRouter } from "next/navigation";
import Navbar from "../../../Components/Navbar/Navbar";
import Footer from "../../../Components/Footer/Footer";

interface UserResponse {
    user: string | null;
    error: AxiosError | null;
}

async function getUser(): Promise<UserResponse> {
    try {
        const { data } = await axios.get('/api/cookie');

        return {
            user: data,
            error: null,
        }
    } catch (e) {
        const error = e as AxiosError;

        return {
            user: null,
            error
        };
    }
}

export default function dashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { user, error } = await getUser();

            if (error) {
                router.push('/login');
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
            <div className="sticky top-0 z-50">
                <Navbar />
                <hr />
            </div>
            {children}
            <Footer />
        </main>
    );
}