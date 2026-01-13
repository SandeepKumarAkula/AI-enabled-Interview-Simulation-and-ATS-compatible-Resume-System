/**
 * CLEAN REPORT FORMATTER
 * Structures interview report in clean, organized way
 * Strengths, Weaknesses, Suggestions all organized neatly
 */

import type { CumulativeEvaluation } from './interview-evaluator'

export interface CleanReport {
  // Header
  candidate: {
    role: string
    experienceLevel: string
    interviewDate: string
    totalDuration: number // minutes
  }
  
  // Overall Assessment
  overallAssessment: {
    score: number // 0-100
    readiness: 'hire' | 'maybe' | 'develop' | 'not_ready'
    label: string
  }
  
  // Dimensional Scores - Clean organized
  dimensionalAnalysis: {
    technical: { score: number; label: string; status: string }
    problemSolving: { score: number; label: string; status: string }
    communication: { score: number; label: string; status: string }
    practical: { score: number; label: string; status: string }
    behavioral: { score: number; label: string; status: string }
  }
  
  // Non-Verbal Assessment
  nonVerbalAnalysis: {
    eyeContact: { score: number; label: string }
    posture: { score: number; label: string }
    composure: { score: number; label: string }
    engagement: { score: number; label: string }
    overallPresence: { score: number; label: string }
  }
  
  // Clean Strengths Section
  strengths: {
    technical: string[]
    behavioral: string[]
    communication: string[]
    overall: string[]
  }
  
  // Clean Weaknesses Section
  weaknesses: {
    technical: string[]
    behavioral: string[]
    communication: string[]
    overall: string[]
  }
  
  // Organized Suggestions
  suggestions: {
    immediate: string[] // High priority (score < 50)
    shortTerm: string[] // Medium priority (50-70)
    longTerm: string[] // Development areas (70+)
  }
  
  // Resume Integration (if provided)
  resumeSection?: {
    summary: string
    verified: string[]
    questionable: string[]
    credibilityScore: number
  }
  
  // Interview Transcript
  transcript: Array<{
    questionNumber: number
    question: string
    questionType: string
    answer: string
    scores: {
      technical: number
      communication: number
      overall: number
    }
  }>
}

/**
 * Format raw report data into clean organized structure
 */
