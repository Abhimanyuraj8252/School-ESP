import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/utils/supabase/server'
import { generateReceipt } from '@/utils/receiptGenerator'

export async function POST(request: Request) {
    const { orderCreationId, razorpayPaymentId, razorpaySignature, amount, studentId, feeDescription } = await request.json()

    // Verify Signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`)
    const digest = shasum.digest('hex')

    if (digest !== razorpaySignature) {
        return NextResponse.json({ msg: 'Transaction not legit!' }, { status: 400 })
    }

    try {
        const supabase = await createClient()

        // 1. Generate PDF
        const transaction = { 
            id: razorpayPaymentId, 
            order_id: orderCreationId, 
            amount, 
            description: feeDescription 
        }
        const student = { 
            id: studentId, 
            name: "Student Name", // You may want to fetch actual student details
            class: "Class", 
            roll: "Roll" 
        }
        const pdfBuffer = await generateReceipt(transaction, student)

        // 2. Upload to Supabase Storage
        const fileName = `receipts/${studentId}-${razorpayPaymentId}.pdf`
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('receipts')
            .upload(fileName, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: true
            })

        let receiptUrl = ""
        if (uploadError) {
            console.error("Storage Upload Error:", uploadError)
        } else {
            const { data: publicUrlData } = supabase.storage.from('receipts').getPublicUrl(fileName)
            receiptUrl = publicUrlData.publicUrl
        }

        // 3. Record Transaction
        const { error: txtError } = await supabase.from('transactions').insert({
            transaction_id: razorpayPaymentId,
            order_id: orderCreationId,
            student_id: studentId,
            amount: amount,
            status: 'success',
            payment_method: 'razorpay',
            receipt_url: receiptUrl,
            created_at: new Date().toISOString()
        })

        if (txtError) console.error("DB Insert Error:", txtError)

        return NextResponse.json({
            msg: 'success',
            orderId: razorpayPaymentId,
            paymentId: razorpayPaymentId,
            receiptUrl: receiptUrl
        })
    } catch (error) {
        console.error("Verification Handler Error:", error)
        return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 })
    }
}
