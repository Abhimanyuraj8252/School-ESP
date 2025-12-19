"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldCheck, Loader2 } from "lucide-react"
import { useState } from "react"
import { updateUserRoleAction } from "@/app/actions/update-user"

export function RoleChanger({ userId, currentRole }: { userId: string, currentRole: string }) {
    const [role, setRole] = useState(currentRole)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleUpdate = async () => {
        if (role === currentRole) return
        setLoading(true)
        setMessage("")

        await updateUserRoleAction(userId, role)

        setMessage("Role updated!")
        setLoading(false)
        // Ideally router.refresh() here via a parent or hook, 
        // but server action revalidatePath handles the data update
    }

    return (
        <Card className="shadow-sm border-l-4 border-l-purple-500 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                    <ShieldCheck className="w-5 h-5" />
                    Account Role
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                    Change access level for this user.
                </p>
                <div className="flex gap-2">
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="office">Office Staff</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={handleUpdate}
                        disabled={loading || role === currentRole}
                        variant="default"
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
                    </Button>
                </div>
                {message && <p className="text-sm text-green-600 font-medium">{message}</p>}
            </CardContent>
        </Card>
    )
}
