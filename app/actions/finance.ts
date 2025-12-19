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

export async function getPendingTransactions() {
    const supabase = await getSupabase()

    // Fetch transactions with status 'pending' (mostly Cash)
    // We also want student details, so we join. 
    // If 'students' table exists, we join it. For now, assuming direct name fetch or join.
    // Since we used 'student_id' as text (e.g. STU-001) in skeleton, we might need to lookup.
    // For this implementation, I will just fetch transactions and let the UI handle display if name is embedded or use student_id.

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    if (error) return []
    return data
}

export async function verifyTransaction(transactionId: string) {
    const supabase = await getSupabase()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('transactions')
        .update({
            status: 'verified',
            verified_by: user.id
        })
        .eq('id', transactionId)

    if (error) return { error: error.message }

    revalidatePath('/admin/finance')
    return { success: true }
}

export async function revokeTransaction(transactionId: string) {
    const supabase = await getSupabase()

    const { error } = await supabase
        .from('transactions')
        .update({ status: 'revoked' })
        .eq('id', transactionId)

    if (error) return { error: error.message }

    revalidatePath('/admin/finance')
    return { success: true }
}

export async function getDailyStats() {
    const supabase = await getSupabase()
    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
        .from('transactions')
        .select('amount, status, payment_mode')
        .gte('created_at', today) // Simplistic "Today" check (UTC might skew, but okay for demo)

    let totalCollected = 0
    let cashPending = 0
    let onlineVerified = 0

    data?.forEach(t => {
        if (t.status === 'verified') totalCollected += Number(t.amount)
        if (t.status === 'pending' && t.payment_mode === 'cash') cashPending += Number(t.amount)
    })

    return { totalCollected, cashPending }
}
