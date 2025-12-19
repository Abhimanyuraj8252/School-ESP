"use client"

import { useState, useTransition } from "react"
import { updateUserPassword } from "@/app/actions/auth-settings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast" // Assuming shadcn toast exists, or I'll use simple alert

export default function SecuritySettingsPage() {
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [isPending, startTransition] = useTransition()

    const handleUpdate = () => {
        if (password.length < 6) {
            alert("Password must be at least 6 characters")
            return
        }
        if (password !== confirm) {
            alert("Passwords do not match")
            return
        }

        startTransition(async () => {
            const res = await updateUserPassword(password)
            if (res.error) {
                alert("Error: " + res.error)
            } else {
                alert("Password updated successfully!")
                setPassword("")
                setConfirm("")
            }
        })
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-slate-500" /> Security Settings
                    </CardTitle>
                    <CardDescription>Change your login password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 6 characters"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Confirm Password</Label>
                        <Input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Re-enter password"
                        />
                    </div>
                    <Button
                        className="w-full"
                        onClick={handleUpdate}
                        disabled={isPending || !password}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
