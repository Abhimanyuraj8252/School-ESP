"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createUserAction(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const role = formData.get("role") as string
    const studentClass = formData.get("class") as string || 'N/A'
    const section = formData.get("section") as string || 'N/A'

    // 1. Check for Service Key
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) {
        return { error: "Configuration Error: Missing SUPABASE_SERVICE_ROLE_KEY. Cannot create user." }
    }

    // 2. Initialize Admin Client
    // We use the raw supabase-js client here because we need a NEW instance with the service key,
    // not the standard auth-context client.
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

    // 3. Create User in Supabase Auth
    const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
            full_name: fullName,
            role: role
        }
    })

    if (authError) {
        console.error("Create User Error:", authError)
        return { error: `Supabase Error: ${authError.message} (Code: ${authError.status})` }
    }

    if (!userData.user) {
        console.error("No user returned")
        return { error: "Unknown Error: User object was not returned by Supabase." }
    }

    // 4. FORCE Sync to public.users (Fixes Role & Visibility)
    // We strictly set the role here, overriding any trigger defaults.
    const { error: userError } = await supabaseAdmin
        .from('users')
        .upsert({
            id: userData.user.id,
            email: email,
            full_name: fullName,
            role: role // <--- Ensures Correct Role (Teacher/Office)
        })

    if (userError) {
        console.error("Public User Sync Error:", userError)
        return { error: `Failed to sync user list: ${userError.message}` }
    }

    // 5. Update Profile with Extra Data (Class/Section)
    const { error: profileError } = await supabaseAdmin
        .from('student_profiles')
        .upsert({
            user_id: userData.user.id,
            name: fullName,
            class: studentClass,
            section: section
        })

    if (profileError) {
        // Not a critical failure, but good to know
        console.error("Profile update error:", profileError)
    }

    // 6. Success
    revalidatePath('/admin/students')
    return { success: true }
}
