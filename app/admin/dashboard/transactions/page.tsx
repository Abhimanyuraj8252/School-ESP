import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import { getPendingTransactions, verifyTransaction, revokeTransaction } from "@/app/actions/finance"
import { revalidatePath } from "next/cache"

export default async function AdminTransactionsPage() {
    // Correct function name from finance.ts
    const transactions = await getPendingTransactions()

    async function handleVerify(formData: FormData) {
        "use server"
        const id = formData.get('id') as string
        await verifyTransaction(id)
        revalidatePath("/admin/dashboard/transactions")
    }

    async function handleReject(formData: FormData) {
        "use server"
        const id = formData.get('id') as string
        await revokeTransaction(id)
        revalidatePath("/admin/dashboard/transactions")
    }

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold font-serif text-primary">Pending Cash Verifications</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Verification Queue</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell>
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {tx.student_profiles?.name || 'Unknown'}
                                    </TableCell>
                                    <TableCell>
                                        {tx.student_profiles?.class} - {tx.student_profiles?.section}
                                    </TableCell>
                                    <TableCell className="font-bold text-green-600">
                                        ₹ {tx.amount}
                                    </TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <form action={handleVerify}>
                                            <input type="hidden" name="id" value={tx.id} />
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Verify
                                            </Button>
                                        </form>
                                        <form action={handleReject}>
                                            <input type="hidden" name="id" value={tx.id} />
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                            >
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Reject
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No pending cash transactions.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
