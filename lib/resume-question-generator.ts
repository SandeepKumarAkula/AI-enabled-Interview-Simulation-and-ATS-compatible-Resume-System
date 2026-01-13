/**
 * RESUME-BASED QUESTION GENERATOR
 * Generates interview questions based on resume content
 * Tests actual experience claimed in resume
 */

export interface ResumeContent {
  skills: string[]
  projects: string[]
  experience: string[]
  technologies: string[]
  achievements: string[]
  languages: string[]
}

export interface ResumeQuestion {
  id: string
  prompt: string
  type: 'resume-project' | 'resume-skill' | 'resume-technology' | 'resume-achievement'
  resumeReference: string
  expectedKeywords: string[]
  difficulty: 'core' | 'deep'
  followUp?: string
}

/**
 * Generate targeted questions from resume content
 */
export function generateResumeQuestions(
  resumeContent: ResumeContent,
  interviewType: string,
  maxQuestions: number = 3
): ResumeQuestion[] {
  const questions: ResumeQuestion[] = []

  // Generate project-based questions
  if (resumeContent.projects && resumeContent.projects.length > 0) {
    resumeContent.projects.slice(0, 2).forEach((project, idx) => {
      const projectName = extractProjectName(project)
      questions.push({
        id: `resume-project-${idx}`,
        prompt: generateProjectQuestion(projectName, project),
        type: 'resume-project',
        resumeReference: project,
        expectedKeywords: extractTechnologiesFromProject(project),
        difficulty: 'deep',
        followUp: `What challenges did you face while building ${projectName}?`,
      })
    })
  }

  // Generate technology/skill-based questions
  if (resumeContent.technologies && resumeContent.technologies.length > 0) {
    const techStack = resumeContent.technologies.slice(0, 2)
    techStack.forEach((tech, idx) => {
      questions.push({
        id: `resume-tech-${idx}`,
        prompt: generateTechnologyQuestion(tech),
        type: 'resume-technology',
        resumeReference: tech,
        expectedKeywords: [tech.toLowerCase(), 'experience', 'production', 'scale'],
        difficulty: 'core',
      })
    })
  }

  // Generate achievement-based questions
  if (resumeContent.achievements && resumeContent.achievements.length > 0) {
    resumeContent.achievements.slice(0, 1).forEach((achievement, idx) => {
      const metric = extractMetric(achievement)
      questions.push({
        id: `resume-achievement-${idx}`,
        prompt: generateAchievementQuestion(achievement),
        type: 'resume-achievement',
        resumeReference: achievement,
        expectedKeywords: [metric, 'improved', 'reduced', 'increased'],
        difficulty: 'deep',
      })
    })
  }

  return questions.slice(0, maxQuestions)
}

/**
 * Extract project name from resume text
 */
function extractProjectName(projectText: string): string {
  // Try to extract project name from first line or quoted text
  const match = projectText.match(/^[^:]*(?::|\(|\[)?\s*([^:\(]+)/i)
  return match ? match[1].trim().slice(0, 30) : 'Your project'
}

/**
 * Extract technologies mentioned in project description
 */
function extractTechnologiesFromProject(projectText: string): string[] {
  const techKeywords = [
    'react', 'vue', 'angular', 'javascript', 'typescript', 'python', 'java', 'go',
    'node', 'express', 'django', 'fastapi', 'postgres', 'mongodb', 'redis',
    'aws', 'docker', 'kubernetes', 'graphql', 'rest', 'api', 'microservices',
  ]
  
  const found: string[] = []
  techKeywords.forEach(tech => {
    if (projectText.toLowerCase().includes(tech)) {
      found.push(tech)
    }
  })
  
  return found.length > 0 ? found : ['project', 'development']
}

/**
 * Extract metric from achievement text (percentage, number, etc)
 */
function extractMetric(achievementText: string): string {
  const metricMatch = achievementText.match(/(\d+%|\d+x|reduced|improved|increased)/i)
  return metricMatch ? metricMatch[1] : 'improvement'
}

/**
 * Generate contextual project question
 */
function generateProjectQuestion(projectName: string, fullText: string): string {
  const questions = [
    `You mentioned working on ${projectName} in your resume. Can you walk me through the architecture and key technical decisions you made?`,
    `What was the most complex problem you solved while building ${projectName}? How did you approach it?`,
    `Tell me about ${projectName} - what was your specific role and what technologies did you use?`,
    `How did you ensure ${projectName} was scalable and maintainable? What trade-offs did you make?`,
  ]
  
  return questions[Math.floor(Math.random() * questions.length)]
}

/**
 * Generate technology question based on resume claim
 */
function generateTechnologyQuestion(technology: string): string {
  const questions = [
    `I see you have experience with ${technology}. Describe a real production system where you used it and the key challenges.`,
    `Tell me about your experience with ${technology} - what's a complex problem you solved using it?`,
    `How would you explain ${technology} to someone who's never used it? What are its strengths and limitations?`,
    `What projects have you built with ${technology}? What made you choose it over alternatives?`,
  ]
  
  return questions[Math.floor(Math.random() * questions.length)]
}

/**
 * Generate achievement validation question
 */
function generateAchievementQuestion(achievement: string): string {
  const metric = extractMetric(achievement)
  const questions = [
    `Your resume mentions achieving ${metric}. Can you detail the specific steps you took to accomplish this?`,
    `I see you ${metric}. How did you measure success and what was your approach?`,
    `Tell me about the work behind your achievement in "${achievement.slice(0, 40)}..." - what was the before and after?`,
  ]
  
  return questions[Math.floor(Math.random() * questions.length)]
}

/**
 * Extract expected answer elements from resume content
 */
export function extractExpectedElements(resumeContent: ResumeContent): {
  technologiesUsed: string[]
  projectsBuilt: string[]
  skillsDemonstrated: string[]
  metricsAchieved: string[]
  rolesHeld: string[]
} {
  return {
    technologiesUsed: resumeContent.technologies || [],
    projectsBuilt: resumeContent.projects.map(p => extractProjectName(p)) || [],
    skillsDemonstrated: resumeContent.skills || [],
    metricsAchieved: resumeContent.achievements
      .map(a => extractMetric(a))
      .filter((m, idx, arr) => arr.indexOf(m) === idx) || [],
    rolesHeld: resumeContent.experience || [],
  }
}
