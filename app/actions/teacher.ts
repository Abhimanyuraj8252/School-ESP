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
export async function getStudentsByClass(className: string, section?: string) {
    const supabase = await getSupabase()

    // Assuming 'students' table has 'class' column. 
    // If 'students' table doesn't exist in your schema provided, 
    // I should check 'users' or 'student_profiles'.
    // Based on previous files, likely 'students' table or 'users' with role student.

    // Let's try 'students' table first as per typical schema
    let query = supabase
        .from('students')
        .select('*')
        .eq('class', className)
    
    if (section) {
        query = query.eq('section', section)
    }
    
    const { data, error } = await query.order('roll_no', { ascending: true })

    if (error) {
        console.error("Error fetching students:", error)
        return []
    }
    return data
}

// Get teacher's classes
export async function getTeacherClasses() {
    const supabase = await getSupabase()

    // Assuming teachers table or users with role teacher has assigned classes
    // This is a placeholder - adjust based on your actual schema
    const { data, error } = await supabase
        .from('teacher_classes')
        .select('id, class_name, section')
        .order('class_name', { ascending: true })

    if (error) {
        console.error("Error fetching teacher classes:", error)
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
