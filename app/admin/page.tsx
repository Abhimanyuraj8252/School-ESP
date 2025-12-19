import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpRight, DollarSign, GraduationCap, Users, Briefcase, FileText } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
    const supabase = await createClient()

    // 1. Fetch User Counts
    const { count: studentCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student')
    const { count: teacherCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'teacher')
    const { count: officeCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'office')

    // 2. Fetch Financials (Total Paid)
    const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'captured')

    const totalCollected = transactions?.reduce((sum, txn) => sum + (Number(txn.amount) || 0), 0) || 0

    // 3. Fetch Recent Transactions
    const { data: recentPayments } = await supabase
        .from('transactions')
        .select('transaction_id, student_id, amount, status, created_at, receipt_url')
        .order('created_at', { ascending: false })
        .limit(5)

    const stats = [
        {
            title: "Total Students",
            value: studentCount || 0,
            icon: Users,
            color: "bg-blue-500",
            href: "/admin/students"
        },
        {
            title: "Total Teachers",
            value: teacherCount || 0,
            icon: GraduationCap,
            color: "bg-green-500",
            href: "/admin/students" // Placeholder until teacher page exisits
        },
        {
            title: "Office Staff",
            value: officeCount || 0,
            icon: Briefcase,
            color: "bg-orange-500",
            href: "/admin/students" // Placeholder
        },
        {
            title: "Fees Collected",
            value: `₹${totalCollected.toLocaleString('en-IN')}`,
            icon: DollarSign,
            color: "bg-yellow-500",
            href: "/admin/reports"
        },
    ]

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Real-time overview of your school's data.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Link key={index} href={stat.href}>
                        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.color} bg-opacity-10`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color.replace("bg-", "text-")}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Payments Table */}
                <Card className="col-span-1 lg:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Receipt</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentPayments?.map((payment) => (
                                    <TableRow key={payment.transaction_id}>
                                        <TableCell className="font-medium text-xs font-mono">{payment.transaction_id.slice(0, 12)}...</TableCell>
                                        <TableCell>₹{payment.amount}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${payment.status === 'captured' || payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'}`}>
                                                {payment.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {payment.receipt_url ? (
                                                <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                    <FileText className="w-3 h-3" /> View
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            {new Date(payment.created_at).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!recentPayments || recentPayments.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                            No recent payments found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Notices / Quick Actions */}
                <div className="space-y-8">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href="/admin/students">
                                <Button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 flex items-center justify-center mb-4">
                                    Add New Student
                                </Button>
                            </Link>
                            <Link href="/admin/reports">
                                <Button variant="outline" className="w-full flex items-center justify-center">
                                    Generate Report
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary text-white shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-white">Pro Tip</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-blue-100">
                                Your dashboard now shows real-time data from your database! Add students and payments to populate these charts.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
