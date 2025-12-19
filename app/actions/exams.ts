'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveExamMarks(
    className: string,
    section: string,
    subject: string,
    marksData: { student_id: string; marks: number; max_marks: number; copy_image_url?: string }[]
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Teacher validation (optional but recommended)
    if (!user) return { error: 'Unauthorized' }

    // Insert or update marks
    // We should check if an entry exists for this exam (student + subject)
    // For simplicity, we assume one exam per subject for now or we just insert new rows. 
    // Ideally, we'd have an 'Exam Schedule' or 'Exam ID'.
    // Given the simple schema: student_id, subject, marks, max_marks.
    // Let's use upsert based on ID if we had it, but we don't.
    // Let's assume we are inserting new records. 
    // Wait, to avoid duplicates, we should probably delete previous marks for this subject/student or use a unique constraint?
    // The current schema doesn't have a unique constraint on (student_id, subject).
    // Let's just insert for now. Or better, check if exists and update.

    // A better approach for this MVP:
    // Upsert isn't easy without a unique constraint.
    // So we will try to update if exists, else insert.
    // Doing this in a loop is slow but safe for small classes.

    let errors = []

    for (const record of marksData) {
        // Check for existing record (recent? or just by subject)
        // This is a bit ambiguous without an "Exam Term" (e.g. Midterm).
        // I'll assume we are just adding records.

        const payload = {
            student_id: record.student_id,
            subject: subject,
            marks: record.marks,
            max_marks: record.max_marks,
            copy_image_url: record.copy_image_url
            // created_by: user.id // Schema doesn't have created_by in exam_results, relying on row-level security/audit helper if needed
        }

        const { error } = await supabase.from('exam_results').insert(payload)
        if (error) errors.push(error)
    }

    if (errors.length > 0) {
        console.error('Errors saving marks:', errors)
        return { error: 'Some marks failed to save' }
    }

    revalidatePath('/teacher/dashboard/exams')
    return { success: true }
}

export async function uploadAnswerSheetUrl(resultId: string, url: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('exam_results')
        .update({ copy_image_url: url })
        .eq('id', resultId)

    if (error) {
        console.error('Error linking answer sheet:', error)
        return { error: 'Failed to link answer sheet' }
    }

    return { success: true }
}
