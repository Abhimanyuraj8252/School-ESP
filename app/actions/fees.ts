'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSupabase() {
    const cookieStore = await cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch { }
                },
            },
        }
    )
}

export async function getFeeSettings() {
    const supabase = await getSupabase()

    // Fetch settings for late fee
    const { data } = await supabase
        .from('settings')
        .select('*')
        .in('key', ['late_fee_amount', 'late_fee_interval'])

    const settings: any = {}
    data?.forEach(item => {
        settings[item.key] = item.value
    })

    return {
        amount: Number(settings.late_fee_amount) || 0,
        interval: Number(settings.late_fee_interval) || 30
    }
}

export async function collectFee(formData: any) {
    // formData: { studentId, totalAmount, paymentMode, heads: [{name, amount}], notes }
    const supabase = await getSupabase()

    // Status Logic: Cash = pending, Online = verified
    const status = formData.paymentMode === 'cash' || formData.paymentMode === 'cheque'
        ? 'pending'
        : 'verified'

    // Format description to include all heads
    // e.g. "Tuition: 500, Sports: 200, Late Fee: 50"
    const description = formData.heads
        .map((h: any) => `${h.name}: ${h.amount}`)
        .join(', ')

    const { error } = await supabase
        .from('transactions')
        .insert({
            student_id: formData.studentId,
            amount: formData.totalAmount,
            payment_mode: formData.paymentMode,
            description: description,
            status: status,
            // Storing full details in a 'metadata' column if it existed would be better, 
            // but for now relying on description string as per current schema.
        })

    if (error) return { error: error.message }

    revalidatePath('/office/fees')
    revalidatePath('/admin/finance')
    revalidatePath(`/office/students`)

    return { success: true }
}
