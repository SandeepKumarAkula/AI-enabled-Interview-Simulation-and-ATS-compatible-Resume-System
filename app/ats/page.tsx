"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ChevronLeft, Upload, AlertCircle, CheckCircle, TrendingUp, Download, X } from "lucide-react"
import { useToast } from "@/components/toast"
import { fetchWithAuth } from "@/lib/clientAuth"
import { useGlobalLoading } from "@/components/global-loading-provider"
// fetchWithAuth removed because ATS history feature was removed

interface ATSResult {
  score: number
  strengths: string[]
  weaknesses: string[]
  improvements: {
    category: string
    suggestions: string[]
  }[]
  keywordMatches: {
    matched: string[]
    missing: string[]
  }
 
  formatting: {
    hasContactInfo: boolean
    hasClearSections: boolean
    isATSFriendly: boolean
    hasQuantifiableMetrics: boolean
    hasActionVerbs: boolean
  }
  globalScores: {
    keyword: number
    formatting: number
    content: number
    structure: number
  }
}

export default function ATSPage() {
  const { addToast } = useToast()
  const { withGlobalLoading } = useGlobalLoading()
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [uploadedResume, setUploadedResume] = useState<{
    fileName: string
    fileSize: number
    text: string
  } | null>(null)
  const [result, setResult] = useState<ATSResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"input" | "result">("input")
  const [isDragging, setIsDragging] = useState(false)
  

  // Enhanced keyword extraction with LaTeX support
  const extractKeywords = (text: string): string[] => {
    const stopWords = new Set([
      "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
      "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
      "do", "does", "did", "will", "would", "should", "could", "may", "might",
      "can", "must", "that", "this", "these", "those", "from", "with", "by",
      "as", "if", "about", "which", "how", "why", "what", "when", "where", "who",
      "also", "more", "than", "just", "such", "very", "your", "our", "their"
    ])

    // Remove LaTeX commands and special characters
    const cleanText = text
      .toLowerCase()
      .replace(/\\[a-z]+\{[^}]*\}/g, " ") // Remove LaTeX commands
      .replace(/[\\{}*_~`\[\]()]/g, " ") // Remove LaTeX special chars
      .replace(/\$([^$]*)\$/g, " $1 ") // Handle math mode

    const words = cleanText
      .split(/\s+/)
      .filter(word => {
        const clean = word.replace(/[^a-z0-9\+\#]/g, "")
        return clean.length > 2 && !stopWords.has(clean)
      })
      .map(w => w.replace(/[^a-z0-9\+\#]/g, ""))

    return [...new Set(words)]
  }

  // Action verbs for resume evaluation
  const actionVerbs = new Set([
    "achieved", "administered", "advanced", "advised", "advocated", "analyzed",
    "assisted", "assured", "attained", "balanced", "budgeted", "built", "calculated",
    "championed", "changed", "clarified", "coached", "combined", "communicated",
    "coordinated", "created", "curated", "decreased", "delivered", "demonstrated",
    "designed", "determined", "developed", "directed", "discovered", "documented",
    "drove", "educated", "elevated", "enabled", "engineered", "enhanced", "established",
    "evaluated", "examined", "exceeded", "executed", "expanded", "explained", "explored",
    "facilitated", "fostered", "founded", "generated", "guided", "handled", "headed",
    "identified", "illuminated", "implemented", "improved", "increased", "influenced",
    "informed", "initiated", "innovated", "integrated", "introduced", "invested",
    "investigated", "launched", "leveraged", "liaised", "led", "managed", "maximized",
    "mentored", "minimized", "mobilized", "modernized", "monitored", "motivated",
    "negotiated", "nurtured", "optimized", "orchestrated", "organized", "oriented",
    "originated", "outperformed", "oversaw", "partnered", "pioneered", "planned",
    "played", "promoted", "proposed", "protected", "provided", "published", "questioned",
    "recognized", "recommended", "reconciled", "reconstructed", "redesigned", "reduced",
    "refined", "reformed", "regenerated", "regulated", "reinforced", "relaunched",
    "renewed", "reorganized", "repaired", "replaced", "reported", "repositioned",
    "represented", "resolved", "resourced", "restored", "restructured", "resulted",
    "retained", "revamped", "revealed", "reversed", "reviewed", "revised", "revolutionized",
    "risked", "safeguarded", "saved", "scaled", "scheduled", "secured", "selected",
    "served", "shaped", "shared", "shortlisted", "showed", "simplified", "simulated",
    "solved", "sourced", "spearheaded", "specified", "sponsored", "stabilized",
    "standardized", "steered", "streamlined", "strengthened", "structured", "studied",
    "submitted", "succeeded", "supported", "surpassed", "surveyed", "sustained",
    "synthesized", "tackled", "targeted", "taught", "tested", "tracked", "trained",
    "transformed", "transitioned", "translated", "triggered", "tripled", "uncovered",
    "unified", "upgraded", "validated", "valued", "volunteered", "welded",
    "widened", "won", "wondered", "worked", "yielded"
  ])

  // Global resume evaluation
  const evaluateAgainstGlobalStandards = (resume: string): Partial<ATSResult> => {
    const resumeLower = resume.toLowerCase()
    const wordCount = resume.split(/\s+/).length
    
    // Check for key sections
    const sections = {
      summary: /professional\s+summary|executive\s+summary|about|overview|profile/i.test(resume),
      experience: /experience|employment|work\s+history|professional\s+background/i.test(resume),
      education: /education|degree|university|college|school|academic/i.test(resume),
      skills: /skills|expertise|technical|competencies|proficiency/i.test(resume),
      projects: /projects?|portfolio|case\s+studies|achievements/i.test(resume),
      certifications: /certifications?|licenses?|awards?|credentials/i.test(resume)
    }

    // Count action verbs
    const words = resumeLower.split(/\s+/)
    let actionVerbCount = 0
    words.forEach(word => {
      if (actionVerbs.has(word.replace(/[^a-z]/g, ""))) {
        actionVerbCount++
      }
    })

    // Check for metrics
    const metricsMatch = resume.match(/\d+%|\$[\d,]+|[\d,]+\s*(million|thousand|units|customers|users|team|members)/gi)
    const hasMetrics = (metricsMatch?.length || 0) > 0

    // ATS-friendly check
    const hasSpecialChars = /[•→◦◆★▪▫■□]/g.test(resume)
    const isATSFriendly = !hasSpecialChars

    // Contact info
    const hasEmail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/.test(resume)
    const hasPhone = /(\+?1?)[\s.-]?\(?([0-9]{3})\)?[\s.-]?([0-9]{3})[\s.-]?([0-9]{4})/.test(resume)

    return {
      formatting: {
        hasContactInfo: hasEmail || hasPhone,
        hasClearSections: Object.values(sections).filter(Boolean).length >= 3,
        isATSFriendly,
        hasQuantifiableMetrics: hasMetrics,
        hasActionVerbs: actionVerbCount > 5
      } as any,
      globalScores: {
        keyword: 50,
        formatting: isATSFriendly ? 80 : 40,
        content: (Object.values(sections).filter(Boolean).length / 6) * 100,
        structure: (wordCount >= 250 && wordCount <= 1200) ? 80 : wordCount < 250 ? 30 : 60
      } as any
    }
  }

  // AI-powered ATS calculation with ML insights
  const calculateATSScore = (resume: string, jobDesc: string, aiData?: any): ATSResult => {
    const resumeKeywords = extractKeywords(resume)
    const jobKeywords = extractKeywords(jobDesc)
    const hasJobDescription = jobDesc.trim().length > 20

    // Evidence-based strengths/weaknesses from API
    const strengths: string[] = Array.isArray(aiData?.evidenceStrengths) ? aiData.evidenceStrengths : []
    const weaknesses: string[] = Array.isArray(aiData?.evidenceWeaknesses) ? aiData.evidenceWeaknesses : []

    // Extract matched/missing keywords
    let matched: string[] = []
    let missing: string[] = []
    
    if (hasJobDescription && jobKeywords.length > 0) {
      matched = resumeKeywords.filter(k => jobKeywords.includes(k))
      missing = jobKeywords.filter(k => !resumeKeywords.includes(k)).slice(0, 10)
    }

    // Global evaluation for formatting
    const globalEval = evaluateAgainstGlobalStandards(resume)
    const formatScore = globalEval.formatting || {
      hasContactInfo: false,
      hasClearSections: false,
      isATSFriendly: false,
      hasQuantifiableMetrics: false,
      hasActionVerbs: false
    }

    // Use overall score from API (calculated by RL agent + validation)
    const finalScore = aiData?.overallScore || 50

    // Use AI-generated suggestions from API (no client-side generation)
    const aiSuggestions = aiData?.improvementSuggestions || []
    
    return {
      score: Math.round(finalScore),
      strengths: strengths.length > 0 ? strengths : ["Resume analysis complete"],
      weaknesses: weaknesses.length > 0 ? weaknesses : ["No major issues detected"],
      improvements: aiSuggestions,
      keywordMatches: { matched, missing },
      formatting: formatScore as any,
      globalScores: globalEval.globalScores || { keyword: 50, formatting: 50, content: 50, structure: 50 }
    }
  }

  const handleAnalyze = async () => {
    // Use uploaded resume if available, otherwise use manual text
    const finalResumeText = uploadedResume?.text || resumeText
    
    if (!finalResumeText.trim()) {
      addToast("Please upload a resume or enter text manually", 'error', 4000)
      return
    }

    setLoading(true)
    try {
      await withGlobalLoading(async () => {
        const aiResponse = await fetchWithAuth("/api/analyze-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume: finalResumeText,
            jobDescription: jobDescription
          })
        })

        const aiData = await aiResponse.json()
        
        // Handle validation errors (strict resume validation failed)
        if (!aiData.success) {
          if (aiData.validationIssues && aiData.validationIssues.length > 0) {
            const issues = aiData.validationIssues.join(", ")
            addToast(`Invalid Resume: ${issues}`, 'error', 5000)
          } else {
            addToast(`${aiData.error || "Error analyzing resume"}`, 'error', 4000)
          }
          return
        }

        setAiAnalysis(aiData.analysis)

        const atsResult = calculateATSScore(finalResumeText, jobDescription, aiData.analysis)
        setResult(atsResult)
        setActiveTab("result")
      }, "Analyzing resume")
    } catch (error) {
      console.error("Analysis error:", error)
      addToast("Error analyzing resume. Please try again.", 'error', 4000)
    } finally {
      setLoading(false)
    }
  }

  // Save handler removed — ATS history feature disabled per user request

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`)
    addToast(`Uploading ${file.name}...`, 'info', 2000)

    try {
      // Read file as array buffer
      const buffer = await file.arrayBuffer()

      // Detect file type
      const fileName = file.name.toLowerCase()
      const isPDF = fileName.endsWith('.pdf')
      const isDOCX = fileName.endsWith('.docx')
      const isText = fileName.endsWith('.txt') || fileName.endsWith('.tex')

      let extractedText = ''

      // Extract based on file type
      if (isPDF) {
        try {
          const { extractPDFText } = await import('@/lib/pdf-extract-simple')
          extractedText = await extractPDFText(buffer)
          console.log(`PDF extracted successfully: ${extractedText?.length || 0} characters`)
        } catch (err: any) {
          // Image-based PDF or extraction failed
          setUploadedResume(null)
          addToast('Cannot read this PDF. Please copy text and paste below, or convert to DOCX.', 'info', 6000)
          setTimeout(() => {
            const textarea = document.querySelector('textarea')
            if (textarea) textarea.focus()
          }, 100)
          return
        }
      } else if (isDOCX) {
        try {
          const mammoth = await import('mammoth')
          const result = await mammoth.extractRawText({ arrayBuffer: buffer })
          extractedText = result.value || ''
        } catch (err: any) {
          console.error('DOCX extraction failed:', err)
          addToast('Could not extract DOCX. Try TXT format instead.', 'error', 5000)
          return
        }
      } else if (isText) {
        // Read text file directly
        const decoder = new TextDecoder()
        extractedText = decoder.decode(buffer)
      } else {
        addToast('Unsupported file format. Use PDF, DOCX, or TXT.', 'error', 5000)
        return
      }

      // Validate extraction (very lenient - only check if we have SOMETHING)
      if (!extractedText || extractedText.trim().length < 10) {
        addToast('File contains too little text. Try DOCX or paste manually.', 'error', 5000)
        setUploadedResume(null)
        return
      }

      // Success - save resume
      setUploadedResume({
        fileName: file.name,
        fileSize: file.size,
        text: extractedText.trim()
      })

      addToast(`${file.name} uploaded! (${extractedText.length} characters)`, 'success', 4000)
      console.log(`Successfully extracted ${extractedText.length} characters`)
    } catch (error: any) {
      console.error('Upload error:', error)
      addToast(`Upload failed: ${error.message}`, 'error', 5000)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      // Create a synthetic event to reuse handleResumeUpload
      const syntheticEvent = {
        target: { files: [file] }
      } as any
      await handleResumeUpload(syntheticEvent)
    }
  }

  const downloadPDF = () => {
    if (!result || !aiAnalysis) return

    const rl = aiAnalysis?.rlAgentDecision
    const improvements = result.improvements || []
    const matchedSkills = aiAnalysis?.jobAnalysis?.matchedSkills || []
    const missingSkills = aiAnalysis?.jobAnalysis?.missingSkills || []
    const componentScores = aiAnalysis?.resumeComponentScores || {}

    // Build validation grid with actual component scores
    const validationItems = [
      { label: "Validation Score", value: `${aiAnalysis?.validationScore ?? 0}%`, isScore: true },
      { label: "Contact Info", value: componentScores.hasContactInfo ? '✓' : '✗', isScore: false },
      { label: "Education", value: componentScores.hasEducation ? '✓' : '✗', isScore: false },
      { label: "Experience", value: componentScores.hasExperience ? '✓' : '✗', isScore: false },
      { label: "Skills", value: componentScores.hasSkills ? '✓' : '✗', isScore: false },
      { label: "Structure", value: componentScores.hasStructure ? '✓' : '✗', isScore: false },
      { label: "Professional Language", value: componentScores.professionalLanguage ? '✓' : '✗', isScore: false }
    ]

    const renderedReport = `
      <div class="hero">
        <div>
          <p class="eyebrow">YOUR ATS SCORE</p>
          <div class="score-row">
            <span class="score">${result.score}</span>
            <span class="score-outof">/ 100</span>
          </div>
          <p class="caption">${result.score >= 80 ? "Your resume is well-optimized for ATS systems." : result.score >= 60 ? "Good potential with room for optimization." : "Needs improvements to pass ATS filters."}</p>
        </div>
        <div class="circle-score">
          <div class="circle-score__value">${result.score}%</div>
          <div class="circle-score__label">${result.score >= 60 ? (result.score >= 80 ? "Excellent" : "Good") : result.score >= 40 ? "Fair" : "Needs Work"}</div>
        </div>
      </div>

      <section class="section gradient-purple">
        <div class="section-title">
          <span class="icon">📈</span>
          <span>Pre-trained AI Intelligence Insights</span>
        </div>
        ${rl ? `
          <div class="rl-card">
            <div class="rl-grid">
              <div class="rl-cell">
                <div class="rl-label">Decision</div>
                <div class="rl-value">${rl.decision === 'HIRE' ? 'HIRE' : rl.decision === 'REJECT' ? 'REJECT' : 'CONSIDER'}</div>
              </div>
              <div class="rl-cell">
                <div class="rl-label">Confidence</div>
                <div class="rl-value">${rl.confidence}</div>
                <div class="rl-sub">Q-Value: ${rl.qValue}</div>
              </div>
              <div class="rl-cell">
                <div class="rl-label">Success Prediction</div>
                <div class="rl-value">${rl.predictedSuccess}</div>
              </div>
            </div>
            <div class="rl-reason">
              <div class="rl-label">Agent Reasoning</div>
              <div class="rl-text">${rl.reasoning}</div>
            </div>
            <div class="rl-meta">Algorithm: ${rl.algorithm} • Candidate ID: ${rl.candidateId}</div>
          </div>
        ` : '<div class="muted">AI agent details unavailable.</div>'}
      </section>

      <section class="section soft-card">
        <div class="section-title">
          <span class="icon">✔️</span>
          <span>Resume Structure Validation</span>
        </div>
        <div class="validation-grid">
          ${validationItems.map(item => `
            <div class="validation-item">
              <div class="label">${item.label}</div>
              <div class="val ${item.isScore ? 'big' : ''} ${item.value === '✓' ? 'success' : item.value === '✗' ? 'warning' : ''}">${item.value}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="metrics">
        <div class="metric"><div class="metric-label">Detected Skills</div><div class="metric-value">${aiAnalysis?.skillCount ?? 0}</div><div class="metric-sub">unique technical skills</div></div>
        <div class="metric"><div class="metric-label">Quality Score</div><div class="metric-value">${aiAnalysis?.professionalScore ?? 0}%</div><div class="metric-sub">${aiAnalysis?.resumeQuality ?? ''}</div></div>
        <div class="metric"><div class="metric-label">Semantic Alignment</div><div class="metric-value">${aiAnalysis?.semanticScore ?? 0}%</div><div class="metric-sub">${aiAnalysis?.semanticAlignment ?? ''}</div></div>
        <div class="metric"><div class="metric-label">Professional Tone</div><div class="metric-value">${aiAnalysis?.toneConfidence ?? 0}%</div><div class="metric-sub">${aiAnalysis?.isProfessional ? 'Professional' : 'Needs improvement'}</div></div>
      </section>

      <section class="section plain">
        <div class="section-title"><span class="icon">🤖</span><span>AI Model Architecture</span></div>
        <div class="model-grid">
          <div><span class="bold">Architecture:</span> ${aiAnalysis?.modelInfo?.architecture ?? '—'}</div>
          <div><span class="bold">Training Data:</span> ${aiAnalysis?.modelInfo?.trainingData ?? '—'}</div>
          <div><span class="bold">Generic AI:</span> ${aiAnalysis?.modelInfo?.isGenericAI ? 'Yes ✓' : 'No'}</div>
        </div>
        <div class="model-sub">
          Semantic: ${aiAnalysis?.modelInfo?.semanticModel ?? '—'} • Quality: ${aiAnalysis?.modelInfo?.qualityModel ?? '—'} • NER: ${aiAnalysis?.modelInfo?.nerModel ?? '—'} • Tone: ${aiAnalysis?.modelInfo?.sentimentModel ?? '—'}
        </div>
      </section>

      <section class="two-col">
        <div class="col">
          <div class="section-title"><span class="icon"></span><span>Strengths</span></div>
          <ul class="list">${result.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="col">
          <div class="section-title"><span class="icon">⚠️</span><span>Weaknesses</span></div>
          <ul class="list">${result.weaknesses.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
      </section>

      <section class="section plain">
        <div class="section-title"><span class="icon">📋</span><span>Improvement Suggestions</span></div>
        ${improvements.map((imp: any) => `
          <div class="suggest">
            <div class="suggest-title">${imp.category}</div>
            <ul class="list">${(imp.suggestions || []).map((s: string) => `<li>${s}</li>`).join('')}</ul>
          </div>
        `).join('') || '<div class="muted">No suggestions provided.</div>'}
      </section>

      <section class="two-col">
        <div class="col">
          <div class="section-title"><span class="icon">👍</span><span>Matched Keywords</span></div>
          <div class="pills">${matchedSkills.slice(0, 20).map((s: string) => `<span class="pill">${s}</span>`).join('') || '<span class="muted">None</span>'}</div>
        </div>
        <div class="col">
          <div class="section-title"><span class="icon">➕</span><span>Missing Keywords</span></div>
          <div class="pills">${missingSkills.slice(0, 20).map((s: string) => `<span class="pill warn">${s}</span>`).join('') || '<span class="muted">None</span>'}</div>
        </div>
      </section>
    `

    const printWindow = window.open("", "", "height=900,width=1100")
    if (!printWindow) return

    printWindow.document.write(`
      <html><head><title>AI²SARS ATS Report</title>
      <style>
        * { box-sizing: border-box; }
        @page { size: A4; margin: 10mm; }
        body {
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          margin: 0;
          padding: 14px;
          background: #f3f7ff;
          color: #0f172a;
          -webkit-print-color-adjust: exact;
        }
        .page { max-width: 920px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 18px 20px 20px; box-shadow: 0 8px 28px rgba(15, 23, 42, 0.12); }
        .brand { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 800; color: #111827; margin: 4px 0 14px; }
        .brand-badge { width: 36px; height: 36px; border-radius: 8px; background: #2ecc71; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 18px; }
        .hero { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; align-items: center; background: #f0fdf4; border: 1px solid #bfe9d2; border-radius: 12px; padding: 16px 18px; }
        .eyebrow { margin: 0 0 4px; font-size: 12px; font-weight: 700; color: #4b5563; letter-spacing: 0.04em; }
        .score-row { display: flex; align-items: baseline; gap: 6px; }
        .score { font-size: 60px; font-weight: 800; color: #16a34a; line-height: 1; }
        .score-outof { font-size: 20px; color: #4b5563; }
        .caption { margin: 6px 0 0; color: #4b5563; font-size: 13px; }
        .circle-score { width: 140px; height: 140px; border-radius: 18px; border: 2px solid #16a34a; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #16a34a; font-weight: 700; background: #fafffb; }
        .circle-score__value { font-size: 30px; }
        .circle-score__label { font-size: 12px; color: #4b5563; margin-top: 4px; }
        .section { border-radius: 14px; padding: 16px; margin: 16px 0; }
        .gradient-purple { background: linear-gradient(135deg, #c6d8ff 0%, #b5c6ff 20%, #a18cff 60%, #7c4dff 100%); color: #fff; }
        .soft-card { background: linear-gradient(135deg, #fdf2ff 0%, #f2f7ff 100%); border: 1px solid #f3e8ff; }
        .plain { background: #f8fafc; border: 1px solid #e2e8f0; }
        .section-title { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 16px; margin-bottom: 12px; }
        .section-title .icon { font-size: 16px; }
        .rl-card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.25); border-radius: 12px; padding: 12px; }
        .rl-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
        .rl-cell { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 10px; }
        .rl-label { font-size: 12px; color: rgba(255,255,255,0.85); }
        .rl-value { font-size: 20px; font-weight: 800; margin-top: 2px; }
        .rl-sub { font-size: 11px; color: rgba(255,255,255,0.75); }
        .rl-reason { margin-top: 10px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 10px; font-size: 12px; color: #fff; }
        .rl-meta { margin-top: 8px; font-size: 11px; color: rgba(255,255,255,0.8); }
        .validation-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
        .validation-item { background: #fff; border: 1px solid #f1e5ff; border-radius: 10px; padding: 10px; }
        .validation-item .label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
        .validation-item .val { font-size: 16px; font-weight: 800; color: #16a34a; }
        .validation-item .val.big { font-size: 22px; }
        .validation-item .val.success { color: #16a34a !important; background: #f0fdf4 !important; padding: 4px 8px; border-radius: 6px; display: inline-block; }
        .validation-item .val.warning { color: #dc2626 !important; background: #fee2e2 !important; padding: 4px 8px; border-radius: 6px; display: inline-block; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px; margin: 16px 0; }
        .metric { background: #eef2ff; border: 1px solid #e0e7ff; border-radius: 12px; padding: 12px; }
        .metric-label { font-size: 12px; color: #4338ca; font-weight: 700; margin-bottom: 4px; }
        .metric-value { font-size: 22px; font-weight: 800; color: #312e81; }
        .metric-sub { font-size: 11px; color: #4338ca; }
        .model-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; font-size: 13px; color: #1f2937; }
        .model-sub { margin-top: 10px; font-size: 12px; color: #4b5563; }
        .bold { font-weight: 700; }
        .two-col { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin: 16px 0; }
        .col { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; }
        .list { padding-left: 18px; margin: 6px 0 0; color: #1f2937; font-size: 13px; }
        .suggest { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; margin-bottom: 10px; background: #fff; }
        .suggest-title { font-weight: 700; margin-bottom: 6px; color: #0f172a; }
        .pills { display: flex; flex-wrap: wrap; gap: 6px; }
        .pill { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #e0f2fe; color: #0ea5e9; font-size: 12px; font-weight: 700; border: 1px solid #bae6fd; }
        .pill.warn { background: #fef3c7; color: #d97706; border-color: #fcd34d; }
        .muted { color: #9ca3af; font-size: 12px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 10px; }
        @media print { body { padding: 6px; background: white; } .page { max-width: 100%; box-shadow: none; } }
      </style>
      </head><body>
        <div class="page">
          <div class="brand"><span class="brand-badge">A</span><span>AI²SARS</span></div>
          ${renderedReport}
          <div class="footer">AI²SARS • ATS insights</div>
        </div>
      </body></html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#f0f0f0] bg-gradient-to-b from-white via-[#ecfdf5] to-[#ffffff]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#2ecc71] hover:text-[#27ae60] mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
            AI-Powered ATS <span className="text-[#2ecc71]">Resume Analyzer</span>
          </h1>
          <p className="text-[#666666] max-w-2xl">
            Upload your resume and optionally provide a job description to get AI-powered ATS scoring, 
            detailed feedback, and actionable improvement suggestions. Works with LaTeX-based resumes.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Tabs with better navigation */}
        <div className="flex gap-6 mb-8 border-b border-[#e0e0e0]">
          <button
            onClick={() => setActiveTab("input")}
            className={`pb-4 px-0 font-semibold transition-colors relative ${
              activeTab === "input"
                ? "text-[#2ecc71]"
                : "text-[#666666] hover:text-[#222222]"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === "input" ? "bg-[#2ecc71] text-white" : "bg-gray-200 text-gray-600"}`}>
                1
              </span>
              Upload & Analyze
            </span>
            {activeTab === "input" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2ecc71]"></div>}
          </button>
          {result && (
            <button
              onClick={() => setActiveTab("result")}
              className={`pb-4 px-0 font-semibold transition-colors relative ${
                activeTab === "result"
                  ? "text-[#2ecc71]"
                  : "text-[#666666] hover:text-[#222222]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === "result" ? "bg-[#2ecc71] text-white" : "bg-gray-200 text-gray-600"}`}>
                  2
                </span>
                Analysis Results
              </span>
              {activeTab === "result" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2ecc71]"></div>}
            </button>
          )}
        </div>

        {/* Input Tab */}
        {activeTab === "input" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Job Description (Optional) */}
            <div>
              <label className="block text-lg font-semibold text-[#1a1a1a] mb-2">
                Job Description <span className="text-sm text-[#666666] font-normal">(Optional)</span>
              </label>
              <p className="text-sm text-[#666666] mb-3">
                Paste a job description to get detailed matching analysis. Leave blank to evaluate against global ATS standards.
              </p>
              <Textarea
                placeholder="Paste job description here... (responsibilities, requirements, skills, etc.)"
                value={jobDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                className="w-full h-72 p-4 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] resize-none"
              />
              <p className="text-sm text-[#666666] mt-2">
                {jobDescription.length} characters
              </p>
            </div>

            {/* Resume Input */}
            <div>
              <label className="block text-lg font-semibold text-[#1a1a1a] mb-2">
                Your Resume <span className="text-sm text-[#666666] font-normal">(Required)</span>
              </label>
              <p className="text-sm text-[#666666] mb-3">
                📄 Upload your resume file
              </p>

              {/* Upload Section with Drag and Drop */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mb-3 transition-all ${isDragging ? 'scale-105' : ''}`}
              >
                <label className="cursor-pointer block">
                  <div className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-colors ${
                    isDragging 
                      ? 'border-[#2ecc71] bg-[#f0fdf4] scale-105' 
                      : 'border-[#e0e0e0] hover:border-[#2ecc71] hover:bg-[#f0fdf4]'
                  }`}>
                    <Upload className="w-5 h-5 text-[#2ecc71]" />
                    <div>
                      <div className="text-sm font-medium text-[#1a1a1a]">
                        {isDragging ? 'Drop file here' : 'Click to upload or drag & drop'}
                      </div>
                      <div className="text-xs text-[#666666]">PDF, DOCX, TXT, or LaTeX</div>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".txt,.pdf,.tex,.docx,.doc"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded File Display */}
              {uploadedResume && (
                <div className="mb-3 p-4 bg-[#f0fdf4] border border-[#2ecc71] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#2ecc71]" />
                      <div>
                        <div className="text-sm font-medium text-[#1a1a1a]">{uploadedResume.fileName}</div>
                        <div className="text-xs text-[#666666]">
                          {(uploadedResume.fileSize / 1024).toFixed(1)} KB • {uploadedResume.text.length} characters
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadedResume(null)}
                      className="p-1 rounded-full hover:bg-red-100 text-[#dc2626] transition-colors"
                      title="Remove file"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="relative mb-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e0e0e0]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#666666]">or paste text manually</span>
                </div>
              </div>

              <Textarea
                placeholder="Paste your resume text here (only if not uploading a file)..."
                value={resumeText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResumeText(e.target.value)}
                disabled={!!uploadedResume}
                className="w-full h-72 p-4 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <p className="text-sm text-[#666666] mt-2">
                {uploadedResume ? 'Using uploaded file' : `${resumeText.length} characters`}
              </p>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "result" && result && (
          <div id="pdf-report" className="space-y-8">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] rounded-xl p-8 border border-[#2ecc71]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-medium text-[#666666] mb-2">YOUR ATS SCORE</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold text-[#2ecc71]">{result.score}</span>
                    <span className="text-2xl text-[#666666]">/ 100</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-32 h-32 rounded-full bg-white border-4 border-[#2ecc71] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#2ecc71]">{result.score}%</div>
                      <div className="text-xs text-[#666666] mt-1">
                        {result.score >= 80
                          ? "Excellent"
                          : result.score >= 60
                          ? "Good"
                          : result.score >= 40
                          ? "Fair"
                          : "Needs Work"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-[#666666]">
                {result.score >= 80
                  ? "Your resume is well-optimized for ATS systems. Strong keyword alignment and proper formatting detected."
                  : result.score >= 60
                  ? "Your resume has good potential but needs some optimization. Consider the suggestions below."
                  : "Your resume needs significant improvements to pass ATS filters. Focus on keywords and formatting."}
              </div>
            </div>

            {/* AI Insights Card */}
            {aiAnalysis && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200 mt-8">
                <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Pre-trained AI Intelligence Insights
                </h3>

                {/* 🤖 AI AGENT HIRING DECISION */}
                {aiAnalysis.rlAgentDecision && !aiAnalysis.rlAgentDecision.error && (
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-6 text-white shadow-lg">
                    <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                      🤖 AI Agent Hiring Decision
                    </h4>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-white/80 text-sm mb-1">Decision</div>
                        <div className="text-2xl font-bold">
                          {aiAnalysis.rlAgentDecision.decision === 'HIRE' && 'HIRE'}
                          {aiAnalysis.rlAgentDecision.decision === 'REJECT' && '❌ REJECT'}
                          {aiAnalysis.rlAgentDecision.decision === 'CONSIDER' && '⚠️ CONSIDER'}
                        </div>
                      </div>
                      
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-white/80 text-sm mb-1">Confidence</div>
                        <div className="text-2xl font-bold">{aiAnalysis.rlAgentDecision.confidence}</div>
                        <div className="text-white/70 text-xs mt-1">Q-Value: {aiAnalysis.rlAgentDecision.qValue}</div>
                      </div>
                      
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-white/80 text-sm mb-1">Success Prediction</div>
                        <div className="text-2xl font-bold">{aiAnalysis.rlAgentDecision.predictedSuccess}</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-3">
                      <div className="text-white/80 text-sm font-semibold mb-2">💡 Agent Reasoning:</div>
                      <div className="text-white text-sm">{aiAnalysis.rlAgentDecision.reasoning}</div>
                    </div>
                    
                    <div className="text-white/70 text-xs">
                      Algorithm: {aiAnalysis.rlAgentDecision.algorithm} | Candidate ID: {aiAnalysis.rlAgentDecision.candidateId}
                    </div>
                  </div>
                )}

                {/* Validation Score (NEW - STRICT) */}
                {aiAnalysis.validationScore !== undefined && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 mb-6">
                    <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      Resume Structure Validation
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-purple-100">
                        <div className="text-sm text-purple-600 font-medium">Validation Score</div>
                        <div className="text-2xl font-bold text-purple-900">{aiAnalysis.validationScore}%</div>
                      </div>
                      {aiAnalysis.resumeComponentScores && Object.entries(aiAnalysis.resumeComponentScores).map(([component, score]) => (
                        <div key={component} className="bg-white rounded-lg p-3 border border-purple-100">
                          <div className="text-xs text-purple-600 font-medium capitalize">{component.replace(/([A-Z])/g, ' $1')}</div>
                          <div className={`text-lg font-bold ${(score as boolean) ? 'text-green-600' : 'text-orange-600'}`}>
                            {(score as boolean) ? '✓' : '✗'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="text-sm text-blue-600 font-medium mb-1">Detected Skills</div>
                    <div className="text-2xl font-bold text-blue-900">{aiAnalysis.skillCount || 0}</div>
                    <div className="text-xs text-blue-600 mt-1">unique technical skills</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="text-sm text-blue-600 font-medium mb-1">Quality Score</div>
                    <div className="text-2xl font-bold text-blue-900">{aiAnalysis.professionalScore || 50}%</div>
                    <div className="text-xs text-blue-600 mt-1">{aiAnalysis.resumeQuality || "moderate"}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="text-sm text-blue-600 font-medium mb-1">Semantic Alignment</div>
                    <div className="text-2xl font-bold text-blue-900">{aiAnalysis.semanticScore || 50}%</div>
                    <div className="text-xs text-blue-600 mt-1">{aiAnalysis.semanticAlignment || "moderate"}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="text-sm text-blue-600 font-medium mb-1">Professional Tone</div>
                    <div className="text-2xl font-bold text-blue-900">{aiAnalysis.toneConfidence || 50}%</div>
                    <div className="text-xs text-blue-600 mt-1">{aiAnalysis.isProfessional ? "Professional" : "Needs improvement"}</div>
                  </div>
                </div>

                {/* Models Information */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">🤖 AI Model Architecture</h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p><strong>Architecture:</strong> {aiAnalysis.modelInfo?.architecture}</p>
                    <p><strong>Training Data:</strong> {aiAnalysis.modelInfo?.trainingData}</p>
                    <p><strong>Generic AI:</strong> {aiAnalysis.modelInfo?.isGenericAI ? "Yes ✓ - Works with any resume" : "No"}</p>
                    <div className="mt-3 pt-3 border-t border-blue-100 text-xs text-blue-600">
                      <p>Semantic: {aiAnalysis.modelInfo?.semanticModel}</p>
                      <p>Quality: {aiAnalysis.modelInfo?.qualityModel}</p>
                      <p>NER: {aiAnalysis.modelInfo?.nerModel}</p>
                      <p>Tone: {aiAnalysis.modelInfo?.sentimentModel}</p>
                    </div>
                  </div>
                </div>

                {/* Detected Skills */}
                {aiAnalysis.detectedSkills && aiAnalysis.detectedSkills.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Detected Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.detectedSkills.slice(0, 12).map((skill: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                      {aiAnalysis.detectedSkills.length > 12 && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                          +{aiAnalysis.detectedSkills.length - 12} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Matched Skills */}
                {aiAnalysis.jobAnalysis?.matchedSkills && aiAnalysis.jobAnalysis.matchedSkills.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Job-Matched Skills ({aiAnalysis.jobAnalysis.skillMatchPercentage}%)</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.jobAnalysis.matchedSkills.slice(0, 8).map((skill: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {aiAnalysis.jobAnalysis?.missingSkills && aiAnalysis.jobAnalysis.missingSkills.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-orange-900 mb-3">Skills to Add</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.jobAnalysis.missingSkills.slice(0, 8).map((skill: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Keywords Analysis */}
            {result && result.keywordMatches.matched.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-lg border border-[#e0e0e0] p-6">
                  <h3 className="font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#2ecc71]" />
                    Matched Keywords ({result.keywordMatches.matched.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordMatches.matched.slice(0, 15).map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-[#f0fdf4] text-[#2ecc71] rounded-full text-sm font-medium border border-[#2ecc71]"
                      >
                        {keyword}
                      </span>
                    ))}
                    {result.keywordMatches.matched.length > 15 && (
                      <span className="px-3 py-1 bg-gray-100 text-[#666666] rounded-full text-sm font-medium">
                        +{result.keywordMatches.matched.length - 15} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-[#e0e0e0] p-6">
                  <h3 className="font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Missing Keywords ({result.keywordMatches.missing.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordMatches.missing.length > 0 ? (
                      result.keywordMatches.missing.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium border border-orange-200"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-[#666666]">All key terms are present in your resume</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-lg border border-[#e0e0e0] p-6">
                <h3 className="text-lg font-semibold text-[#2ecc71] mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Strengths
                </h3>
                <ul className="space-y-3">
                  {result.strengths.map((strength, idx) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <span className="text-[#2ecc71] mt-1">✓</span>
                      <span className="text-[#333333]">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-[#e0e0e0] p-6">
                <h3 className="text-lg font-semibold text-orange-600 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Weaknesses
                </h3>
                <ul className="space-y-3">
                  {result.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <span className="text-orange-600 mt-1">✕</span>
                      <span className="text-[#333333]">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="rounded-lg border border-[#e0e0e0] p-6">
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#2ecc71]" />
                Improvement Suggestions
              </h3>
              <div className="space-y-6">
                {result.improvements.map((section, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold text-[#2ecc71] mb-3">{section.category}</h4>
                    <ul className="space-y-2 ml-4">
                      {section.suggestions.map((suggestion, sIdx) => (
                        <li key={sIdx} className="text-sm text-[#333333] flex gap-3">
                          <span className="text-[#2ecc71] font-bold">→</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Formatting Checklist */}
            <div className="rounded-lg border border-[#e0e0e0] p-6 bg-gradient-to-br from-[#f0fdf4] to-white">
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-6">Resume Structure Checklist</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[#e5e7eb] hover:border-[#2ecc71] transition-colors">
                  {result.formatting.hasContactInfo ? (
                    <div className="w-6 h-6 rounded-full bg-[#2ecc71] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-500 text-xs">!</span>
                    </div>
                  )}
                  <span className={`text-sm font-medium ${result.formatting.hasContactInfo ? "text-[#2ecc71]" : "text-orange-600"}`}>
                    Contact information clearly visible (email, phone, name)
                  </span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[#e5e7eb] hover:border-[#2ecc71] transition-colors">
                  {result.formatting.hasClearSections ? (
                    <div className="w-6 h-6 rounded-full bg-[#2ecc71] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-500 text-xs">!</span>
                    </div>
                  )}
                  <span className={`text-sm font-medium ${result.formatting.hasClearSections ? "text-[#2ecc71]" : "text-orange-600"}`}>
                    Clear section headers (Experience, Education, Skills, etc.)
                  </span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[#e5e7eb] hover:border-[#2ecc71] transition-colors">
                  {result.formatting.isATSFriendly ? (
                    <div className="w-6 h-6 rounded-full bg-[#2ecc71] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-500 text-xs">!</span>
                    </div>
                  )}
                  <span className={`text-sm font-medium ${result.formatting.isATSFriendly ? "text-[#2ecc71]" : "text-orange-600"}`}>
                    ATS-friendly formatting (no special characters or symbols)
                  </span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[#e5e7eb] hover:border-[#2ecc71] transition-colors">
                  {result.formatting.hasQuantifiableMetrics ? (
                    <div className="w-6 h-6 rounded-full bg-[#2ecc71] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-500 text-xs">!</span>
                    </div>
                  )}
                  <span className={`text-sm font-medium ${result.formatting.hasQuantifiableMetrics ? "text-[#2ecc71]" : "text-orange-600"}`}>
                    Quantifiable metrics (percentages, numbers, achievements)
                  </span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[#e5e7eb] hover:border-[#2ecc71] transition-colors">
                  {result.formatting.hasActionVerbs ? (
                    <div className="w-6 h-6 rounded-full bg-[#2ecc71] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-500 text-xs">!</span>
                    </div>
                  )}
                  <span className={`text-sm font-medium ${result.formatting.hasActionVerbs ? "text-[#2ecc71]" : "text-orange-600"}`}>
                    Action verbs (achieved, developed, managed, led, etc.)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Smart Flow */}
        <div className="flex flex-wrap gap-4 mt-12 bg-white py-4 px-6 rounded-lg border border-[#e0e0e0] shadow-lg">
          {activeTab === "input" ? (
            <button
              onClick={handleAnalyze}
              disabled={loading || (!uploadedResume && !resumeText.trim())}
              className={`px-8 py-3 font-medium rounded-lg transition-all flex items-center gap-2 ${
                loading || (!uploadedResume && !resumeText.trim())
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#2ecc71] hover:bg-[#27ae60] text-white"
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Analyze Resume
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-8 py-3 font-medium rounded-lg bg-[#2ecc71] hover:bg-[#27ae60] text-white transition-all"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>

              {/* Save Result and View History removed per user request */}
              <button
                onClick={() => {
                  setJobDescription("")
                  setResumeText("")
                  setUploadedResume(null)
                  setResult(null)
                  setAiAnalysis(null)
                  setActiveTab("input")
                }}
                className="px-8 py-3 font-medium rounded-lg border border-[#2ecc71] text-[#2ecc71] hover:bg-[#f0fdf4] transition-all"
              >
                Analyze Another Resume
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
