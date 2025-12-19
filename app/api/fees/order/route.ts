import { NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'

export async function POST(request: Request) {
    const { amount } = await request.json()

    // Create Order
    const options = {
        amount: amount * 100, // amount in paisa
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    }

    try {
        const order = await razorpay.orders.create(options)
        return NextResponse.json(order)
    } catch (error) {
        console.error("Error creating Razorpay order:", error)
        return NextResponse.json({ msg: 'Something went wrong' }, { status: 500 })
    }
}
