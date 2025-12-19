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
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

export async function addSubject(classId: string, name: string) {
    const supabase = await getSupabase()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('subjects')
        .insert({ class_id: classId, name: name })

    if (error) return { error: error.message }

    revalidatePath('/admin/subjects')
    return { success: true }
}

export async function getSubjects(classId?: string) {
    const supabase = await getSupabase()

    let query = supabase.from('subjects').select('*').order('class_id', { ascending: true })

    if (classId) {
        query = query.eq('class_id', classId)
    }

    const { data, error } = await query

    if (error) return []
    return data
}

export async function deleteSubject(id: string) {
    const supabase = await getSupabase()

    const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/subjects')
    return { success: true }
}
