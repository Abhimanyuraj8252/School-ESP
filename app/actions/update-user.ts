"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

export async function resetPasswordAction(userId: string, newPassword: string) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) {
        return { error: "Configuration Error: Missing Service Key." }
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    const { error } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password: newPassword }
    )

    if (error) {
        console.error("Password Update Error:", error)
        return { error: error.message }
    }

    revalidatePath(`/admin/students/${userId}`)
    return { success: true }
}

export async function updateUserRoleAction(userId: string, newRole: string) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return { error: "Missing Service Key" }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 1. Update Public Table (Source of Truth for App)
    const { error: dbError } = await supabaseAdmin
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

    if (dbError) return { error: dbError.message }

    // 2. Update Auth Metadata (Best Practice)
    await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { role: newRole }
    })

    revalidatePath(`/admin/students/${userId}`)
    revalidatePath('/admin/students') // Update list too
    return { success: true }
}
