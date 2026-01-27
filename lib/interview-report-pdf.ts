"use client"

// Shared PDF generator so the PDF downloaded from the dashboard matches
// the PDF generated at the end of the interview.

export type CombinedReport = {
  interview?: {
    role?: string
    experienceLevel?: string
    interviewReadinessScore?: number
    roleSuitabilityScore?: number
    strengths?: string[]
    improvements?: string[]
    askedTopics?: string[]
    transcript?: Array<{ question: string; answer: string }>
    // Optional richer metrics (used by the existing UI)
    dimensionalScores?: {
      technical?: number
      problemSolving?: number
      communication?: number
      practical?: number
      behavioral?: number
      [k: string]: any
    }
    [k: string]: any
  }
  resume?: any
  [k: string]: any
}

export async function downloadInterviewReportPdf(report: CombinedReport, filename?: string) {
  if (!report) return

  const { jsPDF } = await import("jspdf")
  const pdf = new jsPDF({ unit: "mm", format: "a4" })

  const margin = 18
  const pageWidth = 210
  const pageHeight = 297
  const contentWidth = pageWidth - 2 * margin
  let y = 18

  // MODERN HEADER WITH BRAND BADGE
  pdf.setFillColor(46, 204, 113)
  pdf.roundedRect(margin, y, 10, 10, 2, 2, "F")
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(16)
  pdf.setTextColor(255, 255, 255)
  pdf.text("A", margin + 3, y + 7)

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(18)
  pdf.setTextColor(17, 24, 39)
  pdf.text("AI²SARS", margin + 13, y + 7)

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8)
  pdf.setTextColor(107, 114, 128)
  pdf.text("AI Interview Intelligence Report", margin + 13, y + 11)

  // Role and Experience on RIGHT side
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8)
  pdf.setTextColor(75, 85, 99)
  pdf.text(`Role: ${report.interview?.role || "-"}`, pageWidth - 60, y + 3)
  pdf.text(`Experience: ${report.interview?.experienceLevel || "-"}`, pageWidth - 60, y + 8)
  pdf.text(new Date().toLocaleDateString(), pageWidth - 60, y + 13)

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(6)
  pdf.setTextColor(107, 114, 128)
  pdf.text("Note: Interview Score = Overall performance", pageWidth - 60, y + 17)
  pdf.text("Role Match = Job fit percentage", pageWidth - 60, y + 20)

  y += 18

  // HERO SECTION
  const readiness = report.interview?.interviewReadinessScore ?? 0
  const suitability = report.interview?.roleSuitabilityScore ?? 0

  pdf.setFillColor(240, 253, 244)
  pdf.roundedRect(margin, y, contentWidth, 38, 3, 3, "F")
  pdf.setDrawColor(191, 233, 210)
  pdf.setLineWidth(0.5)
  pdf.roundedRect(margin, y, contentWidth, 38, 3, 3, "S")

  // Left side - main score
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(8)
  pdf.setTextColor(75, 85, 99)
  pdf.text("OVERALL INTERVIEW PERFORMANCE", margin + 4, y + 6)

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(38)
  pdf.setTextColor(22, 163, 74)
  pdf.text(String(readiness), margin + 4, y + 23)

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(12)
  pdf.setTextColor(75, 85, 99)
  pdf.text("/100", margin + 22, y + 20)

  const readinessLabel = readiness >= 75 ? "Excellent Performance" : readiness >= 55 ? "Good Performance" : "Needs Improvement"
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8)
  pdf.setTextColor(75, 85, 99)
  pdf.text(readinessLabel, margin + 4, y + 30)

  // Right side - circular score visualization
  const circleX = pageWidth - margin - 30
  const circleY = y + 19
  const circleRadius = 18

  pdf.setFillColor(250, 255, 251)
  pdf.circle(circleX, circleY, circleRadius, "F")
  pdf.setDrawColor(22, 163, 74)
  pdf.setLineWidth(1)
  pdf.circle(circleX, circleY, circleRadius, "S")

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(16)
  pdf.setTextColor(22, 163, 74)
  pdf.text(`${suitability}%`, circleX - 8, circleY + 2)

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(7)
  pdf.setTextColor(75, 85, 99)
  pdf.text("Job Fit %", circleX - 7, circleY + 7)

  y += 44

  // AI INTELLIGENCE INSIGHTS
  pdf.setFillColor(198, 216, 255)
  pdf.roundedRect(margin, y, contentWidth, 30, 3, 3, "F")

  // Add gradient effect manually with multiple rectangles
  for (let i = 0; i < 10; i++) {
    const alpha = i / 10
    const r = 198 + (161 - 198) * alpha
    const g = 216 + (140 - 216) * alpha
    const b = 255
    pdf.setFillColor(r, g, b)
    pdf.rect(margin, y + i * 3, contentWidth, 3, "F")
  }

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(9)
  pdf.setTextColor(255, 255, 255)
  pdf.text("Pre-trained AI Intelligence Insights", margin + 4, y + 6)

  const decision = suitability >= 70 || readiness >= 70 ? "HIRE" : "CONSIDER"

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(9)
  pdf.setTextColor(255, 255, 255)
  pdf.text(`Decision: ${decision}`, margin + 4, y + 12)

  // RL Metrics Grid
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(7)
  pdf.setTextColor(255, 255, 255)
  pdf.text(`Confidence: ${readiness}%`, margin + 4, y + 18)
  pdf.text(`Success Prediction: ${Math.round((readiness + suitability) / 2)}%`, margin + 4, y + 22)

  const reasoning = (report.interview?.strengths || []).slice(0, 1).join("") || "Confident and professional demeanor"
  const reasoningLines = pdf.splitTextToSize(`Reasoning: ${reasoning}`, contentWidth - 8)
  pdf.setFontSize(7)
  reasoningLines.slice(0, 2).forEach((line: string, idx: number) => {
    pdf.text(line, margin + 4, y + 26 + idx * 3)
  })

  y += 34

  // METRICS SECTION
  const dims = (report.interview as any)?.dimensionalScores || {}
  const metrics = [
    { label: "Technical", value: dims.technical || 0 },
    { label: "Problem-Solving", value: dims.problemSolving || 0 },
    { label: "Communication", value: dims.communication || 0 },
    { label: "Practical", value: dims.practical || 0 },
    { label: "Behavioral", value: dims.behavioral || 0 },
  ]

  const metricWidth = (contentWidth - 8) / 3
  const metricHeight = 20

  metrics.forEach((metric, idx) => {
    const col = idx % 3
    const row = Math.floor(idx / 3)
    const mx = margin + col * (metricWidth + 4)
    const my = y + row * (metricHeight + 4)

    pdf.setFillColor(238, 242, 255)
    pdf.roundedRect(mx, my, metricWidth, metricHeight, 2, 2, "F")
    pdf.setDrawColor(224, 231, 255)
    pdf.setLineWidth(0.3)
    pdf.roundedRect(mx, my, metricWidth, metricHeight, 2, 2, "S")

    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(7)
    pdf.setTextColor(67, 56, 202)
    pdf.text(metric.label, mx + 3, my + 5)

    const numValue = String(metric.value)

    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(14)
    pdf.setTextColor(49, 46, 129)
    pdf.text(numValue, mx + 3, my + 14)

    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(14)
    const numWidth = pdf.getTextWidth(numValue)

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8)
    pdf.setTextColor(67, 56, 202)
    pdf.text("/ 100", mx + 3 + numWidth + 2, my + 14)
  })

  y += Math.ceil(metrics.length / 3) * (metricHeight + 4) + 6

  // TWO COLUMN LAYOUT - Strengths & Improvements
  const leftColX = margin
  const rightColX = margin + contentWidth / 2 + 2
  const colWidth = contentWidth / 2 - 2

  if (y > pageHeight - 60) {
    pdf.addPage()
    y = margin
  }

  // Left - Strengths
  pdf.setFillColor(248, 250, 252)
  pdf.roundedRect(leftColX, y, colWidth, 50, 2, 2, "F")
  pdf.setDrawColor(226, 232, 240)
  pdf.setLineWidth(0.3)
  pdf.roundedRect(leftColX, y, colWidth, 50, 2, 2, "S")

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(8)
  pdf.setTextColor(34, 197, 94)
  pdf.text("Profile - Strengths", leftColX + 3, y + 5)

  const strengths = report.interview?.strengths || []
  let leftY = y + 10

  strengths.slice(0, 5).forEach((strength) => {
    const cleanStrength = String(strength).replace(/[^\x20-\x7E]/g, '')
    const lines = pdf.splitTextToSize(`- ${cleanStrength}`, colWidth - 6)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(7)
    pdf.setTextColor(31, 41, 55)
    lines.slice(0, 2).forEach((line: string) => {
      if (leftY < y + 48) {
        pdf.text(line, leftColX + 3, leftY)
        leftY += 3
      }
    })
  })

  // Right - Improvements
  pdf.setFillColor(248, 250, 252)
  pdf.roundedRect(rightColX, y, colWidth, 50, 2, 2, "F")
  pdf.setDrawColor(226, 232, 240)
  pdf.setLineWidth(0.3)
  pdf.roundedRect(rightColX, y, colWidth, 50, 2, 2, "S")

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(8)
  pdf.setTextColor(234, 88, 12)
  pdf.text("Profile - Improvements", rightColX + 3, y + 5)

  const improvements = report.interview?.improvements || []
  let rightY = y + 10

  improvements.slice(0, 5).forEach((improvement) => {
    const cleanImprovement = String(improvement).replace(/[^\x20-\x7E]/g, '')
    const lines = pdf.splitTextToSize(`- ${cleanImprovement}`, colWidth - 6)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(7)
    pdf.setTextColor(31, 41, 55)
    lines.slice(0, 2).forEach((line: string) => {
      if (rightY < y + 48) {
        pdf.text(line, rightColX + 3, rightY)
        rightY += 3
      }
    })
  })

  y += 54

  // TOPICS COVERED
  if (y > pageHeight - 30) {
    pdf.addPage()
    y = margin
  }

  pdf.setFillColor(248, 250, 252)
  pdf.roundedRect(margin, y, contentWidth, 15, 2, 2, "F")
  pdf.setDrawColor(226, 232, 240)
  pdf.setLineWidth(0.2)
  pdf.roundedRect(margin, y, contentWidth, 15, 2, 2, "S")

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(8)
  pdf.setTextColor(15, 23, 42)
  pdf.text("Topics Covered", margin + 3, y + 5)

  const topics = (report.interview?.askedTopics || []).length > 0
    ? (report.interview?.askedTopics || []).join(", ")
    : "Not captured"
  const topicLines = pdf.splitTextToSize(topics, contentWidth - 6)
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(7)
  pdf.setTextColor(75, 85, 99)
  let topicY = y + 9
  topicLines.slice(0, 2).forEach((line: string) => {
    pdf.text(line, margin + 3, topicY)
    topicY += 3
  })

  y += 19

  // TRANSCRIPT HIGHLIGHTS
  if (y > pageHeight - 50) {
    pdf.addPage()
    y = margin
  }

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(9)
  pdf.setTextColor(15, 23, 42)
  pdf.text("Transcript Highlights", margin, y)
  y += 6

  const transcript = (report.interview?.transcript || []) as Array<any>
  transcript.forEach((entry, idx) => {
    if (y > pageHeight - 40) {
      pdf.addPage()
      y = margin + 5
    }

    const qText = `Q${idx + 1}: ${entry.question}`
    const qLines = pdf.splitTextToSize(qText, contentWidth - 8)
    const qBoxHeight = Math.min(qLines.length * 3.5 + 4, 18)

    pdf.setFillColor(224, 242, 254)
    pdf.roundedRect(margin, y, contentWidth, qBoxHeight, 2, 2, "F")
    pdf.setDrawColor(186, 230, 253)
    pdf.setLineWidth(0.4)
    pdf.roundedRect(margin, y, contentWidth, qBoxHeight, 2, 2, "S")

    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(7)
    pdf.setTextColor(14, 165, 233)
    let qY = y + 4
    qLines.slice(0, 3).forEach((line: string) => {
      pdf.text(line, margin + 3, qY)
      qY += 3.5
    })

    y += qBoxHeight + 5

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(7)
    pdf.setTextColor(31, 41, 55)
    const cleanAnswer = String(entry.answer || "").replace(/[^\x20-\x7E\n]/g, '')
    const ansLines = pdf.splitTextToSize(cleanAnswer, contentWidth - 6)
    ansLines.slice(0, 6).forEach((line: string) => {
      if (y > pageHeight - 12) {
        pdf.addPage()
        y = margin + 5
      }
      pdf.text(line, margin + 3, y)
      y += 3
    })
    y += 6
  })

  // FOOTER
  if (y > pageHeight - 15) {
    pdf.addPage()
    y = margin
  }

  y = pageHeight - 10
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(7)
  pdf.setTextColor(107, 114, 128)
  pdf.text("AI²SARS • AI Interview Intelligence Report", pageWidth / 2, y, { align: "center" })

  pdf.save(filename || `ai-interview-report-${Date.now()}.pdf`)
}
