"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { CheckCircle, Loader2 } from "lucide-react"

export default function AdmissionPage() {
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const { toast } = useToast()
    const supabase = createClient()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitting(true)

        const formData = new FormData(event.currentTarget)
        const data = {
            student_name: formData.get("student_name") as string,
            guardian_name: formData.get("guardian_name") as string,
            phone: formData.get("phone") as string,
            email: formData.get("email") as string,
            target_class: formData.get("target_class") as string,
            previous_school: formData.get("previous_school") as string,
            status: 'pending' // Default status
        }

        try {
            const { error } = await supabase
                .from("admission_applications")
                .insert([data])

            if (error) throw error

            setSuccess(true)
            toast({
                title: "Application Submitted",
                description: "We will contact you shortly.",
            })
        } catch (error) {
            console.error("Submission error:", error)
            toast({
                title: "Error",
                description: "Failed to submit application. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Received!</h2>
                        <p className="text-slate-600 mb-6">
                            Thank you for your interest in School ESP. Our admissions team will review your application and contact you on the provided number.
                        </p>
                        <Button onClick={() => window.location.href = '/'} variant="outline">
                            Return to Home
                        </Button>
                    </motion.div>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <Card className="max-w-2xl w-full">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-serif font-bold text-primary">Admission Application</CardTitle>
                    <CardDescription>
                        Fill out the form below to apply for the academic year 2025-26.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="student_name">Student's Full Name</Label>
                                <Input id="student_name" name="student_name" required placeholder="e.g. Rahul Sharma" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="target_class">Applying For Class</Label>
                                <Select name="target_class" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((c) => (
                                            <SelectItem key={c} value={c}>Class {c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="guardian_name">Parent/Guardian Name</Label>
                            <Input id="guardian_name" name="guardian_name" required placeholder="e.g. Amit Sharma" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number (WhatsApp)</Label>
                                <Input id="phone" name="phone" type="tel" required placeholder="+91 98765 43210" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address (Optional)</Label>
                                <Input id="email" name="email" type="email" placeholder="email@example.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="previous_school">Previous School (if applicable)</Label>
                            <Textarea id="previous_school" name="previous_school" placeholder="School Name, City" />
                        </div>

                        <Button type="submit" className="w-full text-lg h-12" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                                </>
                            ) : (
                                "Submit Application"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
