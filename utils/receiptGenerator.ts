import jsPDF from 'jspdf'

// Helper to load image
const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.crossOrigin = "Anonymous"
        img.onload = () => resolve(img)
        img.onerror = () => resolve(img) // Resolve anyway to avoid crashing
    })
}

export const generateReceipt = async (transaction: any, student: any) => {
    const doc = new jsPDF()

    // --- Colors & Styles ---
    const primaryColor = [15, 23, 42] as [number, number, number] // Slate 900
    // const accentColor = [180, 150, 50] // Gold (unused variable)

    // --- 1. Header ---
    // School Name
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(...primaryColor)
    doc.text('SCHOOL ERP SYSTEM', 105, 20, { align: 'center' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text('123 Education Lane, Academic City, State 12345', 105, 28, { align: 'center' })
    doc.text('Phone: +91 98765 43210 | Email: admin@school.com', 105, 34, { align: 'center' })

    // Line Divider
    doc.setDrawColor(200, 200, 200)
    doc.line(10, 40, 200, 40)

    // --- 2. Receipt Meta ---
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('FEE RECEIPT', 105, 50, { align: 'center' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const receiptNo = transaction.id ? transaction.id.slice(0, 8).toUpperCase() : `REC-${Date.now().toString().slice(-6)}`
    doc.text(`Receipt No: ${receiptNo}`, 15, 60)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 60, { align: 'right' })

    // --- 3. Student Details Box ---
    doc.setFillColor(248, 250, 252)
    doc.rect(15, 65, 180, 25, 'F')
    doc.setDrawColor(226, 232, 240)
    doc.rect(15, 65, 180, 25, 'S')

    doc.setFont('helvetica', 'bold')
    doc.text("Student Name:", 20, 74)
    doc.text("Class / Section:", 110, 74)
    doc.text("Roll No:", 20, 82)
    doc.text("Payment Mode:", 110, 82)

    doc.setFont('helvetica', 'normal')
    doc.text(student.name || "N/A", 50, 74)
    doc.text(`${student.class || ""} - ${student.section || ""}`, 145, 74)
    doc.text(student.roll_no || "N/A", 50, 82)
    doc.text((transaction.payment_mode || "Cash").toUpperCase(), 145, 82)

    // --- 4. Fee Details Table ---
    let yPos = 100

    // Header
    doc.setFillColor(...primaryColor)
    doc.rect(15, yPos, 180, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text("Description", 20, yPos + 7)
    doc.text("Amount (INR)", 190, yPos + 7, { align: 'right' })

    yPos += 18
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')

    // Parse Items
    let items = transaction.items || []
    if (items.length === 0 && transaction.description) {
        // Fallback parse
        items = [{ name: transaction.description, amount: transaction.amount }]
    }

    items.forEach((item: any, index: number) => {
        doc.text(`${index + 1}. ${item.name}`, 20, yPos)
        doc.text(`₹ ${Number(item.amount).toFixed(2)}`, 190, yPos, { align: 'right' })

        // Dotted Line
        doc.setDrawColor(230, 230, 230);
        (doc as any).setLineDash([1, 1], 0);
        doc.line(15, yPos + 3, 195, yPos + 3);
        (doc as any).setLineDash([], 0);

        yPos += 10
    })

    // Total
    yPos += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text("TOTAL PAID:", 140, yPos)
    doc.text(`₹ ${Number(transaction.amount).toFixed(2)}`, 190, yPos, { align: 'right' })

    // --- 5. Footer ---
    yPos = 250
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.5)
    doc.line(140, yPos, 190, yPos)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text("Authorized Signatory", 165, yPos + 5, { align: 'center' })

    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text("This receipt is computer generated.", 105, 280, { align: 'center' })

    return doc.output('arraybuffer')
}

export const downloadReceipt = async (transaction: any, student: any) => {
    try {
        const buffer = await generateReceipt(transaction, student)
        const blob = new Blob([buffer], { type: "application/pdf" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `Receipt_${student.name}_${Date.now()}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error("Failed to generate receipt", error)
        alert("Could not generate receipt PDF.")
    }
}
