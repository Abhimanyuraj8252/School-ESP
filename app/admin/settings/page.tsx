"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, School, Download, Loader2 } from "lucide-react"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"

type SettingsData = {
    id: number
    school_name: string
    school_address: string
    school_phone: string
    school_email: string
    current_session: string
    feature_admissions: boolean
    feature_fees: boolean
    feature_portal: boolean
}

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [settings, setSettings] = useState<SettingsData>({
        id: 1,
        school_name: "School ESP",
        school_address: "",
        school_phone: "",
        school_email: "",
        current_session: "2025-26",
        feature_admissions: true,
        feature_fees: true,
        feature_portal: true
    })

    const { toast } = useToast()
    const supabase = createClient()

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            console.log("Fetching settings form Supabase...")
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single()

            if (error) {
                // If table doesn't exist
                if (error.code === '42P01' || error.code === 'PGRST205') {
                    console.warn("Settings table missing (PGRST205/42P01):", error.message)
                    toast({
                        title: "Setup Required",
                        description: "Database table 'settings' is missing. Run cms_schema.sql in Supabase.",
                        variant: "destructive"
                    })
                    return
                }

                // If row doesn't exist (PGRST116), we just use defaults, so ignore.
                if (error.code === 'PGRST116') {
                    console.log("No settings found, using defaults.")
                    return
                }

                throw error
            }

            if (data) {
                setSettings(data)
            }
        } catch (error: any) {
            console.error("FULL ERROR OBJECT:", JSON.stringify(error, null, 2))
            toast({
                title: "Error Loading Settings",
                description: "Check console for details. " + (error.message || ""),
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: keyof SettingsData, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({ ...settings, id: 1, updated_at: new Date().toISOString() })

            if (error) throw error

            toast({
                title: "Success",
                description: "Settings updated successfully.",
            })
        } catch (error) {
            console.error("Error saving settings:", error)
            toast({
                title: "Error",
                description: "Failed to update settings.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleExport = async (table: string) => {
        try {
            setExporting(true)
            const { data, error } = await supabase.from(table).select('*')
            if (error) throw error

            const csvContent = data.length > 0
                ? [
                    Object.keys(data[0]).join(","), // Header
                    ...data.map(row => Object.values(row).map(v => JSON.stringify(v)).join(",")) // Rows
                ].join("\n")
                : "No data"

            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${table}_export_${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)

            toast({ title: "Export Started", description: `Downloading ${table} data...` })
        } catch (error) {
            console.error(`Error exporting ${table}:`, error)
            toast({ title: "Export Failed", description: "Could not download data.", variant: "destructive" })
        } finally {
            setExporting(false)
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading settings...</div>
    }

    return (
        <div className="space-y-6 max-w-4xl pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-muted-foreground">Manage your school application and preferences.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <School className="w-5 h-5 text-primary" />
                        General Information
                    </CardTitle>
                    <CardDescription>Update your school's official details for reports and ID cards.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="schoolName">School Name</Label>
                            <Input
                                id="schoolName"
                                value={settings.school_name}
                                onChange={(e) => handleChange('school_name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Official Email</Label>
                            <Input
                                id="email"
                                value={settings.school_email}
                                onChange={(e) => handleChange('school_email', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Contact Number</Label>
                            <Input
                                id="phone"
                                value={settings.school_phone}
                                onChange={(e) => handleChange('school_phone', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={settings.school_address}
                                onChange={(e) => handleChange('school_address', e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>Manage academic years and system feature flags.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Current Academic Year</Label>
                            <p className="text-sm text-gray-500">Set the active session for the entire system.</p>
                        </div>
                        <div className="w-32">
                            <Input
                                value={settings.current_session}
                                onChange={(e) => handleChange('current_session', e.target.value)}
                                placeholder="2025-26"
                            />
                        </div>
                    </div>
                    <div className="border-t pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Online Admissions</Label>
                                <p className="text-sm text-gray-500">Enable/Disable the public admission form.</p>
                            </div>
                            <Switch
                                checked={settings.feature_admissions}
                                onCheckedChange={(checked) => handleChange('feature_admissions', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Fee Collection</Label>
                                <p className="text-sm text-gray-500">Enable fee management modules.</p>
                            </div>
                            <Switch
                                checked={settings.feature_fees}
                                onCheckedChange={(checked) => handleChange('feature_fees', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Student Portal Access</Label>
                                <p className="text-sm text-gray-500">Allow students/parents to login.</p>
                            </div>
                            <Switch
                                checked={settings.feature_portal}
                                onCheckedChange={(checked) => handleChange('feature_portal', checked)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Export system data for backup or external use.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Button variant="outline" onClick={() => handleExport('users')} disabled={exporting}>
                            <Download className="mr-2 h-4 w-4" /> Export Users
                        </Button>
                        <Button variant="outline" onClick={() => handleExport('students')} disabled={exporting}>
                            <Download className="mr-2 h-4 w-4" /> Export Students
                        </Button>
                        <Button variant="outline" onClick={() => handleExport('admission_applications')} disabled={exporting}>
                            <Download className="mr-2 h-4 w-4" /> Export Admissions
                        </Button>
                        <Button variant="outline" onClick={() => handleExport('fee_structure')} disabled={exporting}>
                            <Download className="mr-2 h-4 w-4" /> Export Fees
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
