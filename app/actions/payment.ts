'use server'

import Razorpay from 'razorpay'
import crypto from 'crypto'
import { createClient } from '@/utils/supabase/server'

import { razorpay } from '@/lib/razorpay'
import { generateAndUploadReceipt } from '@/app/actions/pdf-service'

export async function createOrder(amount: number, studentId: string) {
    const options = {
        amount: amount * 100, // amount in paisa
        currency: 'INR',
        receipt: `receipt_${Date.now()}_${studentId.substring(0, 5)}`,
    }

    try {
        const order = await razorpay.orders.create(options)
        return { orderId: order.id, amount: order.amount, currency: order.currency }
    } catch (error) {
        console.error('Error creating Razorpay order:', error)
        return { error: 'Failed to create payment order' }
    }
}

export async function verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
) {
    const supabase = await createClient()

    // 1. Get authenticated user and student profile
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('student_profiles')
        .select('id, name, class, section')
        .eq('user_id', user.id)
        .single()

    if (!profile) return { success: false, error: 'Student profile not found' }
    const studentId = profile.id

    // 2. Verify Signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex')

    if (expectedSignature !== razorpay_signature) {
        return { success: false, error: 'Invalid signature' }
    }

    // 3. Fetch Order to get trusted amount
    let amount = 0
    try {
        const order = await razorpay.orders.fetch(razorpay_order_id)
        amount = Number(order.amount) / 100 // Convert from paisa to Rupee
    } catch (e) {
        console.error('Error fetching Razorpay order:', e)
        return { success: false, error: 'Could not verify payment amount' }
    }

    // 4. Update Database
    // Log transaction initially without receipt
    const { data: txData, error: txError } = await supabase.from('transactions').insert({
        student_id: studentId,
        amount: amount,
        mode: 'online',
        status: 'success',
        verified_by_admin: true,
        receipt_url: `razorpay:${razorpay_payment_id}`, // temporary or fallback
    }).select('id, created_at').single()

    if (txError || !txData) {
        console.error('DB Error logging transaction:', txError)
        return { success: false, error: 'Payment verified but DB update failed' }
    }

    // 5. Generate Receipt PDF
    const receiptUrl = await generateAndUploadReceipt({
        transactionId: txData.id,
        date: new Date(txData.created_at).toLocaleDateString(),
        amount: amount,
        studentName: profile.name,
        class: profile.class,
        section: profile.section,
        paymentMode: 'online',
        description: `Razorpay Ref: ${razorpay_payment_id}`
    })

    if (receiptUrl) {
        await supabase.from('transactions').update({ receipt_url: receiptUrl }).eq('id', txData.id)
    }

    // Update fee ledger
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const { error: ledgerError } = await supabase.from('fee_ledger').insert({
        student_id: studentId,
        credit: amount,
        debit: 0,
        balance: 0, // Should be calculated
        month: currentMonth,
        year: currentYear
    })

    if (ledgerError) {
        console.error('DB Error updating ledger:', ledgerError)
    }

    return { success: true }
}
