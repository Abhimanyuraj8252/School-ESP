import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableRow, TableCell } from "@/components/ui/table"
import { Edit, Search, Trash2, UserPlus, Shield, GraduationCap, Briefcase } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { deleteUser } from "@/app/actions/users"
import Link from "next/link"

export default async function AdminStudentsPage() {
    const supabase = await createClient()

    // Fetch all users with profiles
    const { data: users } = await supabase
        .from('users')
        .select(`
            *,
            student_profiles (
                name,
                class,
                section,
                parent_whatsapp
            )
        `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <Link href="/admin/students/new">
                    <Button className="gap-2 bg-primary">
                        <UserPlus className="w-4 h-4" />
                        Add New User
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search by name, email, or role..."
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">User</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3">Details</th>
                                    <th scope="col" className="px-6 py-3">Added On</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.map((user) => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <a href={`/admin/students/${user.id}`} className="font-medium text-gray-900 hover:text-primary hover:underline block">
                                                {user.full_name || 'N/A'}
                                            </a>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold w-fit
                                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'teacher' ? 'bg-green-100 text-green-700' :
                                                        user.role === 'office' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-blue-100 text-blue-700'}`}>
                                                {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                                {user.role === 'teacher' && <GraduationCap className="w-3 h-3" />}
                                                {user.role === 'office' && <Briefcase className="w-3 h-3" />}
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {user.student_profiles?.class && user.student_profiles.class !== 'N/A' ? (
                                                <span className="block">Class: {user.student_profiles.class} - {user.student_profiles.section}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">No academic data</span>
                                            )}
                                            {user.student_profiles?.parent_whatsapp && user.student_profiles.parent_whatsapp !== 'N/A' && (
                                                <span className="block mt-1">Ph: {user.student_profiles.parent_whatsapp}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <form action={async () => {
                                                    "use server"
                                                    await deleteUser(user.id)
                                                }}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!users || users.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                            No users found in the database.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
