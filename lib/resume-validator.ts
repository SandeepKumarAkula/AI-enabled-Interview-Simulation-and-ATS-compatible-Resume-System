// Strict resume validation - checks for required resume components

export interface ResumeValidation {
  isValidResume: boolean
  confidence: number
  issues: string[]
  scores: {
    hasContactInfo: boolean
    hasEducation: boolean
    hasExperience: boolean
    hasSkills: boolean
    hasStructure: boolean
    professionalLanguage: boolean
  }
}

export function validateResumeStructure(text: string): ResumeValidation {
  const normalizedText = text.toLowerCase()
  const lines = text.split('\n').filter(l => l.trim())
  
  // Check for contact information patterns
  const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
  const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|(\+?\d{1,3}[-.\s]?)?\d{10,}/
  const linkedinPattern = /linkedin|linkedin\.com/i
  
  const hasContactInfo = 
    emailPattern.test(text) || 
    phonePattern.test(text) || 
    linkedinPattern.test(text) ||
    /contact|phone|email/i.test(normalizedText)

  // Check for education section (degrees, institutions)
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'institute', 'school', 'b.s', 'b.a', 'm.s', 'm.a', 'gpa']
  const hasEducation = educationKeywords.some(keyword => normalizedText.includes(keyword))

  // Check for work experience (job titles, companies, dates)
  const experienceKeywords = ['experience', 'employment', 'worked', 'position', 'role', 'manager', 'engineer', 'developer', 'analyst', 'coordinator', 'associate', 'executive', 'senior', 'junior']
  const hasExperience = experienceKeywords.some(keyword => normalizedText.includes(keyword)) || normalizedText.includes('responsibilities')

  // Check for skills section
  const skillsKeywords = ['skills', 'technical', 'proficiency', 'competency', 'expertise', 'language', 'tools', 'programming']
  const hasSkills = skillsKeywords.some(keyword => normalizedText.includes(keyword))

  // Check for basic structure (multiple sections, proper length)
  const hasSections = lines.length > 5 // Resume should have multiple lines/sections (relaxed from 10)
  const hasStructure = text.length > 200 || hasSections // Has reasonable length OR multiple sections (relaxed)

  // Check for professional language (no casual words)
  const casualWords = ['lol', 'btw', 'dude', 'cool']
  const professionalLanguage = !casualWords.some(word => normalizedText.includes(word))

  // Calculate validation
  const scores = {
    hasContactInfo,
    hasEducation,
    hasExperience,
    hasSkills,
    hasStructure,
    professionalLanguage
  }

  const validComponents = Object.values(scores).filter(Boolean).length
  const confidence = validComponents / Object.keys(scores).length

  // LENIENT criteria: Accept resumes with basic structure
  // Only reject completely invalid content (spam, gibberish, etc.)
  const isValidResume = 
    text.length > 50 && // Has some content (very lenient)
    professionalLanguage && // Not obviously spam/casual
    validComponents >= 2 // Has at least 2 components

  const issues: string[] = []
  
  // Provide helpful feedback without blocking analysis
  if (!hasEducation && !hasExperience) issues.push("Consider adding education or work experience section")
  if (!hasContactInfo) issues.push("Consider adding contact information (email, phone, LinkedIn)")
  if (!hasStructure && text.length < 200) issues.push("Resume could be more detailed")
  if (!professionalLanguage) issues.push("Remove casual language")
  if (!hasSkills) issues.push("Consider adding a skills section")

  return {
    isValidResume,
    confidence,
    issues,
    scores
  }
}

export function getResumeValidationScore(validation: ResumeValidation): number {
  // Return a score from 0-100 for resume validity
  // LENIENT: Give credit for any content that passes basic checks
  if (!validation.isValidResume) {
    // Invalid resumes still get 20-50 range based on components found
    return Math.max(20, Math.min(50, validation.confidence * 60))
  }
  
  // Valid resume: score based on how many components it has
  // 6 components possible, so each is worth ~13.33 points
  // Range 50-100 for valid resumes
  const componentScore = validation.confidence * 50 + 50
  return Math.round(Math.min(100, componentScore))
}
