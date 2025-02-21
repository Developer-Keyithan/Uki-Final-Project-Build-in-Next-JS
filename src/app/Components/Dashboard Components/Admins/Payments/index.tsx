'use client'

import Loader from '@/app/Components/Loader/Loader';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


interface TransactionType {
    _id: string;
    transactionId: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    amount: number;
    orderId: string;
    status: string;
}
const Index = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [transactions, setTransactions] = useState<TransactionType[] | null>(null);

    useEffect(() => {
        const findUser = async () => {
            setLoading(true);
            try {
                const transactinAPIReaponse = await axios.get("/api/transaction");
                if (transactinAPIReaponse.status === 200 && transactinAPIReaponse.data?.transactions) {
                    setTransactions(transactinAPIReaponse.data.transactions);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };
        findUser();
    }, [router]);

    if (loading) {
        return <Loader />;
    }
    return (
        <div className='my-8'>
            <table className='w-full rounded-lg overflow-hidden'>
                <thead className='w-full'>
                    <tr className='w-full bg-primaryColor'>
                        <th className='text-center font-semibold py-4 px-4 text-white border-r-[1px] border-gray-300'>No</th>
                        <th className='text-center font-semibold py-4 px-6 text-white border-r-[1px] border-gray-300'>User</th>
                        <th className='text-center font-semibold py-4 px-6 text-white border-r-[1px] border-gray-300'>Transaction ID</th>
                        <th className='text-center font-semibold py-4 px-6 text-white border-r-[1px] border-gray-300'>Payment</th>
                        <th className='text-center font-semibold py-4 px-6 text-white border-r-[1px] border-gray-300'>Order ID</th>
                        <th className='text-center font-semibold py-4 px-6 text-white'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions && transactions.map((transaction, idx) => (
                        <tr key={transaction._id} className='w-full border-b-[1px] border-gray-300 hover:bg-gray-100 transition ease-in-out duration-300'>
                            <td className="p-4 text-center  border-r-[1px]">{idx + 1}</td>
                            <td className="flex gap-8 items-center p-4">
                                <div className="flex items-center justify-center text-2xl font-semibold w-12 h-12 bg-primaryColor text-white p-2 rounded-full">
                                    {transaction.user.firstName[0].toUpperCase()}{transaction.user.lastName[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold uppercase">{`${transaction.user.firstName} ${transaction.user.lastName}`}</p>
                                    <p>{transaction.user.email || "<E-mail not provided>"}</p>
                                </div>
                            </td>
                            <td className='p-4 text-center'>{transaction.transactionId}</td>
                            <td className='p-4 text-center'>LKR {transaction.amount}</td>
                            <td className='p-4 text-center'>{transaction.orderId}</td>
                            <td className={`p-4 text-center font-semibold ${transaction.status === 'Paid' ? 'text-primaryColor' : transaction.status === 'Pending' ? 'text-orange-600' : 'text-red-700'}`}>{transaction.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Index