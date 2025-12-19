'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { Loader2, Upload } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface AnswerSheetUploadProps {
    studentName: string
    onUploadComplete: (url: string) => void
}

export function AnswerSheetUpload({ studentName, onUploadComplete }: AnswerSheetUploadProps) {
    const [uploading, setUploading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const supabase = createClient()

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const filePath = `answer_sheets/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('exam-sheets') // Ensure this bucket exists!
            .upload(filePath, file)

        if (uploadError) {
            console.error('Upload error:', uploadError)
            toast({ title: "Upload Failed", description: uploadError.message, variant: "destructive" })
            setUploading(false)
            return
        }

        // Get public URL
        const { data } = supabase.storage.from('exam-sheets').getPublicUrl(filePath)

        onUploadComplete(data.publicUrl)
        setUploading(false)
        toast({ title: "Uploaded", description: `Answer sheet for ${studentName} uploaded.` })
    }

    return (
        <div className="flex items-center gap-2">
            <Input
                type="file"
                accept="image/*,application/pdf"
                className="w-full max-w-xs"
                onChange={handleUpload}
                disabled={uploading}
            />
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
    )
}
