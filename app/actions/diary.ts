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
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                    } catch { }
                },
            },
        }
    )
}

// --- HOMEWORK ACTIONS ---

export async function assignHomework(
    className: string,
    section: string,
    subjectId: string,
    title: string,
    description: string,
    dueDate: string
) {
    const supabase = await getSupabase()

    const { data, error } = await supabase
        .from('homework')
        .insert({
            class: className,
            section,
            subject_id: subjectId,
            title,
            description,
            due_date: dueDate
        })
        .select()

    if (error) return { error: error.message }

    revalidatePath('/student/dashboard') // Refresh student view
    return { success: true }
}

export async function getHomeworkForTeacher(className: string, section: string) {
    const supabase = await getSupabase()

    const { data } = await supabase
        .from('homework')
        .select('*, subjects(name)')
        .eq('class', className)
        .eq('section', section)
        .order('created_at', { ascending: false })

    return data || []
}


// --- ATTENDANCE ACTIONS ---

export async function submitAttendance(records: { student_id: string, date: string, status: string }[]) {
    const supabase = await getSupabase()

    // Upsert to handle updates if marked twice for same day
    const { error } = await supabase
        .from('attendance')
        .upsert(records, { onConflict: 'student_id, date' })

    if (error) return { error: error.message }
    return { success: true }
}

export async function getAttendanceByDate(className: string, section: string, date: string) {
    const supabase = await getSupabase()

    // 1. Get Students of this class
    const { data: students } = await supabase
        .from('students')
        .select('id, name, roll_no')
        .eq('class', className)
        .eq('section', section)
        .order('roll_no', { ascending: true })

    if (!students) return []

    // 2. Get today's attendance records
    const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', date)
        .in('student_id', students.map(s => s.id))

    // 3. Merge status
    return students.map(st => {
        const record = attendance?.find(a => a.student_id === st.id)
        return {
            ...st,
            status: record?.status || 'Present' // Default to Present
        }
    })
}
