import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStudentHomework } from "@/app/actions/student"
import { Calendar } from "lucide-react"

export default async function HomeworkPage() {
    const homeworkList = await getStudentHomework()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-serif text-primary">Homework & Notices</h1>

            <div className="grid gap-6">
                {homeworkList.map((hw) => (
                    <Card key={hw.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-semibold bg-secondary/10 text-secondary-dark px-2 py-1 rounded uppercase tracking-wide">
                                        {hw.subject}
                                    </span>
                                    <CardTitle className="mt-2 text-xl">{hw.title}</CardTitle>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(hw.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {hw.description}
                            </p>
                            {hw.due_date && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm font-medium text-red-600">
                                        Due Date: {new Date(hw.due_date).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {homeworkList.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No homework assignments found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
