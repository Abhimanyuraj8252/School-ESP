import jsPDF from 'jspdf'

export const generateMarksheet = async (student: any, results: any[], examType: string) => {
    const doc = new jsPDF()

    // --- Header ---
    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.setTextColor(41, 128, 185) // Theme Blue
    doc.text("SCHOOL ESP HIGH SCHOOL", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    doc.text("Excellence in Education | Est. 1995", 105, 26, { align: "center" })

    // --- Exam Title ---
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text(`REPORT CARD: ${examType.toUpperCase()}`, 105, 40, { align: "center" })

    // --- Student Details ---
    doc.setFontSize(11)

    doc.text(`Student Name:`, 14, 55)
    doc.setFont("helvetica", "normal")
    doc.text(student.name || "N/A", 50, 55)

    doc.setFont("helvetica", "bold")
    doc.text(`Roll No:`, 120, 55)
    doc.setFont("helvetica", "normal")
    doc.text(student.roll_no || "N/A", 150, 55)

    doc.setFont("helvetica", "bold")
    doc.text(`Class/Section:`, 14, 62)
    doc.setFont("helvetica", "normal")
    doc.text(`${student.class || ""} - ${student.section || ""}`, 50, 62)

    doc.setFont("helvetica", "bold")
    doc.text(`Session:`, 120, 62)
    doc.setFont("helvetica", "normal")
    doc.text(`2025-2026`, 150, 62)

    // --- Marks Table Header ---
    let yPos = 75
    doc.setFillColor(41, 128, 185) // Blue header
    doc.rect(14, yPos, 182, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)

    doc.text("SUBJECT", 20, yPos + 7)
    doc.text("MAX MARKS", 100, yPos + 7, { align: 'center' })
    doc.text("OBTAINED", 140, yPos + 7, { align: 'center' })
    doc.text("GRADE", 180, yPos + 7, { align: 'center' })

    // --- Table Body ---
    yPos += 18
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "normal")

    results.forEach((r, i) => {
        const subjectName = r.subjects?.name || "Subject"
        const max = r.max_marks || 100
        const obtained = r.marks_obtained || 0
        const grade = getGrade(obtained, max)

        doc.text(`${i + 1}. ${subjectName}`, 20, yPos)
        doc.text(String(max), 100, yPos, { align: 'center' })
        doc.text(String(obtained), 140, yPos, { align: 'center' })
        doc.text(grade, 180, yPos, { align: 'center' })

        // Line
        doc.setDrawColor(230, 230, 230)
        doc.line(14, yPos + 3, 196, yPos + 3)
        yPos += 10
    })

    // --- Totals ---
    yPos += 5
    const totalMax = results.reduce((acc, curr) => acc + (curr.max_marks || 100), 0)
    const totalObtained = results.reduce((acc, curr) => acc + (curr.marks_obtained || 0), 0)
    const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0"

    doc.setFillColor(240, 240, 240)
    doc.rect(14, yPos, 182, 10, 'F') // Grey Footer
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "bold")

    doc.text("GRAND TOTAL", 20, yPos + 7)
    doc.text(String(totalMax), 100, yPos + 7, { align: 'center' })
    doc.text(String(totalObtained), 140, yPos + 7, { align: 'center' })
    doc.text(`${percentage}%`, 180, yPos + 7, { align: 'center' })

    // --- Footer / Result Summary ---
    yPos += 30
    const isPass = parseFloat(percentage) >= 33

    doc.setFontSize(14)
    if (isPass) {
        doc.setTextColor(46, 204, 113) // Green
        doc.text(`RESULT: PASSED`, 14, yPos)
    } else {
        doc.setTextColor(231, 76, 60) // Red
        doc.text(`RESULT: NEEDS IMPROVEMENT`, 14, yPos)
    }

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.text("Remarks: _______________________________", 14, yPos + 15)

    // Signatures
    const sigY = 250
    doc.text("Class Teacher", 40, sigY, { align: 'center' })
    doc.line(20, sigY - 5, 60, sigY - 5)

    doc.text("Principal", 170, sigY, { align: 'center' })
    doc.line(150, sigY - 5, 190, sigY - 5)

    // Disclaimer
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text("This is an electronically generated document. No signature required.", 105, 280, { align: "center" })

    return doc.output('arraybuffer')
}

// Helper: Grade Calculation
function getGrade(obtained: number, max: number) {
    const p = (obtained / max) * 100
    if (p >= 90) return 'A+'
    if (p >= 80) return 'A'
    if (p >= 70) return 'B+'
    if (p >= 60) return 'B'
    if (p >= 50) return 'C'
    if (p >= 33) return 'D'
    return 'F'
}

export const downloadMarksheet = async (student: any, results: any[], examType: string) => {
    try {
        const buffer = await generateMarksheet(student, results, examType)
        const blob = new Blob([buffer], { type: "application/pdf" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `Marksheet_${student.name}_${examType}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (e) {
        console.error("Marksheet Gen Error", e)
        alert("Failed to download marksheet")
    }
}
