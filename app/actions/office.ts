'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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

export async function searchStudentsGlobal(query: string) {
    const supabase = await getSupabase()

    // Search in students table (or users)
    const { data } = await supabase
        .from('students')
        .select('*')
        .or(`name.ilike.%${query}%,roll_no.ilike.%${query}%`)
        .limit(10)

    if (!data) return []
    return data
}

export async function getStudentFullDetails(studentId: string) {
    const supabase = await getSupabase()

    // 1. Profile
    const { data: profile } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single()

    if (!profile) return null

    // 2. Fees (Transactions)
    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('student_id', studentId) // Assuming studentId matches
        .order('created_at', { ascending: false })

    // 3. Results
    const { data: results } = await supabase
        .from('results')
        .select(`*, subjects(name)`)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

    return { profile, transactions, results }
}

export async function createStudentProfile(data: any) {
    const supabase = await getSupabase()

    // 1. Create Profile in 'students' table
    // Note: In a real app, you might create a 'user' in auth first, but for now we just create the record.
    const { error } = await supabase
        .from('students')
        .insert({
            name: data.fullName,
            class: data.class,
            section: 'A', // Default to A, or add to form
            roll_no: `TEMP-${Date.now()}`, // Generate temp roll no
            dob: data.dob,
            address: data.address,
            contact_no: data.phone,
            email: data.email,
            parent_name: data.parentName
        })

    if (error) {
        console.error("Error creating student:", error)
        return { success: false, error: error.message }
    }

    return { success: true }
}
