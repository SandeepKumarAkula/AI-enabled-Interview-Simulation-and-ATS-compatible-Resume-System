"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { ResumeData } from "@/lib/types"

interface LatexEditorProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export default function LatexEditor({ data, onChange }: LatexEditorProps) {
  const [latexCode, setLatexCode] = useState("")
  const [pendingLatex, setPendingLatex] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      const latex = generateLatexFromData(data)
      setLatexCode(latex)
      setPendingLatex(latex)
      setIsInitialized(true)
    }
  }, [isInitialized])

  const handleCompileLatex = () => {
    try {
      setLatexCode(pendingLatex)
      const parsedData = parseLatexToData(pendingLatex, data)
      onChange(parsedData)
    } catch (error) {
      console.error("LaTeX compilation error:", error)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">LaTeX Source Code</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Edit the LaTeX code. Click <b>Compile LaTeX</b> to apply changes to the form and preview.
          </p>

          <Textarea
            value={pendingLatex}
            onChange={(e) => setPendingLatex(e.target.value)}
            className="font-mono text-sm min-h-96 p-4 bg-slate-50 dark:bg-slate-900 w-full resize-none lg:resize-vertical"
            placeholder="% LaTeX resume code here..."
          />

          <button
            onClick={handleCompileLatex}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Compile LaTeX
          </button>

          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-sm text-muted-foreground space-y-2">
            <p className="font-semibold">Supported LaTeX formats:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><code>\name{"{fullName}"}</code>, <code>\email{"{email}"}</code>, <code>\phone{"{phone}"}</code></li>
              <li><code>\summary{"{summary}"}</code></li>
              <li><code>\experience{"{jobTitle}{company}{location}{start}{end}{desc}"}</code></li>
              <li><code>\education{"{school}{degree}{field}{start-end}{grade}{gradeType}{desc}"}</code></li>
              <li><code>\skill{"{name}{level}"}</code></li>
              <li><code>\section{"{heading}{content1}{content2}..."}</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* -------------------- LATEX GENERATOR -------------------- */

function generateLatexFromData(data: ResumeData): string {
  let latex = "%% Generated Resume in LaTeX\n\n"

  if (data.fullName) latex += `\\name{${escapeLatex(data.fullName)}}\n`
  if (data.email) latex += `\\email{${escapeLatex(data.email)}}\n`
  if (data.phone) latex += `\\phone{${escapeLatex(data.phone)}}\n`
  if (data.location) latex += `\\location{${escapeLatex(data.location)}}\n`

  if (data.summary) latex += `\n\\summary{${escapeLatex(data.summary)}}\n`

  if (data.experience.length > 0) {
    latex += "\n%% Experience\n"
    data.experience.forEach((exp) => {
      const endDate = exp.currentlyWorking ? "Present" : exp.endDate
      latex += `\\experience{${escapeLatex(exp.jobTitle)}}{${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}{${escapeLatex(exp.startDate)} - ${escapeLatex(endDate)}}{${escapeLatex(exp.description)}}\n`
    })
  }

  if (data.education.length > 0) {
    latex += "\n%% Education\n"
    data.education.forEach((edu) => {
      latex += `\\education{${escapeLatex(edu.school)}}{${escapeLatex(edu.degree)}}{${escapeLatex(edu.field)}}{${escapeLatex(edu.startDate)} - ${escapeLatex(edu.endDate)}}{${escapeLatex(edu.grade)}}{${escapeLatex(edu.gradeType)}}{${escapeLatex(edu.description)}}\n`
    })
  }

  if (data.skills.length > 0) {
    latex += "\n%% Skills\n"
    data.skills.forEach((skill) => {
      latex += `\\skill{${escapeLatex(skill.name)}}{${escapeLatex(skill.level)}}\n`
    })
  }

  if (data.customFields.length > 0) {
    data.customFields.forEach((field) => {
      const contentLines = field.content.split("\n").map(c => `{${escapeLatex(c)}}`).join("")
      latex += `\n\\section{${escapeLatex(field.heading)}}${contentLines}\n`
    })
  }

  return latex
}

/* -------------------- LATEX PARSER -------------------- */

function parseLatexToData(latex: string, currentData: ResumeData): ResumeData {
  const newData = { ...currentData }

  const nameMatch = latex.match(/\\name\s*\{([^}]*)\}/)
  if (nameMatch) newData.fullName = unescapeLatex(nameMatch[1].trim())

  const emailMatch = latex.match(/\\email\s*\{([^}]*)\}/)
  if (emailMatch) newData.email = unescapeLatex(emailMatch[1].trim())

  const phoneMatch = latex.match(/\\phone\s*\{([^}]*)\}/)
  if (phoneMatch) newData.phone = unescapeLatex(phoneMatch[1].trim())

  const locationMatch = latex.match(/\\location\s*\{([^}]*)\}/)
  if (locationMatch) newData.location = unescapeLatex(locationMatch[1].trim())

  const summaryMatch = latex.match(/\\summary\s*\{([\s\S]*?)\}(?=\\|$)/)
  if (summaryMatch) newData.summary = unescapeLatex(summaryMatch[1].trim())

  /* EXPERIENCE */
  const experienceMatches = [...latex.matchAll(/\\experience\s*\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([\s\S]*?)\}/g)]
  newData.experience = experienceMatches.map((match) => {
    const [, jobTitle, company, location, dates, description] = match
    const [startDate, endDateRaw] = dates.split(" - ").map(s => s.trim())
    const endDate = endDateRaw === "Present" ? "" : endDateRaw

    return {
      id: Date.now().toString() + Math.random(),
      jobTitle: unescapeLatex(jobTitle),
      company: unescapeLatex(company),
      location: unescapeLatex(location),
      startDate: unescapeLatex(startDate),
      endDate: unescapeLatex(endDate),
      currentlyWorking: endDateRaw === "Present",
      description: unescapeLatex(description),
    }
  })

  /* EDUCATION — UPDATED */
  const educationMatches = [...latex.matchAll(
    /\\education\s*\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([\s\S]*?)\}/g
  )]

  newData.education = educationMatches.map((match) => {
    const [, school, degree, field, dates, grade, gradeType, description] = match
    const [startDate, endDate] = dates.split("-").map(s => s.trim())

    return {
      id: Date.now().toString() + Math.random(),
      school: unescapeLatex(school),
      degree: unescapeLatex(degree),
      field: unescapeLatex(field),
      startDate: unescapeLatex(startDate),
      endDate: unescapeLatex(endDate),
      grade: unescapeLatex(grade),
      gradeType: unescapeLatex(gradeType) as "cgpa" | "percentage" | "none",
      description: unescapeLatex(description),
    }
  })

  /* SKILLS */
  const skillMatches = [...latex.matchAll(/\\skill\s*\{([^}]*)\}\{([^}]*)\}/g)]
  newData.skills = skillMatches.map((match) => {
    const [, name, level] = match
    return {
      id: Date.now().toString() + Math.random(),
      name: unescapeLatex(name),
      level: unescapeLatex(level) as any,
    }
  })

  /* CUSTOM SECTIONS */
  const sectionPattern = /\\section\s*\{([^}]*)\}((?:\s*\{[^}]*\})*)/g
  const sectionMatches = [...latex.matchAll(sectionPattern)]

  newData.customFields = sectionMatches.map((match) => {
    const heading = unescapeLatex(match[1])
    const contentBlock = match[2]
    const contentMatches = [...contentBlock.matchAll(/\{([^}]*)\}/g)]
    const contentLines = contentMatches.map(m => unescapeLatex(m[1].trim()))

    return {
      id: Date.now().toString() + Math.random(),
      heading,
      content: contentLines.join("\n"),
    }
  })

  return newData
}

/* -------------------- LATEX ESCAPERS -------------------- */

function escapeLatex(text: string | undefined | null): string {
  if (!text) return ""
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\^/g, "\\^{}")
    .replace(/~/g, "\\~{}")
}

function unescapeLatex(text: string): string {
  return text
    .replace(/\\\{/g, "{")
    .replace(/\\\}/g, "}")
    .replace(/\\&/g, "&")
    .replace(/\\%/g, "%")
    .replace(/\\\$/g, "$")
    .replace(/\\#/g, "#")
    .replace(/\\_/g, "_")
    .replace(/\\\^{}/g, "^")
    .replace(/\\~{}/g, "~")
    .replace(/\\textbackslash{}/g, "\\")
}
