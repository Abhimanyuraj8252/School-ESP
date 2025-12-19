"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createStudentProfile } from "@/app/actions/office"
import { Loader2, Upload } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function AdmissionsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        fullName: "",
        parentName: "",
        email: "",
        phone: "",
        class: "",
        dob: "",
        address: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await createStudentProfile(formData)

            if (result.success) {
                toast({ title: "Success", description: "Student admitted successfully!" })
                setFormData({
                    fullName: "",
                    parentName: "",
                    email: "",
                    phone: "",
                    class: "",
                    dob: "",
                    address: ""
                })
            } else {
                toast({ variant: "destructive", title: "Error", description: "Failed to admit student." })
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "An error occurred." })
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">New Admission</h1>
                    <p className="text-gray-500">Register a new student into the system.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Student Details</CardTitle>
                        <CardDescription>Enter the basic information for the student profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parentName">Parent/Guardian Name</Label>
                            <Input
                                id="parentName"
                                required
                                value={formData.parentName}
                                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                placeholder="e.g. Robert Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                type="date"
                                required
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="class">Assign Class</Label>
                            <Select onValueChange={(val: string) => setFormData({ ...formData, class: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nursery">Nursery</SelectItem>
                                    <SelectItem value="kg">KG</SelectItem>
                                    <SelectItem value="1">Class 1</SelectItem>
                                    <SelectItem value="5">Class 5</SelectItem>
                                    <SelectItem value="10">Class 10</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Contact Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address (Optional)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="student@school.com"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="address">Residential Address</Label>
                            <Input
                                id="address"
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Full street address"
                            />
                        </div>

                        <div className="md:col-span-2 border-t pt-6 mt-2">
                            <h3 className="font-semibold mb-4">Documents Upload</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-600">Student Photo</span>
                                    <span className="text-xs text-gray-400 mt-1">.jpg, .png</span>
                                </div>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-600">Transfer Certificate</span>
                                    <span className="text-xs text-gray-400 mt-1">.pdf</span>
                                </div>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-600">Aadhar Card</span>
                                    <span className="text-xs text-gray-400 mt-1">.pdf, .jpg</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t flex justify-between p-6">
                        <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-dark">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Complete Admission"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
