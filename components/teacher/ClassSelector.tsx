'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { getTeacherClasses } from "@/app/actions/teacher"
import { useRouter, useSearchParams } from "next/navigation"

interface TeacherClass {
    id: string
    class_name: string
    section: string
    subject: string | null
}

export function ClassSelector() {
    const [classes, setClasses] = useState<TeacherClass[]>([])
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        getTeacherClasses().then(setClasses)
    }, [])

    const handleValueChange = (value: string) => {
        const [className, section] = value.split('|')
        const params = new URLSearchParams(searchParams)
        params.set('class', className)
        params.set('section', section)
        router.push(`?${params.toString()}`)
    }

    const currentData = searchParams.get('class') && searchParams.get('section')
        ? `${searchParams.get('class')}|${searchParams.get('section')}`
        : undefined

    return (
        <Select onValueChange={handleValueChange} value={currentData}>
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
                {classes.map((cls) => (
                    <SelectItem key={cls.id} value={`${cls.class_name}|${cls.section}`}>
                        {cls.class_name} - {cls.section} {cls.subject ? `(${cls.subject})` : ''}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
