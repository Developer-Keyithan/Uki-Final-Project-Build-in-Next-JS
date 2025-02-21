"use client"

import Checkout from "../../app/Components/Checkout/Checkout"
import ConvertToSubcurrency from "../../app/lib/ConvertToSubcurrency"
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from "@stripe/stripe-js"
import '../../app/globals.css'
import Navbar from "../../app/Components/Navbar/Navbar"
import Footer from "../../app/Components/Footer/Footer"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { useEffect, useState } from "react"

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    console.error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
}

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
    : Promise.reject(new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined"));

const Payment = () => {
    const searchParams = useSearchParams();
    const amount = searchParams ? Number(searchParams.get("a")) : 0;
    const orderId = searchParams ? String(searchParams.get("o")) : '';
    const userId = searchParams ? String(searchParams.get("u")) : '';
    const router = useRouter();
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')

    console.log(amount);

    useEffect(() => {
        const fetchData = async () => {
            const cookieResponse = await axios.get('/api/cookie')
            if (cookieResponse.status !== 200) {
                router.push('/')
            }

            if (cookieResponse.status === 200 && cookieResponse.data.user.id) {
                const userApiResponse = await axios.post('/api/user/get-user', {
                    userId: cookieResponse.data.user.id
                })
                setFirstName(userApiResponse.data.user.firstName)
                setLastName(userApiResponse.data.user.lastName)
            }
        }
        fetchData()
    }, [router])

    if (amount <= 0) {
        return <div>Error: Invalid amount</div>;
    }

    return (
        <div>
            <div className="sticky top-0 z-50">
                <Navbar />
                <hr />
            </div>
            <div className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-primaryColor to-primaryButtonColor">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold mb-2">{firstName} {lastName}</h1>
                    <h2 className="text-2xl">
                        to pay
                        <span className="font-bold"> LKR {amount}</span>
                    </h2>
                </div>
                <Elements
                    stripe={stripePromise}
                    options={{
                        mode: 'payment',
                        amount: ConvertToSubcurrency(amount),
                        currency: 'usd'
                    }}
                >
                    <Checkout finalAmount={amount} orderId={orderId} userId={userId} />
                </Elements>
            </div>
            <Footer />
        </div>
    )
}

export default Payment
