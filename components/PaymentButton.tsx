'use client'

import { useState } from 'react'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { createOrder, verifyPayment } from '@/app/actions/payment'
// uuid import removed

// Razorpay types
declare global {
    interface Window {
        Razorpay: any
    }
}

interface PaymentButtonProps {
    amount: number
    studentId: string // In a real app, this might come from context or props
    studentName?: string
    studentEmail?: string
    studentContact?: string
}

export function PaymentButton({ amount, studentId, studentName, studentEmail, studentContact }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false)

    const handlePayment = async () => {
        setLoading(true)

        // 1. Create Order
        const { orderId, error } = await createOrder(amount, studentId)

        if (error || !orderId) {
            alert('Failed to initiate payment')
            setLoading(false)
            return
        }

        // 2. Open Razorpay
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key here
            amount: amount * 100,
            currency: 'INR',
            name: 'School ESP',
            description: 'Fee Payment',
            order_id: orderId,
            handler: async function (response: any) {
                // 3. Verify Payment
                const verification = await verifyPayment(
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature
                )

                if (verification.success) {
                    alert('Payment Successful!')
                    window.location.reload()
                } else {
                    alert('Payment verification failed: ' + verification.error)
                }
            },
            prefill: {
                name: studentName,
                email: studentEmail,
                contact: studentContact,
            },
            theme: {
                color: '#3399cc',
            },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
        setLoading(false)
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <Button onClick={handlePayment} disabled={loading}>
                {loading ? 'Processing...' : `Pay ₹${amount}`}
            </Button>
        </>
    )
}
