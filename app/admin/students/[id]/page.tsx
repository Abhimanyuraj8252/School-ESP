import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/utils/supabase/server"
import { ArrowLeft, User, GraduationCap, DollarSign } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PasswordResetForm } from "@/components/admin/password-reset-form"
import { RoleChanger } from "@/components/admin/role-changer"

// Next.js 15: params is a Promise
export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // 1. Fetch User & Profile
    const { data: user, error } = await supabase
        .from('users')
        .select(`
            *,
            student_profiles (*)
        `)
        .eq('id', id)
        .single()

    if (error || !user) {
        notFound()
    }

    // 2. Fetch Transactions
    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('student_id', id)
        .order('created_at', { ascending: false })

    // Calculate Financials
    const totalPaid = transactions?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0
    // Mock Pending Amount
    const annualFee = 25000
    const pendingDue = Math.max(0, annualFee - totalPaid)

    const profile = user.student_profiles

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <Link href="/admin/students" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to User Management
            </Link>

            {/* Profile Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-2 shadow-sm border-t-4 border-t-primary">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user.full_name}</h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'teacher' ? 'bg-green-100 text-green-700' :
                                                'bg-blue-100 text-blue-700'}`}>
                                        {user.role}
                                    </span>
                                    <span className="text-gray-500 text-sm">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400">
                                {user.full_name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" /> Personal Details
                            </h3>
                            <div className="text-sm space-y-2 text-gray-600">
                                <p><span className="font-medium text-gray-900">Email:</span> {user.email}</p>
                                <p><span className="font-medium text-gray-900">Phone:</span> {profile?.parent_whatsapp || 'N/A'}</p>
                                <p><span className="font-medium text-gray-900">Parent:</span> {profile?.name || 'Same as Student'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-gray-500" /> Academic Info
                            </h3>
                            <div className="text-sm space-y-2 text-gray-600">
                                <p><span className="font-medium text-gray-900">Class:</span> {profile?.class || 'N/A'}</p>
                                <p><span className="font-medium text-gray-900">Section:</span> {profile?.section || 'N/A'}</p>
                                <p><span className="font-medium text-gray-900">ID:</span> {user.id.slice(0, 8)}...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial Overview Card */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            Fee Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-500">Total Paid</p>
                            <p className="text-3xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Estimated Due</p>
                            <p className="text-2xl font-bold text-red-500">₹{pendingDue.toLocaleString()}</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: `${Math.min(100, (totalPaid / annualFee) * 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400">Target Annual Fee: ₹{annualFee.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Transaction History */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Transaction ID</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions?.map((txn) => (
                                        <TableRow key={txn.transaction_id}>
                                            <TableCell>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="font-mono text-xs">{txn.transaction_id}</TableCell>
                                            <TableCell>{txn.payment_method || 'Online'}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                    ${txn.status === 'captured' || txn.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {txn.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">₹{txn.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                    {(!transactions || transactions.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                                                No transactions recorded.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Security Section (Right Column) */}
                <div className="md:col-span-1 space-y-6">
                    <PasswordResetForm userId={user.id} />
                    <RoleChanger userId={user.id} currentRole={user.role} />
                </div>
            </div>
        </div>
    )
}
