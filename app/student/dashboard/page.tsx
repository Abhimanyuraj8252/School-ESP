import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStudentProfile, getFeeSummary, getStudentHomework, getStudentAttendanceStats } from "@/app/actions/student"
import { Book, IndianRupee, Bell, Trophy, Users } from "lucide-react"

export default async function StudentDashboard() {
    const profile = await getStudentProfile()

    if (!profile) return <div>Access Denied. Please login.</div>

    const [{ totalDue }, homework, attendance] = await Promise.all([
        getFeeSummary(profile.id),
        getStudentHomework(profile),
        getStudentAttendanceStats(profile.id)
    ])

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile.name}</h1>
                    <p className="text-gray-500 mt-2">Class {profile.class} - {profile.section}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Academic Rank Card (New) */}
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-indigo-100 flex justify-between">
                            Class Rank <Trophy className="h-4 w-4 text-yellow-300" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">5th</div>
                        <p className="text-xs text-indigo-100 mt-1 opacity-80">
                            Top 10% in Class {profile.class}-{profile.section}
                        </p>
                    </CardContent>
                </Card>

                {/* 2. Fees Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Fee Status
                        </CardTitle>
                        <IndianRupee className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">
                            {totalDue <= 0 ? (
                                <span className="text-green-600">Paid</span>
                            ) : (
                                <span className="text-red-600">₹ {totalDue} Due</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {totalDue <= 0 ? "No pending dues" : "Payment overdue"}
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Profile Stats (Age) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Student Profile
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Age:</span>
                            <span className="font-bold">{calculateAge(profile.dob || '2008-01-01')} Years</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                            <span className="text-gray-500">Roll No:</span>
                            <span className="font-bold">{profile.roll_no}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                            <span className="text-gray-500">Attendance:</span>
                            <span className={`font-bold ${Number(attendance.overall) < 75 ? 'text-red-600' : 'text-green-600'}`}>
                                {attendance.overall}%
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Homework Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Assignments
                    </CardTitle>
                    <Book className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{homework.length}</div>
                    <p className="text-xs text-gray-500 mt-1">
                        Active assignments
                    </p>
                </CardContent>
            </Card>

            {/* Notices Card (Placeholder) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Notices
                    </CardTitle>
                    <Bell className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-gray-500 mt-1">
                        New announcements
                    </p>
                </CardContent>
            </Card>

            {/* Recent Homework Preview */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Recent Homework</h2>
                <div className="grid gap-4">
                    {homework.slice(0, 3).map((hw) => (
                        <Card key={hw.id}>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-primary">{hw.subject}</h3>
                                    <p className="text-sm text-gray-600">{hw.title}</p>
                                </div>
                                <div className="text-sm text-gray-400">
                                    {new Date(hw.created_at).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {homework.length === 0 && (
                        <p className="text-gray-500">No homework assigned yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

function calculateAge(dob: string) {
    const diff = Date.now() - new Date(dob).getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}
