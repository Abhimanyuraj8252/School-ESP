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

export async function getStudentProfile() {
    const supabase = await getSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data } = await supabase.from('students').select('*').eq('user_id', user.id).single()

    if (!data) return {
        id: user.id,
        name: user.email?.split('@')[0] || "Student",
        class: "10",
        section: "A",
        roll_no: "123456",
        dob: "2008-01-01", // Default DOB if missing
        avatar: "",
        user_id: user.id
    }

    return data
}

export async function getStudentResults(studentId: string) {
    const supabase = await getSupabase()

    const { data, error } = await supabase
        .from('results')
        .select(`
            *,
            subjects ( name )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

    if (error) return []
    return data
}

export async function getFeeSummary(studentId: string) {
    const supabase = await getSupabase()

    // Get total paid
    const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('student_id', studentId)
        .eq('status', 'verified')

    const paid = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0

    // Mock Total Due for now - in real app, fetch from Fee Structure table
    const totalFee = 25000
    const due = totalFee - paid

    return {
        totalFee,
        paid,
        totalDue: due > 0 ? due : 0
    }
}

export async function getFeeTransactions(studentId: string) {
    const supabase = await getSupabase()

    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('student_id', studentId)
        .eq('status', 'verified')
        .order('created_at', { ascending: false })

    return transactions || []
}

export async function getStudentHomework(student: any) {
    const supabase = await getSupabase()

    // Fetch homework for student's class & section
    const { data } = await supabase
        .from('homework')
        .select('*, subjects(name)')
        .eq('class', student.class)
        .eq('section', student.section)
        .order('created_at', { ascending: false })

    return data || []
}

export async function getStudentAttendanceStats(studentId: string) {
    const supabase = await getSupabase()

    const { data } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', studentId)

    const total = data?.length || 0
    const present = data?.filter(a => a.status === 'Present').length || 0
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "100" // Default 100 if no data

    return {
        overall: percentage,
        present,
        total
    }
}

export async function getAdmitCardDetails(studentId: string) {
    const profile = await getStudentProfile()
    return profile
}

// Stats & Rank Logic
export async function getStudentStats(studentId: string) {
    const supabase = await getSupabase()

    // 1. Get Profile for Class info
    const { data: student } = await supabase
        .from('students')
        .select('class, section')
        .eq('id', studentId)
        .single()

    if (!student) return { rank: 0, totalStudents: 0, attendance: 85 } // Defaults

    // 2. Get Total Students in Class
    const { count: totalStudents } = await supabase
        .from('students')
        .select('id', { count: 'exact', head: true })
        .eq('class', student.class)
        .eq('section', student.section)

    // 3. Calculate Rank (Simplified: Based on total marks of all time? Or specific exam?)
    // Let's do it based on the most recent exam type found for this student
    // A proper implementation would need a specific 'exam_id' or 'term' to rank against.
    // For now, we will return a Mock Rank or simple logic if possible.

    // Real Rank Logic:
    // Fetch all marks for this class/section
    // Group by student, sum marks, sort desc, find index

    return {
        rank: 5, // Placeholder for now to ensure UI works, real implementation requires heavy aggregation
        // Ideally: `await calculateClassRank(student.class, student.section, studentId)`
        totalStudents: totalStudents || 40,
        attendance: 92 // Mock
    }
}

// Helper to update password is in auth-settings.ts
