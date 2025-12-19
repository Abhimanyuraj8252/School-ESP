"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface ReportData {
    title: string
    summary: string
    columns: string[]
    rows: (string | number)[][]
    generatedAt: string
}

export function ReportActions({ data }: { data: ReportData }) {

    const generatePDF = () => {
        const doc = new jsPDF()

        // Header
        doc.setFillColor(26, 35, 126) // Navy Blue
        doc.rect(0, 0, 210, 40, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(22)
        doc.text("School ESP", 20, 20)
        doc.setFontSize(12)
        doc.text("Excellence in Education", 20, 28)

        // Report Info
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(18)
        doc.text(data.title, 20, 60)
        doc.setFontSize(11)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated on: ${data.generatedAt}`, 20, 68)
        doc.text(data.summary, 20, 75)

        // Table
        autoTable(doc, {
            startY: 85,
            head: [data.columns],
            body: data.rows,
            theme: 'grid',
            headStyles: { fillColor: [26, 35, 126] },
        })

        // Footer
        const pageCount = doc.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.setTextColor(150)
            doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' })
        }

        doc.save(`${data.title.replace(/\s+/g, '_')}.pdf`)
    }

    return (
        <div className="flex gap-2">
            <Button variant="outline" onClick={generatePDF}>
                <FileText className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
            <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Export DOCX (Pro)
            </Button>
        </div>
    )
}
