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

// Fetch students for a specific class (to populate the list)
export async function getStudentsByClass(className: string) {
    const supabase = await getSupabase()

    // Assuming 'students' table has 'class' column. 
    // If 'students' table doesn't exist in your schema provided, 
    // I should check 'users' or 'student_profiles'.
    // Based on previous files, likely 'students' table or 'users' with role student.

    // Let's try 'students' table first as per typical schema
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class', className)
        .order('roll_no', { ascending: true })

    if (error) {
        console.error("Error fetching students:", error)
        return []
    }
    return data
}

// Upload Result Logic
export async function uploadStudentResult(
    studentId: string,
    subjectId: string,
    examType: string,
    marks: number,
    maxMarks: number,
    copyUrl: string
) {
    const supabase = await getSupabase()

    // Check if result already exists (Update vs Insert)
    const { data: existing } = await supabase
        .from('results')
        .select('id')
        .eq('student_id', studentId)
        .eq('subject_id', subjectId)
        .eq('exam_type', examType)
        .single()

    if (existing) {
        // Update
        const { error } = await supabase
            .from('results')
            .update({
                marks_obtained: marks,
                max_marks: maxMarks,
                copy_url: copyUrl
            })
            .eq('id', existing.id)

        if (error) return { error: error.message }
    } else {
        // Insert
        const { error } = await supabase
            .from('results')
            .insert({
                student_id: studentId,
                subject_id: subjectId,
                exam_type: examType,
                marks_obtained: marks,
                max_marks: maxMarks,
                copy_url: copyUrl
            })

        if (error) return { error: error.message }
    }

    revalidatePath('/teacher/dashboard/results')
    return { success: true }
}
