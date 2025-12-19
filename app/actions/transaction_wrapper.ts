'use server'

import { createClient } from "@/utils/supabase/server"
import { createOrder } from "@/app/actions/payment"
import { getStudentProfile } from "@/app/actions/student"

export async function createPaymentSession(amount: number) {
    const profile = await getStudentProfile()
    if (!profile) return { error: "Student profile not found" }

    // Call the original createOrder (which expects studentId)
    // We pass the amount and the fetched student ID
    return await createOrder(amount, profile.id)
}
