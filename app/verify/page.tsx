"use client"

import { useState } from "react"
import { verifyStudent } from "@/app/actions/cms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, XCircle, Search, ShieldCheck } from "lucide-react"

export default function VerifyPage() {
    const [id, setId] = useState("")
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    const handleVerify = async () => {
        if (!id) return
        setLoading(true)
        setSearched(false)
        const res = await verifyStudent(id)
        setResult(res)
        setSearched(true)
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-indigo-600">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-indigo-100 p-3 rounded-full w-fit mb-4">
                        <ShieldCheck className="w-8 h-8 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Student Verification</CardTitle>
                    <CardDescription>
                        Enter Student ID or Application Number to verify enrollment status.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g. 550e8400-e29b..."
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="font-mono text-sm"
                        />
                        <Button onClick={handleVerify} disabled={loading}>
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>

                    {searched && (
                        <div className={`p-6 rounded-lg border-2 ${result?.valid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} animate-in fade-in slide-in-from-bottom-2`}>
                            {result?.valid ? (
                                <div className="text-center space-y-3">
                                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                                    <h3 className="text-green-800 font-bold text-lg">Verified Student</h3>
                                    <div className="text-sm text-green-700 bg-white/50 p-4 rounded-md text-left space-y-1">
                                        <p><span className="font-semibold">Name:</span> {result.details.name}</p>
                                        <p><span className="font-semibold">Class:</span> {result.details.class} - {result.details.section}</p>
                                        <p><span className="font-semibold">Status:</span> {result.details.status}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-2">
                                    <XCircle className="w-10 h-10 text-red-500 mx-auto" />
                                    <h3 className="text-red-700 font-bold">Record Not Found</h3>
                                    <p className="text-sm text-red-600">
                                        The ID provided does not match any active student record in our database.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
