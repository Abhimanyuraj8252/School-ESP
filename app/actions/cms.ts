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

// --- CMS: NOTICES ---

export async function createNotice(title: string, content: string, isPublic: boolean) {
    const supabase = await getSupabase()

    const { error } = await supabase
        .from('notices')
        .insert({ title, content, is_public: isPublic })

    if (error) return { error: error.message }

    revalidatePath('/') // Refresh home page
    revalidatePath('/admin/cms/notices')
    return { success: true }
}

export async function deleteNotice(id: string) {
    const supabase = await getSupabase()

    const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/admin/cms/notices')
    return { success: true }
}

export async function getNotices(onlyPublic: boolean = false) {
    const supabase = await getSupabase()

    let query = supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })

    if (onlyPublic) {
        query = query.eq('is_public', true)
    }

    const { data } = await query
    return data || []
}

// --- VERIFICATION ---

export async function verifyStudent(studentIdOrRoll: string) {
    const supabase = await getSupabase()

    // Try by ID first
    let { data: student } = await supabase
        .from('students')
        .select('name, class, section, roll_no, enrollment_no')
        .eq('id', studentIdOrRoll)
        .single()

    // If not found, try Enrollment No (if exists) or just generic search if needed
    // For now, strict ID check based on SRS "Student ID"

    if (!student) {
        // Try exact match on Enrollment No field if likely to be used as ID
        const { data: byEnroll } = await supabase
            .from('students')
            .select('name, class, section, roll_no, enrollment_no')
            .eq('enrollment_no', studentIdOrRoll)
            .single()

        student = byEnroll
    }

    if (student) {
        return {
            valid: true,
            details: {
                name: student.name,
                class: student.class,
                section: student.section,
                status: "Active Student"
            }
        }
    }

    return { valid: false }
}
