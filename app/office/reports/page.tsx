"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Download, FileText, PieChart, TrendingUp } from "lucide-react"

export default function OfficeReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Office Reports</h1>
                <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export All
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Total Fees Collected
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹24,50,000</div>
                        <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            New Admissions
                        </CardTitle>
                        <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">145</div>
                        <p className="text-xs text-gray-500 mt-1">Academic Year 2025-26</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Pending Clearances
                        </CardTitle>
                        <PieChart className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">28</div>
                        <p className="text-xs text-gray-500 mt-1">Requires Action</p>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Available Reports</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {["Daily Fee Collection Report", "Admission Statistics By Class", "Scholarship Distribution Report", "Staff Attendance Summary", "Expense Report - October"].map((report, i) => (
                    <Card key={i} className="hover:bg-gray-50 cursor-pointer transition-colors">
                        <CardContent className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <span className="font-medium text-gray-700">{report}</span>
                            </div>
                            <Button variant="ghost" size="sm">Download</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
