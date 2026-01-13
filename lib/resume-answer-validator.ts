/**
 * RESUME-BASED ANSWER VALIDATOR
 * Validates interview answers against resume claims
 * Identifies consistency and depth of claimed experience
 */

import type { ResumeContent } from './resume-question-generator'

export interface ResumeValidation {
  answersMatch: boolean
  consistency: number // 0-100: how consistent answer is with resume claims
  depthAlignment: number // 0-100: does answer depth match experience level
  credibilityScore: number // 0-100: how credible are the claims
  flags: string[]
  insights: string[]
  verifiedClaims: string[]
  questionableClaims: string[]
}

/**
 * Validate answer against resume claims
 */
export function validateAnswerAgainstResume(
  answer: string,
  resumeContent: ResumeContent,
  questionType: string,
  resumeReference: string
): ResumeValidation {
  const lowerAnswer = answer.toLowerCase()
  const flags: string[] = []
  const insights: string[] = []
  const verifiedClaims: string[] = []
  const questionableClaims: string[] = []
  
  // Check if answer mentions resume elements
  const answersMatch = validateContentMatch(lowerAnswer, resumeContent, resumeReference)
  
  // Check consistency with resume
  const consistency = calculateConsistency(answer, resumeContent, resumeReference)
  
  // Check if depth matches experience level
  const depthAlignment = assessDepthAlignment(answer, resumeContent)
  
  // Detect red flags
  if (lowerAnswer.includes("i don't remember") || lowerAnswer.includes("i forgot")) {
    flags.push('Forgot details about claimed experience')
    questionableClaims.push(resumeReference)
  }
  
  if (lowerAnswer.includes("i think") || lowerAnswer.includes("probably")) {
    flags.push('Uncertain about details - should be confident about resume experience')
    questionableClaims.push(resumeReference)
  }
  
  if (!answersMatch) {
    flags.push('Answer doesn\'t mention specific technologies/projects from resume')
    questionableClaims.push(resumeReference)
  } else {
    verifiedClaims.push(`Confirmed knowledge of ${resumeReference}`)
    insights.push(`Demonstrated real experience with ${resumeReference}`)
  }
  
  // Check for contradictions
  const contradictions = detectContradictions(answer, resumeContent)
  flags.push(...contradictions)
  
  // Calculate credibility based on consistency, depth, and lack of flags
  let credibilityScore = 70
  credibilityScore -= flags.length * 15
  credibilityScore += consistency * 0.2
  credibilityScore = Math.max(0, Math.min(100, credibilityScore))
  
  if (consistency > 80 && flags.length === 0) {
    insights.push('Resume claims well-supported by interview answers')
  } else if (consistency < 50) {
    insights.push('Resume claims not well-supported in interview')
  }
  
  return {
    answersMatch,
    consistency: Math.round(consistency),
    depthAlignment: Math.round(depthAlignment),
    credibilityScore: Math.round(credibilityScore),
    flags,
    insights,
    verifiedClaims,
    questionableClaims,
  }
}

/**
 * Check if answer content matches resume claims
 */
function validateContentMatch(
  answer: string,
  resumeContent: ResumeContent,
  resumeReference: string
): boolean {
  // Extract keywords from resume reference
  const keywords = extractKeywords(resumeReference)
  
  // Check if answer mentions at least some of the technologies/skills
  const matchedKeywords = keywords.filter(kw => answer.includes(kw.toLowerCase()))
  
  return matchedKeywords.length >= Math.max(1, Math.floor(keywords.length / 2))
}

/**
 * Calculate consistency between answer and resume
 */
function calculateConsistency(
  answer: string,
  resumeContent: ResumeContent,
  resumeReference: string
): number {
  const lowerAnswer = answer.toLowerCase()
  let score = 50 // base score
  
  // Check for technical details (shows real knowledge)
  if (lowerAnswer.includes('implemented') || lowerAnswer.includes('built') || lowerAnswer.includes('developed')) {
    score += 15
  }
  
  // Check for specific metrics/results
  const metricMatch = answer.match(/(\d+%|\d+x|[0-9]+ users?|[0-9]+ rps)/i)
  if (metricMatch) {
    score += 15
  }
  
  // Check for technical depth in answer
  const technicalTermCount = (answer.match(/\b(api|database|cache|load|scale|optimize|async|thread|memory|latency)\b/gi) || []).length
  if (technicalTermCount >= 3) {
    score += 10
  }
  
  // Check for specific project/technology mentions from resume
  const resumeKeywords = extractKeywords(resumeReference)
  const mentionedFromResume = resumeKeywords.filter(kw => lowerAnswer.includes(kw.toLowerCase())).length
  score += Math.min(20, mentionedFromResume * 5)
  
  // Penalize if answer seems generic (not specific to resume claims)
  if (answer.length < 50) {
    score -= 20
  }
  
  return Math.min(100, Math.max(0, score))
}

