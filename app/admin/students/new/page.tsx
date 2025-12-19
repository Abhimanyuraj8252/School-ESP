"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { createUserAction } from "@/app/actions/create-user"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewUserPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError("")

        const result = await createUserAction(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        } else {
            // Success
            router.push('/admin/students')
        }
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Link href="/admin/students" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to User Management
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" name="fullName" placeholder="e.g. John Doe" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Account Role</Label>
                                <Select name="role" defaultValue="student" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                        <SelectItem value="office">Office Staff</SelectItem>
                                        <SelectItem value="admin">Administrator</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address (Username)</Label>
                            <Input id="email" name="email" type="email" placeholder="user@schoolesp.edu" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" placeholder="Min. 6 characters" required minLength={6} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                                <Label htmlFor="class">Class (Optional)</Label>
                                <Input id="class" name="class" placeholder="e.g. 10" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="section">Section (Optional)</Label>
                                <Input id="section" name="section" placeholder="e.g. A" />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center">
                                <span className="font-bold mr-2">Error:</span> {error}
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="bg-primary text-white" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Create User
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
