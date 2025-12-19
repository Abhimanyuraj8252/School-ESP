'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createHomework(data: {
    class_name: string
    section: string
    subject: string
    title: string
    description: string
    due_date?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase.from('homework').insert({
        ...data,
        created_by: user.id
    })

    if (error) {
        console.error('Error creating homework:', error)
        return { error: 'Failed to create homework' }
    }

    revalidatePath('/teacher/dashboard/homework')
    return { success: true }
}

export async function getHomework(className: string, section: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('homework')
        .select('*')
        .eq('class_name', className)
        .eq('section', section)
        .order('created_at', { ascending: false })

    if (error) return []
    return data
}
