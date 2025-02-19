"use client"

import Checkout from "../../../Components/Checkout/Checkout"
import ConvertToSubcurrency from "../../../lib/ConvertToSubcurrency"
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from "@stripe/stripe-js"
import '../../app/globals.css'
import Navbar from "../../../Components/Navbar/Navbar"
import Footer from "../../../Components/Footer/Footer"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { useEffect } from "react"

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    console.error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

const Payment = () => {
    const searchParams = useSearchParams();
    const amount = Number(searchParams.get("a"));
    const router = useRouter();

    console.log(amount);

    useEffect(() => {
        const fetchData = async () => {
            const cookieResponse = await axios.get('/api/cookie')
            if (cookieResponse.status !== 200) {
                router.push('/')
            }
        }
        fetchData()
    }, [])

    if (amount <= 0) {
        return <div>Error: Invalid amount</div>;
    }

    return (
        <div>
            <div className="sticky top-0">
                <Navbar />
                <hr />
            </div>
            <div className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-primaryColor to-primaryButtonColor">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold mb-2">Keyithan</h1>
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
                    <Checkout finalAmount={amount} />
                </Elements>
            </div>
            <Footer />
        </div>
    )
}

export default Payment
