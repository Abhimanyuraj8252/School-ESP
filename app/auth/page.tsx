"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, Building2, GraduationCap, Lock, Mail, Briefcase, BookOpen } from "lucide-react"

import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [userType, setUserType] = useState("student")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const form = e.target as HTMLFormElement
        const email = (form.elements.namedItem("email") as HTMLInputElement).value
        const password = (form.elements.namedItem("password") as HTMLInputElement).value

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) {
                throw new Error(authError.message)
            }

            // Fetch Role from DB (Source of Truth)
            const { data: dbUser } = await supabase
                .from('users')
                .select('role')
                .eq('id', data.user.id)
                .single()

            const userRole = dbUser?.role || 'student'

            if (userRole !== userType) {
                await supabase.auth.signOut()
                throw new Error(`Unauthorized. You are not a ${userType}. (Your role is: ${userRole})`)
            }

            // Redirect based on role
            switch (userType) {
                case "admin":
                    router.push("/admin")
                    break
                case "office":
                    router.push("/office/dashboard")
                    break
                case "teacher":
                    router.push("/teacher/dashboard")
                    break
                default:
                    router.push("/dashboard")
            }

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-primary-dark z-0" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 z-0" />

            {/* Animated Shapes */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl z-0"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 50, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl z-0"
            />

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
                    <CardHeader className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20"
                        >
                            <Building2 className="w-8 h-8 text-white" />
                        </motion.div>
                        <CardTitle className="text-3xl font-serif font-bold text-white mb-2">Welcome Back</CardTitle>
                        <CardDescription className="text-gray-300">
                            Access your School ESP portal
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="student" className="w-full" onValueChange={setUserType}>
                            <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/10">
                                <TabsTrigger value="student" className="data-[state=active]:bg-secondary data-[state=active]:text-primary text-gray-300 p-2">
                                    <GraduationCap className="w-4 h-4 md:mr-2" />
                                    <span className="hidden md:inline">Student</span>
                                </TabsTrigger>
                                <TabsTrigger value="teacher" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-300 p-2">
                                    <BookOpen className="w-4 h-4 md:mr-2" />
                                    <span className="hidden md:inline">Teacher</span>
                                </TabsTrigger>
                                <TabsTrigger value="office" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-300 p-2">
                                    <Briefcase className="w-4 h-4 md:mr-2" />
                                    <span className="hidden md:inline">Office</span>
                                </TabsTrigger>
                                <TabsTrigger value="admin" className="data-[state=active]:bg-primary-light data-[state=active]:text-white text-gray-300 p-2">
                                    <Lock className="w-4 h-4 md:mr-2" />
                                    <span className="hidden md:inline">Admin</span>
                                </TabsTrigger>
                            </TabsList>

                            <form onSubmit={handleLogin}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={userType}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-white">
                                                {userType === 'student' ? 'Student ID / Email' : 'Email Address'}
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                                <Input
                                                    name="email"
                                                    id="email"
                                                    placeholder={userType === 'student' ? "STU-2025-001" : `${userType}@schoolesp.edu`}
                                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 transition-colors"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-white">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                                <Input
                                                    name="password"
                                                    id="password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 transition-colors"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="flex items-center text-red-300 text-sm bg-red-500/10 p-3 rounded-md"
                                            >
                                                <AlertCircle className="w-4 h-4 mr-2" />
                                                {error}
                                            </motion.div>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full bg-secondary hover:bg-secondary-light text-primary font-bold h-11"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Authenticating...
                                                </>
                                            ) : (
                                                `Login as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`
                                            )}
                                        </Button>
                                    </motion.div>
                                </AnimatePresence>
                            </form>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-white/10 pt-6">
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Forgot your password?
                        </a>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
