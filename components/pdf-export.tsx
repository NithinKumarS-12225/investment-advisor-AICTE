"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface PdfExportProps {
  messages: Message[]
  riskTolerance: string
  investmentReason: string
}

export function PdfExport({ messages, riskTolerance, investmentReason }: PdfExportProps) {
  const downloadPDF = () => {
    try {
      const content = generatePDFContent()

      // Create blob and download
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `investment-advisor-report-${Date.now()}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] PDF export error:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  const generatePDFContent = () => {
    let content = ""

    // Header
    content += "INVESTMENT ADVISOR CHAT REPORT\n"
    content += "=".repeat(50) + "\n\n"

    // Profile Info
    content += "YOUR INVESTMENT PROFILE\n"
    content += "-".repeat(50) + "\n"
    content += `Risk Tolerance: ${riskTolerance}\n`
    content += `Investment Goal: ${investmentReason}\n\n`

    // Conversation
    content += "CONVERSATION HISTORY\n"
    content += "-".repeat(50) + "\n\n"

    messages.forEach((message) => {
      const role = message.role === "user" ? "YOU" : "ADVISOR"
      content += `${role}:\n`
      content += `${message.content}\n\n`
    })

    // Footer
    content += "-".repeat(50) + "\n"
    content += `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`

    return content
  }

  return (
    <Button
      onClick={downloadPDF}
      disabled={messages.length === 0}
      className="px-3 py-2 bg-secondary text-secondary-foreground hover:bg-muted rounded-lg transition-all"
      title="Download conversation as text"
    >
      <Download className="h-4 w-4" />
    </Button>
  )
}