/**
 * Assess if answer depth matches claimed experience level
 */
function assessDepthAlignment(answer: string, resumeContent: ResumeContent): number {
  const lowerAnswer = answer.toLowerCase()
  let score = 50
  
  // Count technical depth indicators
  const depthIndicators = [
    'architecture', 'design', 'optimization', 'tradeoff', 'scalability',
    'performance', 'reliability', 'latency', 'throughput', 'concurrency'
  ]
  
  const depthCount = depthIndicators.filter(indicator => 
    lowerAnswer.includes(indicator)
  ).length
  
  // If senior level claimed, expect more depth
  const isSeniorLevel = resumeContent.experience.some(exp => 
    exp.toLowerCase().includes('senior') || 
    exp.toLowerCase().includes('lead') ||
    exp.toLowerCase().includes('principal')
  )
  
  if (isSeniorLevel) {
    if (depthCount >= 4) {
      score = 85
    } else if (depthCount >= 2) {
      score = 65
    } else {
      score = 40 // Senior should show more depth
    }
  } else {
    if (depthCount >= 2) {
      score = 75
    } else if (depthCount >= 1) {
      score = 60
    }
  }
  
  return Math.min(100, Math.max(0, score))
}

/**
 * Detect contradictions between answer and resume
 */
function detectContradictions(answer: string, resumeContent: ResumeContent): string[] {
  const contradictions: string[] = []
  const lowerAnswer = answer.toLowerCase()
  
  // Check for conflicting claims
  if (resumeContent.technologies && resumeContent.technologies.length > 0) {
    const hasExperienceWithTech = resumeContent.technologies.some(tech => 
      lowerAnswer.includes(tech.toLowerCase())
    )
    
    // If mentioned specific technologies in resume, answer should acknowledge some
    if (resumeContent.technologies.length >= 3 && !hasExperienceWithTech) {
      // Allow if answer mentions working with OTHER technologies
      const techPattern = /\b(react|vue|angular|python|java|go|rust|javascript|typescript|node|express|django|fastapi|postgres|mongo|redis|docker|kubernetes|aws|gcp|azure)\b/gi
      const mentionedTechs = (answer.match(techPattern) || []).length
      
      if (mentionedTechs === 0) {
        contradictions.push('Answer doesn\'t mention technologies claimed in resume')
      }
    }
  }
  
  return contradictions
}

/**
 * Extract keywords from text for matching
 */
function extractKeywords(text: string): string[] {
  // Extract technical terms, project names, and capabilities
  const techTerms = text.match(/\b(react|vue|angular|python|java|go|rust|javascript|typescript|node|express|django|fastapi|postgres|mongo|redis|docker|kubernetes|aws|gcp|azure|api|database|cache|microservices|rest|graphql)\b/gi) || []
  
  // Extract action words
  const actionWords = text.match(/\b(built|developed|architected|designed|optimized|scaled|managed|led|implemented|created)\b/gi) || []
  
  // Extract specific nouns (potential project names)
  const nouns = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g) || []
  
  return [...new Set([...techTerms, ...actionWords, ...nouns].map(k => k.toLowerCase()))]
}

/**
 * Generate resume-specific feedback
 */
export function generateResumeFeedback(validation: ResumeValidation): string[] {
  const feedback: string[] = []
  
  if (validation.credibilityScore >= 80) {
    feedback.push('✅ Resume claims well-supported and verified')
  } else if (validation.credibilityScore >= 60) {
    feedback.push('⚠️ Some resume claims unclear - provide more specific details')
  } else {
    feedback.push('🔴 Resume claims need better support with concrete examples')
  }
  
  if (validation.consistency >= 75) {
    feedback.push('Demonstrates deep understanding of claimed technologies')
  } else if (validation.consistency < 50) {
    feedback.push('Surface-level knowledge of technologies - lacks implementation details')
  }
  
  if (validation.depthAlignment >= 75) {
    feedback.push('Answer depth matches claimed experience level')
  } else if (validation.depthAlignment < 50) {
    feedback.push('Answer lacks depth expected from resume experience')
  }
  
  validation.flags.forEach(flag => {
    feedback.push(`⚠️ ${flag}`)
  })
  
  validation.insights.forEach(insight => {
    feedback.push(`💡 ${insight}`)
  })
  
  return feedback
}
