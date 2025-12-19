import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentButton } from '@/components/PaymentButton'

export default async function FeesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Please log in</div>

    // Fetch student profile to get ID
    const { data: profile } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Mock data if no profile (for demo purposes if user is newly created but not linked)
    const studentData = profile || { id: 'dummy-student-id', name: 'Demo Student', parent_whatsapp: '9999999999' }
    const dummyFees = [
        { month: 'January', amount: 5000, status: 'Pending' },
        { month: 'February', amount: 5000, status: 'Pending' }
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Fee Payments</h1>

            {!profile && (
                <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
                    Note: No student profile found linked to this account. Using independent mode.
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dummyFees.map((fee, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{fee.month} Fees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold">₹{fee.amount}</span>
                                <PaymentButton
                                    amount={fee.amount}
                                    studentId={studentData.id}
                                    studentName={studentData.name}
                                    studentContact={studentData.parent_whatsapp} // Using whatsapp as contact
                                    studentEmail={user.email!}
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Status: {fee.status}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
