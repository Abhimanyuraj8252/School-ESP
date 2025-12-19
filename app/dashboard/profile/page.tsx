import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { updateProfile } from '@/app/actions/profile'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Please log in</div>

    const { data: profile } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your student details here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={updateProfile} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" defaultValue={profile?.name || ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="parentWhatsapp">Parent WhatsApp</Label>
                                <Input id="parentWhatsapp" name="parentWhatsapp" defaultValue={profile?.parent_whatsapp || ''} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="class">Class</Label>
                                <Input id="class" name="class" defaultValue={profile?.class || ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="section">Section</Label>
                                <Input id="section" name="section" defaultValue={profile?.section || ''} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="photoUrl">Photo URL</Label>
                            <Input id="photoUrl" name="photoUrl" defaultValue={profile?.photo_url || ''} placeholder="https://example.com/photo.jpg" />
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
