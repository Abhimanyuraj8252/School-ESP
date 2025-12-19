import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { createClient } from '@/utils/supabase/server'
import shortid from 'shortid'

export interface ReceiptData {
    transactionId: string
    date: string
    amount: number
    studentName: string
    class: string
    section: string
    paymentMode: 'cash' | 'online' | 'cheque'
    description?: string
}

export async function generateAndUploadReceipt(data: ReceiptData): Promise<string | null> {
    try {
        // 1. Create PDF
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
        const { width, height } = page.getSize()

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

        // Header
        page.drawRectangle({
            x: 0,
            y: height - 100,
            width: width,
            height: 100,
            color: rgb(0.05, 0.09, 0.16), // Dark Blue
        })

        page.drawText('SCHOOL ESP', {
            x: 50,
            y: height - 50,
            size: 24,
            font: fontBold,
            color: rgb(1, 1, 1),
        })

        page.drawText('Excellence in Education', {
            x: 50,
            y: height - 70,
            size: 12,
            font: font,
            color: rgb(0.9, 0.9, 0.9),
        })

        // Receipt Details
        const startY = height - 150
        const lineHeight = 20

        page.drawText('FEE RECEIPT', {
            x: width / 2 - 50,
            y: startY,
            size: 18,
            font: fontBold,
            color: rgb(0, 0, 0),
        })

        const drawRow = (label: string, value: string, y: number) => {
            page.drawText(label, { x: 50, y, size: 12, font: fontBold })
            page.drawText(value, { x: 200, y, size: 12, font: font })
        }

        let currentY = startY - 40
        drawRow('Receipt Data No:', `RCP-${data.transactionId.slice(-6).toUpperCase()}`, currentY)
        currentY -= lineHeight
        drawRow('Date:', data.date, currentY)
        currentY -= lineHeight
        drawRow('Student Name:', data.studentName, currentY)
        currentY -= lineHeight
        drawRow('Class:', `${data.class} - ${data.section}`, currentY)
        currentY -= lineHeight
        drawRow('Payment Mode:', data.paymentMode.toUpperCase(), currentY)

        if (data.description) {
            currentY -= lineHeight
            drawRow('Description:', data.description, currentY)
        }

        // Amount Box
        currentY -= 50
        page.drawRectangle({
            x: 40,
            y: currentY - 10,
            width: width - 80,
            height: 40,
            color: rgb(0.95, 0.95, 0.95),
            borderColor: rgb(0.8, 0.8, 0.8),
            borderWidth: 1,
        })

        page.drawText(`Total Amount Paid:`, {
            x: 60,
            y: currentY + 5,
            size: 14,
            font: fontBold,
            color: rgb(0, 0, 0),
        })

        page.drawText(`Rs. ${data.amount.toFixed(2)}`, {
            x: 350,
            y: currentY + 5,
            size: 14,
            font: fontBold,
            color: rgb(0, 0.5, 0), // Green
        })

        // Footer
        page.drawText('This is a computer generated receipt.', {
            x: width / 2 - 90,
            y: 50,
            size: 10,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
        })

        const pdfBytes = await pdfDoc.save()

        // 2. Upload to Supabase Storage
        const supabase = await createClient()
        const fileName = `receipt_${data.transactionId}_${shortid.generate()}.pdf`

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('receipts')
            .upload(fileName, pdfBytes, {
                contentType: 'application/pdf',
                upsert: true
            })

        if (uploadError) {
            console.error('Storage Upload Error:', uploadError)
            return null
        }

        // 3. Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('receipts')
            .getPublicUrl(fileName)

        return publicUrl

    } catch (error) {
        console.error('PDF Generation Error:', error)
        return null
    }
}
