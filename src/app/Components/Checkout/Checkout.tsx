'use client'

import React, { useEffect, useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import ConvertToSubcurrency from "../../lib/ConvertToSubcurrency"

const Checkout = ({ finalAmount, orderId, userId }: { finalAmount: number, orderId: string, userId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const amount = Number((finalAmount / 296.73).toFixed(2));

  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetch('/api/transaction/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: ConvertToSubcurrency(amount) })
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message)
      setLoading(false)
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/success?amount=${finalAmount}&orderId=${orderId}&userId=${userId}`
      }
    });

    if (error) {
      setErrorMessage(error.message)
    }

    setLoading(false)
  }

  if (!clientSecret || !stripe || !elements) {
    return (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading...
      </span>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md">
      {clientSecret && <PaymentElement />}
      {errorMessage && <div>{errorMessage}</div>}
      <button
        disabled={!stripe || loading}
        className="bg-primaryColor w-full py-2 rounded mt-4 font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-pulse"
      >
        {loading ? "Processing..." : `Pay LKR ${finalAmount}`}
      </button>
    </form>
  )
}

export default Checkout