'use client';

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';

interface UserResponse {
    id: string | null;
    userType: string | null;
    error: AxiosError | null;
}

interface UserDataResponse {
    user: any; // Replace with the actual user data type
    error: AxiosError | null;
}

interface SellerProductsResponse {
    products: any[]; // Replace with the actual product data type
    error: AxiosError | null;
}

interface SellerInfoResponse {
    sellerInfo: any; // Replace with the actual seller data type
    error: AxiosError | null;
}

// Fetch user info from /api/cookie
async function getUser(): Promise<UserResponse> {
    try {
        const { data } = await axios.get('/api/cookie');
        return {
            id: data.user.id,
            userType: data.user.userType,
            error: null,
        };
    } catch (e) {
        const error = e as AxiosError;
        return {
            id: null,
            userType: null,
            error,
        };
    }
}

// Fetch user data from /api/user/get-user-by-id
async function getUserData(id: string): Promise<UserDataResponse> {
    try {
        const { data } = await axios.get(`/api/user/get-user?id=${id}`);
        return { user: data, error: null };
    } catch (e) {
        const error = e as AxiosError;
        return { user: null, error };
    }
}

// Fetch products from /api/products/get-products-by-userId
async function getSellerProducts(id: string): Promise<SellerProductsResponse> {
    try {
        const { data } = await axios.get(`/api/product/get-products-by-user-id?id=${id}`);
        return { products: data, error: null };
    } catch (e) {
        const error = e as AxiosError;
        return { products: [], error };
    }
}

// Fetch seller info from /api/seller/get-by/user-id
async function getSellerInfo(id: string): Promise<SellerInfoResponse> {
    try {
        const { data } = await axios.get(`/api/seller/get-by-user-id?id=${id}`);
        return { sellerInfo: data, error: null };
    } catch (e) {
        const error = e as AxiosError;
        return { sellerInfo: null, error };
    }
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [userData, setUserData] = useState<any>(null); // Landing page data
    const [sellerProducts, setSellerProducts] = useState<any[]>([]); // Seller dashboard data
    const [sellerInfo, setSellerInfo] = useState<any>(null); // Seller-specific info
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { id, userType, error } = await getUser();

            // if (error || !id || !userType) {
            //     router.push('/');
            //     return;
            // }

            if (userType === 'seller') {
                // Fetching all seller-specific data in parallel
                // const [userDataRes, productsRes, sellerInfoRes] = await Promise.all([
                //     getUserData(id),
                //     getSellerProducts(id),
                //     getSellerInfo(id),
                // ]);

                // Handle errors if any
                // if (userDataRes.error || productsRes.error || sellerInfoRes.error) {
                //     router.push('/');
                //     return;
                // }

                // Set the fetched data into the state
                // setUserData(userDataRes.user);
                // setSellerProducts(productsRes.products);
                // setSellerInfo(sellerInfoRes.sellerInfo);

                // Navigate to the seller dashboard
                router.push('/dashboard');
            } 
            // else {
            //     // Fetch user data for non-sellers
            //     const { user, error: userError } = await getUserData(id);
            //     if (userError) {
            //         router.push('/');
            //         return;
            //     }
            //     setUserData(user);
            //     router.push('/');
            // }

            if (userType === 'consumer') {
                router.push('/dashboard')
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
