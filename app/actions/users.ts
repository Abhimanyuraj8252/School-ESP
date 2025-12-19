"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteUser(userId: string) {
    const supabase = await createClient()

    // Delete from public.users (This effectively removes their access/role)
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

    if (error) {
        return { success: false, error: error.message }
    }

    // Attempt to delete from student_profiles (if cascade didn't handle it)
    await supabase.from('student_profiles').delete().eq('user_id', userId)

    revalidatePath('/admin/students')
    return { success: true }
}
