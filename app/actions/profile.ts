'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // return { error: 'Not authenticated' }
        return
    }

    const name = formData.get('name') as string
    const studentClass = formData.get('class') as string
    const section = formData.get('section') as string
    const parentWhatsapp = formData.get('parentWhatsapp') as string
    const photoUrl = formData.get('photoUrl') as string

    // Check if profile exists
    const { data: existingProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

    let error;

    if (existingProfile) {
        // Update
        const { error: updateError } = await supabase
            .from('student_profiles')
            .update({
                name,
                class: studentClass,
                section,
                parent_whatsapp: parentWhatsapp,
                photo_url: photoUrl
            })
            .eq('user_id', user.id)
        error = updateError
    } else {
        // Insert
        const { error: insertError } = await supabase
            .from('student_profiles')
            .insert({
                user_id: user.id,
                name,
                class: studentClass,
                section,
                parent_whatsapp: parentWhatsapp,
                photo_url: photoUrl
            })
        error = insertError
    }

    if (error) {
        console.error(error.message)
        return
    }

    // Sync with Auth User Metadata so it reflects in the UI header immediately
    const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { full_name: name }
    })

    if (authUpdateError) {
        console.error("Auth metadata sync failed:", authUpdateError)
    }

    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard', 'layout') // Revalidate layout to update header
}
