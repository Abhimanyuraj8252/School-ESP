"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, BookOpen, Calendar, Clock, Download, FileText, GraduationCap, LogOut, LayoutDashboard, User, CreditCard, Bell, Menu } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { downloadReceipt } from "@/utils/receiptGenerator"

export default function DashboardPage() {
    const notices = [
        { id: 1, title: "Half-Yearly Exams Schedule Released", date: "Oct 12, 2025", type: "Exam" },
        { id: 2, title: "Sports Day Registration Open", date: "Oct 10, 2025", type: "Event" },
        { id: 3, title: "School Closed on Monday", date: "Oct 08, 2025", type: "General" },
    ]

    const pendingFees = [
        { id: "INV-2025-001", description: "Tuition Fee - Term 2", amount: "₹1,200", dueDate: "Oct 30, 2025" },
        { id: "INV-2025-002", description: "Transport Fee - Oct", amount: "₹150", dueDate: "Oct 30, 2025" },
    ]

    const receipts = [
        { id: "RCP-1092", description: "Tuition Fee - Term 1", date: "Aug 15, 2025", amount: "₹1,200" },
        { id: "RCP-1055", description: "Lab & Library Fee", date: "Jul 10, 2025", amount: "₹300" },
    ]

    const makePayment = async (amount: string, description: string) => {
        try {
            // Remove non-numeric chars except for regex safety, generally just want digits
            const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''))

            if (isNaN(numericAmount) || numericAmount <= 0) {
                alert("Invalid amount detected.")
                return
            }

            // 1. Load Script
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?')
                return
            }

            // 2. Create Order
            const orderRes = await fetch('/api/fees/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: numericAmount })
            })

            if (!orderRes.ok) {
                throw new Error("Failed to create order on server")
            }

            const data = await orderRes.json()

            if (!data.id) {
                console.error("Order creation failed:", data)
                alert("Could not create payment order. Check console.")
                return
            }

            // 3. Open Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount.toString(),
                currency: data.currency,
                name: "School ESP",
                description: description,
                image: "/logo.png",
                order_id: data.id,
                handler: async function (response: any) {
                    // 4. Verify Payment
                    try {
                        const verifyData = {
                            orderCreationId: data.id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            amount: numericAmount,
                            studentId: "STU-123", // Fetch from context
                            feeDescription: description
                        }

                        const result = await fetch('/api/fees/verify', {
                            method: 'POST',
                            body: JSON.stringify(verifyData),
                        }).then((t) => t.json())

                        if (result.msg === 'success') {
                            alert(`Payment Successful! Receipt: ${result.receiptUrl}`)
                            window.location.reload()
                        } else {
                            alert('Payment Failed Verification: ' + result.msg)
                        }
                    } catch (verifyErr) {
                        console.error("Verification Error:", verifyErr)
                        alert("Payment successful but verification failed locally.")
                    }
                },
                prefill: {
                    name: "Alex Johnson",
                    email: "alex@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#0f172a",
                },
            }

            const paymentObject = new (window as any).Razorpay(options)
            paymentObject.on('payment.failed', function (response: any) {
                alert("Payment Failed: " + response.error.description);
            });
            paymentObject.open()

        } catch (error) {
            console.error("Payment Initiation Error:", error)
            alert("Something went wrong while initiating payment.")
        }
    }

    const handleDownloadReceipt = (id: string, description: string, amountStr: string) => {
        // Parse amount, handling potential undefined
        const cleanAmount = (amountStr || "0").toString().replace(/[^0-9]/g, '')
        const amount = parseInt(cleanAmount) || 0

        // Use the utility to generate and save PDF
        const transaction = { id, order_id: "MOCK-ORDER" + id, amount, description }
        const student = { id: "STU-10A-001", name: "Student Name", class: "10-A", roll: "001" }
        downloadReceipt(transaction, student)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Student Dashboard</h1>
                    <p className="text-gray-500">Welcome back, Alex!</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        A
                    </div>
                    <div className="text-sm">
                        <p className="font-bold text-gray-900">Alex Johnson</p>
                        <p className="text-xs text-gray-500">Class 10-A</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Data & Fees */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Result Card */}
                    <Card className="overflow-hidden border-none shadow-md bg-linear-to-br from-primary to-primary-light text-white">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Latest Result</span>
                                <span className="text-sm font-normal bg-white/20 px-3 py-1 rounded-full">Term 1 (2025)</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-5xl font-bold">92.4%</span>
                                <span className="text-gray-200 mb-1">Overall Grade: A+</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center bg-black/10 p-4 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-300">Math</p>
                                    <p className="font-bold text-lg">98</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">Science</p>
                                    <p className="font-bold text-lg">95</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">English</p>
                                    <p className="font-bold text-lg">89</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href="/dashboard/results" className="w-full">
                                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold border-none">
                                    View Full Marksheet
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Fees Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Pending Fees */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-red-500" />
                                    Pending Due
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-3xl font-bold text-gray-900">₹1,350</div>
                                <div className="space-y-3">
                                    {pendingFees.map((fee) => (
                                        <div key={fee.id} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded -mx-2">
                                            <span>{fee.description}</span>
                                            <span className="font-semibold text-gray-900">{fee.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={() => makePayment("1350", "Total Pending Dues")}
                                    className="w-full bg-green-600 hover:bg-green-700 font-bold text-white"
                                >
                                    Pay Online Now
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Payment History */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    Recent Receipts
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {receipts.map((rcp) => (
                                    <div key={rcp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-blue-50 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{rcp.description}</p>
                                            <p className="text-xs text-gray-500">{rcp.date}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 group-hover:text-blue-600"
                                            onClick={() => handleDownloadReceipt(rcp.id, rcp.description, rcp.amount)}
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Link href="/dashboard/fees" className="w-full">
                                    <Button variant="outline" className="w-full">View All History</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Notices */}
                <div className="space-y-6">
                    <Card className="h-full border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-secondary" />
                                Notice Board
                            </CardTitle>
                            <CardDescription>Latest announcements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 relative border-l-2 border-gray-100 ml-3 pl-6 py-2">
                                {notices.map((notice, idx) => (
                                    <div key={notice.id} className="relative">
                                        {/* Timeline Dot */}
                                        <div className={`absolute -left-7.75 top-1 w-4 h-4 rounded-full border-2 border-white 
                                                ${notice.type === 'Exam' ? 'bg-red-400' :
                                                notice.type === 'Event' ? 'bg-green-400' : 'bg-blue-400'
                                            }`}
                                        />

                                        <div className="flex flex-col gap-1">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded w-fit
                                                    ${notice.type === 'Exam' ? 'bg-red-100 text-red-700' :
                                                    notice.type === 'Event' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {notice.type}
                                            </span>
                                            <h4 className="font-medium text-gray-900">{notice.title}</h4>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {notice.date}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href="/dashboard/notices" className="w-full">
                                <Button variant="ghost" className="w-full text-primary hover:text-primary-dark hover:bg-primary/10">
                                    View All Notices
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div >
    )
}

function loadScript(src: string) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}
