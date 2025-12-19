"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, CreditCard, DollarSign, TrendingUp, Users } from "lucide-react"

export default function OfficeDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Office Dashboard</h1>
                    <p className="text-gray-500">Overview of today's collections and activities.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Today, Oct 14 2025</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collection</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹12,450</div>
                        <p className="text-xs text-muted-foreground">+10% from yesterday</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cash Collected</CardTitle>
                        <CreditCard className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹4,200</div>
                        <p className="text-xs text-amber-600">Pending Verification</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Online/Cheque</CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹8,250</div>
                        <p className="text-xs text-muted-foreground">Verified</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Admissions</CardTitle>
                        <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Processing...</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Collections Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <DollarSign className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Tuition Fee - Alex Johnson</p>
                                            <p className="text-xs text-gray-500">10:4{i} AM • Cash</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">₹1,200</p>
                                        <p className="text-xs text-amber-600 font-medium">Pending</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg border bg-amber-50 border-amber-100">
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-amber-900">Verify Daily Cash (Yesterday)</p>
                                <p className="text-xs text-amber-700">Amount: ₹3,500</p>
                            </div>
                            <button className="text-xs bg-white border border-amber-200 px-3 py-1 rounded shadow-sm hover:bg-amber-100 font-medium text-amber-800">
                                Submit Report
                            </button>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg border bg-blue-50 border-blue-100">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900">Approve 5 Expense Requests</p>
                                <p className="text-xs text-blue-700">Total: ₹450</p>
                            </div>
                            <button className="text-xs bg-white border border-blue-200 px-3 py-1 rounded shadow-sm hover:bg-blue-100 font-medium text-blue-800">
                                Review
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
