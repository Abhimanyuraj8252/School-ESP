import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import StudentDashboardLayout from '@/components/StudentDashboardLayout'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth')
    }

    return (
        <StudentDashboardLayout>
            {children}
        </StudentDashboardLayout>
    )
}
