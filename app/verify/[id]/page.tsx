import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Download, FileText } from 'lucide-react'
import Link from 'next/link'

export default async function VerifyReceiptPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: transaction, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('transaction_id', id)
        .single()

    if (error || !transaction) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md border-red-200">
                    <CardHeader className="text-center">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <CardTitle className="text-xl text-red-700">Verification Failed</CardTitle>
                        <CardDescription>
                            No record found for Transaction ID: {id}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-gray-600">
                        The receipt you are trying to verify does not exist or the ID is incorrect.
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-t-4 border-t-green-600">
                <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">Payment Verified</CardTitle>
                    <CardDescription className="text-green-600 font-medium">
                        Official School ESP Receipt
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-100">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Transaction ID</span>
                            <span className="font-mono font-medium text-gray-900">{transaction.transaction_id}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Date</span>
                            <span className="font-medium text-gray-900">
                                {new Date(transaction.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Amount Paid</span>
                            <span className="font-bold text-lg text-gray-900">₹ {transaction.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Status</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                {transaction.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Student ID</span>
                            <span className="font-mono text-gray-900 uppercase">{transaction.student_id}</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-gray-400">
                            This is a digitally verified record from School ESP's official database.
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                    {transaction.receipt_url && (
                        <a href={transaction.receipt_url} target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button className="w-full gap-2">
                                <Download className="w-4 h-4" />
                                Download Original Receipt
                            </Button>
                        </a>
                    )}
                    <Link href="/" className="w-full">
                        <Button variant="outline" className="w-full gap-2">
                            <FileText className="w-4 h-4" />
                            Return to Homepage
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
