"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Save, Loader2 } from "lucide-react"
import { useState } from "react"
import { resetPasswordAction } from "@/app/actions/update-user"

export function PasswordResetForm({ userId }: { userId: string }) {
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    const handleReset = async () => {
        if (!password || password.length < 6) {
            setMessage({ text: "Password must be at least 6 characters.", type: 'error' })
            return
        }

        setLoading(true)
        setMessage(null)

        const result = await resetPasswordAction(userId, password)

        if (result?.error) {
            setMessage({ text: result.error, type: 'error' })
        } else {
            setMessage({ text: "Password updated successfully!", type: 'success' })
            setPassword("")
        }
        setLoading(false)
    }

    return (
        <Card className="shadow-sm border-l-4 border-l-red-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                    <Lock className="w-5 h-5" />
                    Security Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                    Force update the user's password. This will log them out of all active sessions.
                </p>
                <div className="flex gap-2">
                    <Input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="max-w-xs"
                    />
                    <Button
                        onClick={handleReset}
                        disabled={loading}
                        variant="destructive"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                    </Button>
                </div>
                {message && (
                    <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message.text}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
