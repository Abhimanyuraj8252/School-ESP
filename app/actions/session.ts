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

export async function getSessionSettings() {
    const supabase = await getSupabase()
    const { data } = await supabase.from('settings').select('*').eq('key', 'promotion_date').single()
    return data ? data.value : '2025-04-01'
}

export async function updateSessionSettings(date: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('settings').upsert({ key: 'promotion_date', value: date })
    if (error) return { error: error.message }
    return { success: true }
}

export async function getClassesForPromotion() {
    // Return list of available classes found in DB to be promoted
    // Distinct classes from students table
    const supabase = await getSupabase()
    const { data } = await supabase.from('students').select('class')

    // Get unique classes
    const classes = Array.from(new Set(data?.map(s => s.class))).sort()
    return classes
}

export async function previewPromotion(currentClass: string) {
    const supabase = await getSupabase()

    // Logic: Fetch students of currentClass
    // We could join with Results to show their marks, but for now simple list
    const { data: students } = await supabase
        .from('students')
        .select('id, name, roll_no, class, section')
        .eq('class', currentClass)
        .order('name')

    return students || []
}

export async function executePromotion(studentIds: string[], nextClass: string, nextSection: string) {
    const supabase = await getSupabase()

    // Batch update
    const { error } = await supabase
        .from('students')
        .update({
            class: nextClass,
            section: nextSection
            // In a real system, we might archive old class history, but here we just update
        })
        .in('id', studentIds)

    if (error) return { error: error.message }

    revalidatePath('/office/students')
    return { success: true }
}