export function formatCleanReport(
  rawData: any,
  cumulative: CumulativeEvaluation,
  totalTimeMinutes: number
): CleanReport {
  
  const getLabel = (score: number): string => {
    if (score >= 85) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 55) return 'Fair'
    if (score >= 40) return 'Needs Work'
    return 'Poor'
  }
  
  const getStatus = (score: number): string => {
    if (score >= 80) return '🟢 Strength'
    if (score >= 65) return '🟡 Adequate'
    if (score >= 50) return '🟠 Needs Improvement'
    return '🔴 Critical'
  }
  
  // Extract strengths and weaknesses by category
  const allStrengths = rawData.strengths || []
  const allWeaknesses = rawData.improvements || []
  
  const categorizeStrengths = (strengths: string[]) => {
    const result = {
      technical: [] as string[],
      behavioral: [] as string[],
      communication: [] as string[],
      overall: [] as string[]
    }
    
    strengths.forEach(s => {
      const lower = s.toLowerCase()
      if (lower.includes('technical') || lower.includes('knowledge') || lower.includes('depth')) {
        result.technical.push(s)
      } else if (lower.includes('communication') || lower.includes('articulate') || lower.includes('clarity')) {
        result.communication.push(s)
      } else if (lower.includes('confidence') || lower.includes('demeanor') || lower.includes('presence')) {
        result.behavioral.push(s)
      } else {
        result.overall.push(s)
      }
    })
    
    return result
  }
  
  const categorizeWeaknesses = (weaknesses: string[]) => {
    const result = {
      technical: [] as string[],
      behavioral: [] as string[],
      communication: [] as string[],
      overall: [] as string[]
    }
    
    weaknesses.forEach(w => {
      const lower = w.toLowerCase()
      if (lower.includes('technical') || lower.includes('concepts') || lower.includes('foundation')) {
        result.technical.push(w)
      } else if (lower.includes('communication') || lower.includes('structure') || lower.includes('articulation')) {
        result.communication.push(w)
      } else if (lower.includes('confidence') || lower.includes('composed') || lower.includes('professional')) {
        result.behavioral.push(w)
      } else {
        result.overall.push(w)
      }
    })
    
    return result
  }
  
  const categorizeSuggestions = (suggestions: string[]) => {
    const result = { immediate: [] as string[], shortTerm: [] as string[], longTerm: [] as string[] }
    
    suggestions.forEach(s => {
      const lower = s.toLowerCase()
      // Immediate: failing areas, critical gaps
      if (lower.includes('strengthen') || lower.includes('critical') || lower.includes('improve fundamentals')) {
        result.immediate.push(s)
      }
      // Short term: moderate improvements needed
      else if (lower.includes('practice') || lower.includes('work on') || lower.includes('use')) {
        result.shortTerm.push(s)
      }
      // Long term: development and mastery
      else {
        result.longTerm.push(s)
      }
    })
    
    return result
  }
  
  const overallScore = rawData.interviewReadinessScore || 70
  
  return {
    candidate: {
      role: rawData.role || 'Candidate',
      experienceLevel: rawData.experienceLevel || 'Not specified',
      interviewDate: new Date().toISOString().split('T')[0],
      totalDuration: totalTimeMinutes
    },
    
    overallAssessment: {
      score: overallScore,
      readiness: (rawData.roleReadiness || cumulative.roleReadiness) as any,
      label: getLabel(overallScore)
    },
    
    dimensionalAnalysis: {
      technical: {
        score: cumulative.dimensions.technical,
        label: getLabel(cumulative.dimensions.technical),
        status: getStatus(cumulative.dimensions.technical)
      },
      problemSolving: {
        score: cumulative.dimensions.problemSolving,
        label: getLabel(cumulative.dimensions.problemSolving),
        status: getStatus(cumulative.dimensions.problemSolving)
      },
      communication: {
        score: cumulative.dimensions.communication,
        label: getLabel(cumulative.dimensions.communication),
        status: getStatus(cumulative.dimensions.communication)
      },
      practical: {
        score: cumulative.dimensions.practical,
        label: getLabel(cumulative.dimensions.practical),
        status: getStatus(cumulative.dimensions.practical)
      },
      behavioral: {
        score: cumulative.dimensions.behavioral,
        label: getLabel(cumulative.dimensions.behavioral),
        status: getStatus(cumulative.dimensions.behavioral)
      }
    },
    
    nonVerbalAnalysis: {
      eyeContact: {
        score: rawData.nonVerbalAssessment?.eyeContact || 50,
        label: getLabel(rawData.nonVerbalAssessment?.eyeContact || 50)
      },
      posture: {
        score: rawData.nonVerbalAssessment?.posture || 50,
        label: getLabel(rawData.nonVerbalAssessment?.posture || 50)
      },
      composure: {
        score: rawData.nonVerbalAssessment?.composure || 50,
        label: getLabel(rawData.nonVerbalAssessment?.composure || 50)
      },
      engagement: {
        score: rawData.nonVerbalAssessment?.engagementLevel || 50,
        label: getLabel(rawData.nonVerbalAssessment?.engagementLevel || 50)
      },
      overallPresence: {
        score: rawData.nonVerbalAssessment?.engagementLevel || 50,
        label: getLabel(rawData.nonVerbalAssessment?.engagementLevel || 50)
      }
    },
    
    strengths: categorizeStrengths(allStrengths),
    weaknesses: categorizeWeaknesses(allWeaknesses),
    suggestions: categorizeSuggestions(rawData.recommendations || []),
    
    ...(rawData.atsAnalysis && {
      resumeSection: {
        summary: rawData.atsAnalysis.alignment?.summary || 'Resume validation pending',
        verified: rawData.atsAnalysis.alignment?.claimsVerified || [],
        questionable: rawData.atsAnalysis.alignment?.claimsQuestionable || [],
        credibilityScore: rawData.atsAnalysis.alignment?.credibilityScore || 0
      }
    }),
    
    transcript: (rawData.transcript || []).map((item: any, idx: number) => ({
      questionNumber: idx + 1,
      question: item.question,
      questionType: item.type,
      answer: item.answer,
      scores: {
        technical: item.scores?.technicalDepth || 0,
        communication: item.scores?.clarity || 0,
        overall: Math.round(((item.scores?.technicalDepth || 0) + (item.scores?.clarity || 0)) / 2)
      }
    }))
  }
}

/**
 * Format clean report as markdown for display
 */
export function formatReportAsMarkdown(report: CleanReport): string {
  const lines: string[] = []
  
  lines.push(`# Interview Report`)
  lines.push(`**${report.candidate.role}** | ${report.candidate.experienceLevel}`)
  lines.push(`Date: ${report.candidate.interviewDate} | Duration: ${report.candidate.totalDuration} min`)
  lines.push('')
  
  // Overall
  lines.push(`## 📊 Overall Assessment`)
  lines.push(`**Score:** ${report.overallAssessment.score}/100 (${report.overallAssessment.label})`)
  lines.push(`**Readiness:** ${report.overallAssessment.readiness.toUpperCase()}`)
  lines.push('')
  
  // Dimensions
  lines.push(`## 📈 Dimensional Breakdown`)
  Object.entries(report.dimensionalAnalysis).forEach(([key, val]: any) => {
    lines.push(`- **${key.replace(/([A-Z])/g, ' $1')}**: ${val.score}/100 (${val.label}) ${val.status}`)
  })
  lines.push('')
  
  // Non-Verbal
  lines.push(`## 🎥 Non-Verbal Analysis`)
  Object.entries(report.nonVerbalAnalysis).forEach(([key, val]: any) => {
    lines.push(`- **${key.replace(/([A-Z])/g, ' $1')}**: ${val.score}/100 (${val.label})`)
  })
  lines.push('')
  
  // Strengths
  lines.push(`## ✅ Strengths`)
  const allStrengths = [...report.strengths.technical, ...report.strengths.behavioral, ...report.strengths.communication, ...report.strengths.overall]
  if (allStrengths.length > 0) {
    allStrengths.forEach(s => lines.push(`- ${s}`))
  } else {
    lines.push('- Continue to build on technical foundations')
  }
  lines.push('')
  
  // Weaknesses
  lines.push(`## ⚠️ Weaknesses`)
  const allWeaknesses = [...report.weaknesses.technical, ...report.weaknesses.behavioral, ...report.weaknesses.communication, ...report.weaknesses.overall]
  if (allWeaknesses.length > 0) {
    allWeaknesses.forEach(w => lines.push(`- ${w}`))
  } else {
    lines.push('- Minor areas for development')
  }
  lines.push('')
  
  // Suggestions
  lines.push(`## 💡 Suggestions`)
  if (report.suggestions.immediate.length > 0) {
    lines.push(`**Immediate (High Priority):**`)
    report.suggestions.immediate.forEach(s => lines.push(`- ${s}`))
    lines.push('')
  }
  if (report.suggestions.shortTerm.length > 0) {
    lines.push(`**Short Term (3-6 months):**`)
    report.suggestions.shortTerm.forEach(s => lines.push(`- ${s}`))
    lines.push('')
  }
  if (report.suggestions.longTerm.length > 0) {
    lines.push(`**Long Term (Development):**`)
    report.suggestions.longTerm.forEach(s => lines.push(`- ${s}`))
    lines.push('')
  }
  
  // Resume (if available)
  if (report.resumeSection) {
    lines.push(`## 📄 Resume Validation`)
    lines.push(`**Credibility:** ${report.resumeSection.credibilityScore}/100`)
    lines.push(`**Summary:** ${report.resumeSection.summary}`)
    if (report.resumeSection.verified.length > 0) {
      lines.push(`**Verified Claims:** ${report.resumeSection.verified.join(', ')}`)
    }
    if (report.resumeSection.questionable.length > 0) {
      lines.push(`**Needs Clarification:** ${report.resumeSection.questionable.join(', ')}`)
    }
    lines.push('')
  }
  
  return lines.join('\n')
}
