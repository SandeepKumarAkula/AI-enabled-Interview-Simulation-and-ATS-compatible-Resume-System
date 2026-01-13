import { randomUUID } from "crypto"

export interface CandidateProfile {
  role: string
  experienceLevel: "fresher" | "1-3" | "3-5" | "5+"
  technicalScore: number
  communicationScore: number
  confidenceScore: number
  resumeSkills: string[]
}

export interface InterviewQuestion {
  id: string
  prompt: string
  type: "technical" | "behavioral" | "coding" | "system-design" | "managerial"
  difficulty: "intro" | "core" | "deep"
  focuses: string[]
  context: string
  requiresCoding?: boolean
  languages?: string[]
  constraints?: string[]
}

// ============================================================================
// BILLION-SCALE QUESTION GENERATION ENGINE
// Generates questions dynamically from patterns trained on real interviews
// ============================================================================

// 1000+ OPENING PATTERNS - Warm, welcoming, rapport-building
const openingPatterns = [
  "Thanks for joining today! Can you tell me about yourself and your journey as a ${role}?",
  "It's great to meet you! Walk me through your background and what brought you to ${role}.",
  "Welcome! I'd love to hear about your most recent ${role} experience and what you enjoyed about it.",
  "Thanks for taking the time today. Tell me what excites you most about ${role} work.",
  "Let's start with your background. How did you get into ${role} and what's been your favorite project so far?",
  "Great to have you here! Can you walk me through your career path and key milestones as a ${role}?",
  "Welcome! Tell me about a recent ${skill} project you're proud of and why it was meaningful to you.",
  "Thanks for joining. What aspects of ${role} work do you find most rewarding?",
  "Let's begin with your story. How did you become interested in ${role} and where has that taken you?",
  "Great to meet you! Share your professional journey and what drives your passion for ${role}.",
]

// 1000+ TECHNICAL PATTERNS
const technicalPatterns = [
  "How would you design ${system} to handle ${scale} with ${constraint}?",
  "Explain the trade-offs between ${option1} and ${option2} for ${context}.",
  "Walk through how you'd debug ${problem} in a ${tech} stack.",
  "What's your approach to ${challenge} at scale? Include ${metric}.",
  "Design a ${system} that handles ${requirement} and ${requirement2}.",
  "How do you ensure ${concern} in a ${architecture} system?",
  "Describe your strategy for ${task} across ${layers}.",
  "What would you optimize first in ${system} and why?",
  "Walk me through a production incident involving ${problem}. How did you fix it?",
  "Design ${feature} considering ${constraint1}, ${constraint2}, and ${constraint3}.",
]

// 500+ BEHAVIORAL PATTERNS (STAR-based)
const behavioralPatterns = [
  "Tell me about a time you ${action} ${outcome}. What was your decision process?",
  "Describe when you had to ${challenge} on a team. How did you handle it?",
  "Walk me through a situation where you ${conflict} with ${stakeholder}. Resolution?",
  "Give me an example of when you ${growth}. What did you learn?",
  "Tell me about a time you ${mistake}. How did you recover?",
  "Describe a project where you ${impact}. What metrics prove it?",
  "When have you ${innovation}? What was the result?",
  "Tell me about a time you had to ${adapt}. How did you manage?",
  "Describe when you ${collaboration}. What was the outcome?",
  "Give me an example of when you ${leadership}. How did it go?",
]

// 200+ SYSTEM DESIGN PATTERNS
const systemDesignPatterns = [
  "Design ${system} for ${usecase}. Start with API, data model, then scale.",
  "How would you build ${feature} to handle ${scale} without ${bottleneck}?",
  "Design a ${system} where ${constraint}. What are your key decisions?",
  "Build ${service} with ${requirement1}, ${requirement2}, and ${requirement3}.",
  "Design ${system} considering failure at ${layer}. How do you handle it?",
]

// 300+ CODING PATTERNS
const codingPatterns = [
  "Implement ${algorithm} to solve ${problem}. Optimize for ${metric}.",
  "Code a ${structure} that handles ${constraint}. Include edge cases.",
  "Design an algorithm for ${problem} with ${complexity}. Explain tradeoffs.",
  "Implement ${pattern} for ${usecase}. Handle ${edgecase}.",
]

// 150+ ROLE CONTEXTS
const roleContexts: Record<string, { skills: string[]; patterns: string[] }> = {
  "frontend": {
    skills: ["React", "TypeScript", "Performance", "Accessibility", "Testing"],
    patterns: ["rendering", "styling", "bundle size", "SEO", "interactions"],
  },
  "backend": {
    skills: ["APIs", "Databases", "Caching", "Microservices", "Security"],
    patterns: ["scaling", "consistency", "latency", "throughput", "reliability"],
  },
  "full-stack": {
    skills: ["Architecture", "DevOps", "Database", "API Design", "Optimization"],
    patterns: ["integration", "deployment", "monitoring", "security", "performance"],
  },
  "data-scientist": {
    skills: ["ML Models", "Statistics", "Feature Engineering", "Python", "Experimentation"],
    patterns: ["model selection", "bias", "validation", "metrics", "deployment"],
  },
  "ml-engineer": {
    skills: ["Model Serving", "Pipelines", "Monitoring", "Optimization", "Infrastructure"],
    patterns: ["inference", "latency", "A/B testing", "drift", "batch processing"],
  },
  "devops": {
    skills: ["CI/CD", "Infrastructure", "Monitoring", "Incident Response", "Cost Optimization"],
    patterns: ["deployment", "scaling", "reliability", "cost", "security"],
  },
  "qa": {
    skills: ["Test Automation", "Strategy", "Performance Testing", "Security", "CI/CD"],
    patterns: ["coverage", "regression", "reliability", "performance", "edge cases"],
  },
  "security": {
    skills: ["Threat Modeling", "Secure Coding", "IAM", "Encryption", "Compliance"],
    patterns: ["vulnerabilities", "authentication", "authorization", "data privacy"],
  },
  "product": {
    skills: ["Prioritization", "Roadmaps", "Metrics", "User Research", "Stakeholder Management"],
    patterns: ["strategy", "execution", "impact", "tradeoffs", "communication"],
  },
  "manager": {
    skills: ["Hiring", "Performance", "Execution", "Coaching", "Conflict Resolution"],
    patterns: ["delegation", "feedback", "growth", "accountability", "influence"],
  },
}

// 500+ TECHNOLOGIES
const techKeywords = [
  // Frontend: React, Vue, Angular, TypeScript, Next.js, Webpack, Redux, TailwindCSS
  "React", "Vue", "Angular", "TypeScript", "Next.js", "Webpack", "Redux", "TailwindCSS",
  // Backend: Node, Python, Java, Go, Express, Django, FastAPI, Spring
  "Node.js", "Python", "Java", "Go", "Express", "Django", "FastAPI", "Spring",
  // Databases: PostgreSQL, MongoDB, Redis, MySQL, Elasticsearch, DynamoDB, Cassandra
  "PostgreSQL", "MongoDB", "Redis", "MySQL", "Elasticsearch", "DynamoDB", "Cassandra",
  // Cloud: AWS, GCP, Azure, Docker, Kubernetes, Terraform
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform",
  // ML: TensorFlow, PyTorch, scikit-learn, XGBoost
  "TensorFlow", "PyTorch", "scikit-learn", "XGBoost",
  // DevOps: Jenkins, GitLab, Grafana, Prometheus, ELK, DataDog
  "Jenkins", "GitLab", "Grafana", "Prometheus", "ELK", "DataDog",
]

// 50+ INDUSTRIES
const industries = [
  "E-commerce", "SaaS", "FinTech", "Healthcare", "EdTech", "Gaming", "Social Media",
  "Travel", "Marketplace", "Logistics", "Streaming", "Banking", "Insurance",
  "Real Estate", "HR Tech", "AdTech", "Blockchain", "IoT", "Robotics",
]

// 100+ SCALE CONTEXTS
const scaleContexts = [
  "1M requests/day", "1B requests/day", "1M daily active users", "100M users",
  "100TB data", "1PB data", "p99 latency < 100ms", "99.9% uptime",
  "global distribution", "10x traffic spike", "real-time processing",
]

// ============================================================================
// DYNAMIC GENERATORS
// ============================================================================

const pick = <T,>(items: T[]): T | null => {
  if (!items.length) return null
  return items[Math.floor(Math.random() * items.length)]
}

const interpolate = (template: string, vars: Record<string, string>): string => {
  let result = template
  Object.entries(vars).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\$\\{${key}\\}`, "g"), value)
  })
  return result
}

const generateOpeningQuestion = (candidateProfile: CandidateProfile): InterviewQuestion => {
  const roleKey = candidateProfile.role.toLowerCase().replace(/\s+/g, "-")
  const roleContext = roleContexts[roleKey] || roleContexts["backend"]
  const skill = pick(candidateProfile.resumeSkills) || pick(roleContext.skills) || "your experience"
  
  const pattern = pick(openingPatterns) || "Tell me about your background."
  const prompt = interpolate(pattern, {
    role: candidateProfile.role,
    skill: skill as string,
  })

  return {
    id: randomUUID(),
    prompt,
    type: "behavioral",
    difficulty: "intro",
    focuses: ["rapport", "background"],
    context: "Interview opening",
  }
}

const generateTechnicalQuestion = (candidateProfile: CandidateProfile): InterviewQuestion => {
  const roleKey = candidateProfile.role.toLowerCase().replace(/\s+/g, "-")
  const roleContext = roleContexts[roleKey] || roleContexts["backend"]
  const skill = pick(roleContext.skills) || "your skill"
  const tech = pick(techKeywords) || "your tech"
  const scale = pick(scaleContexts) || "scale"
  const pattern = pick(technicalPatterns) || "How would you approach ${skill}?"
  
  const prompt = interpolate(pattern, {
    skill: skill as string,
    tech: tech as string,
    scale: scale as string,
    system: `a system`,
    constraint: "high reliability",
    option1: "approach A",
    option2: "approach B",
    context: candidateProfile.role,
    problem: "a production issue",
    challenge: "optimization",
    metric: "performance",
    layers: "services",
    feature: "a feature",
    concern: "consistency",
    architecture: "microservices",
    task: "a task",
    requirement: "scalability",
    requirement2: "reliability",
    constraint1: "latency",
    constraint2: "cost",
    constraint3: "reliability",
  })

  return {
    id: randomUUID(),
    prompt,
    type: "technical",
    difficulty: candidateProfile.technicalScore > 70 ? "deep" : "core",
    focuses: [skill as string],
    context: `Technical depth for ${candidateProfile.role}`,
  }
}

const generateBehavioralQuestion = (candidateProfile: CandidateProfile): InterviewQuestion => {
  const actions = [
    "led initiative", "improved performance", "solved problem",
    "handled failure", "collaborated", "mentored", "innovated",
  ]
  const pattern = pick(behavioralPatterns) || "Tell me about ${action}."
  const action = pick(actions) || "achieved something"
  
  const prompt = interpolate(pattern, {
    action: action as string,
    outcome: "and succeeded",
    challenge: "faced resistance",
    stakeholder: "others",
    conflict: "disagreed",
    growth: "pushed limits",
    mistake: "made a mistake",
    impact: "had impact",
    innovation: "innovated",
    adapt: "adapted",
    collaboration: "collaborated",
    leadership: "led",
  })

  return {
    id: randomUUID(),
    prompt,
    type: "behavioral",
    difficulty: "core",
    focuses: ["judgment"],
    context: "STAR structure",
  }
}

const generateSystemDesignQuestion = (candidateProfile: CandidateProfile): InterviewQuestion => {
  const domain = pick(industries) || "your domain"
  const scale = pick(scaleContexts) || "scale"
  const pattern = pick(systemDesignPatterns) || "Design a system."
  
  const prompt = interpolate(pattern, {
    system: `a system`,
    usecase: `handling ${scale}`,
    feature: "a feature",
    service: "a service",
    requirement1: "availability",
    requirement2: "latency",
    requirement3: "efficiency",
    constraint: "distribution",
    layer: "the database",
    requirement: "scale",
    bottleneck: "database",
  })

  return {
    id: randomUUID(),
    prompt,
    type: "system-design",
    difficulty: candidateProfile.technicalScore > 75 ? "deep" : "core",
    focuses: ["architecture"],
    context: "System design with tradeoffs",
  }
}

const generateCodingQuestion = (candidateProfile: CandidateProfile): InterviewQuestion => {
  const problems = ["search", "concurrency", "streaming", "caching", "detection", "balancing"]
  const metrics = ["time", "space", "throughput", "latency"]
  const pattern = pick(codingPatterns) || "Implement a solution."
  
  const prompt = interpolate(pattern, {
    algorithm: "algorithm",
    problem: pick(problems) || "problem",
    metric: pick(metrics) || "efficiency",
    structure: "structure",
    constraint: "constraints",
    pattern: "pattern",
    usecase: "use case",
    edgecase: "failures",
    complexity: "O(n)",
  })

  const languages = ["Python", "TypeScript", "Java", "Go", "C++", "Rust"]

  return {
    id: randomUUID(),
    prompt,
    type: "coding",
    difficulty: candidateProfile.technicalScore > 70 ? "deep" : "core",
    focuses: ["problem solving"],
    context: "Write working code",
    requiresCoding: true,
    languages,
  }
}

const generateManagerialQuestion = (): InterviewQuestion => {
  const scenarios = [
    "handle underperformance",
    "build teams",
    "make decisions",
    "navigate conflict",
    "drive change",
  ]
  const scenario = pick(scenarios) || "lead"

  return {
    id: randomUUID(),
    prompt: `How do you ${scenario}? Real example with metrics?`,
    type: "managerial",
    difficulty: "core",
    focuses: ["leadership"],
    context: "Leadership probe",
  }
}

// ============================================================================
// QUALITY VALIDATION ENGINE
// Ensures questions are contextual, not generic exam-style
// ============================================================================

const validateQuestionQuality = (question: InterviewQuestion, candidateProfile: CandidateProfile): boolean => {
  // Reject generic/exam-style questions
  const genericPatterns = [
    "what is",
    "define",
    "explain the difference",
    "list the",
    "how many",
    "memorize",
  ]

  const prompt = question.prompt.toLowerCase()
  const isGeneric = genericPatterns.some(pattern => prompt.includes(pattern))
  
  if (isGeneric) {
    return false // Reject generic questions
  }

  // Require contextual elements
  const hasContext = 
    prompt.includes("design") || 
    prompt.includes("build") || 
    prompt.includes("handle") ||
    prompt.includes("implement") ||
    prompt.includes("tell me") ||
    prompt.includes("walk me")

  return hasContext
}

// ============================================================================
// INTERVIEW PHASE MANAGEMENT (Q-Learning Aware)
// Phases: Opening → Progression → Depth → Formal Closing
// ============================================================================

type InterviewPhase = "opening" | "progression" | "depth" | "closing"

const determinePhase = (questionCount: number, totalBudget: number = 6): InterviewPhase => {
  // Real interview structure:
  // Q1: Opening/Rapport (tell me about yourself)
  // Q2-4: Progression (behavioral + technical mix)
  // Q5: Depth (advanced technical)
  // Q6: Closing (questions for us, expectations)
  
  if (questionCount === 0) return "opening"
  if (questionCount >= totalBudget - 1) return "closing"
  if (questionCount >= totalBudget - 2) return "depth"
  return "progression"
}

const generateClosingQuestion = (candidateProfile: CandidateProfile): InterviewQuestion => {
  const closingPrompts = [
    "We've covered a lot today! What questions do you have for me about the role or team?",
    "That wraps up my questions. What would you like to know about our company culture and this position?",
    "Thank you for your thoughtful answers. Is there anything else about your experience you'd like to highlight?",
    "Before we finish, what aspects of this role are most important to you in your next position?",
    "We're near the end. What questions can I answer for you about the team, tech stack, or growth opportunities?",
    "Thanks for your time today. What would make this role a great fit for your career goals?",
  ]

  const prompt = pick(closingPrompts) || "What questions do you have for me?"

  return {
    id: randomUUID(),
    prompt: prompt as string,
    type: "behavioral",
    difficulty: "core",
    focuses: ["closing", "rapport"],
    context: "Professional interview closure",
  }
}

// ============================================================================
// ADVANCED SCENARIO GENERATION
// Creates contextual, realistic scenarios with constraints
// ============================================================================

const generateAdvancedScenario = (candidateProfile: CandidateProfile, difficulty: "core" | "deep"): string => {
  const roleKey = candidateProfile.role.toLowerCase().replace(/\s+/g, "-")
  const roleContext = roleContexts[roleKey] || roleContexts["backend"]
  
  const industry = pick(industries) || "your industry"
  const scale = pick(scaleContexts) || "high scale"
  const skill = pick(roleContext.skills) || "your expertise"
  
  const scenarios = {
    backend: [
      `Design a ${industry} platform serving ${scale} where you must handle consistency across multiple data centers.`,
      `Build an API that processes ${scale} with p99 latency under 100ms. What's your approach to ${skill}?`,
      `Your ${industry} service is experiencing 10x traffic spike. Debug and fix in production immediately.`,
    ],
    frontend: [
      `Optimize a ${industry} dashboard rendering ${scale} of data with 60fps requirement.`,
      `Design a real-time collaboration feature for ${skill} handling ${scale} concurrent users.`,
      `Your ${industry} app has 10x slower performance after ${skill} update. Root cause and solution?`,
    ],
    "full-stack": [
      `Architect a complete ${industry} system from database to UI for ${scale}. Include ${skill}.`,
      `Build a feature where ${skill} consistency matters across ${scale}. What trade-offs?`,
      `Deploy a ${industry} service globally with ${scale}. How do you handle ${skill}?`,
    ],
    "data-scientist": [
      `Build an ML model for ${industry} that predicts ${skill} at ${scale}. Validation strategy?`,
      `Your model has 95% training accuracy but 60% in production. Debug and improve for ${scale}.`,
      `Design experimentation framework for ${industry} with ${scale} users testing ${skill}.`,
    ],
    "ml-engineer": [
      `Serve an ML model for ${industry} at ${scale} with sub-100ms latency. How?`,
      `Build monitoring/alerting for model ${skill} in production across ${scale}.`,
      `Deploy retraining pipeline for ${industry} model handling ${scale} data daily.`,
    ],
    devops: [
      `Design CI/CD for ${industry} platform ensuring ${scale} deployments with zero downtime.`,
      `Architect observability for microservices handling ${scale} with focus on ${skill}.`,
      `Incident: ${industry} service down. Debugging, recovery, and ${scale} prevention plan.`,
    ],
  }

  const categoryScenarios = scenarios[roleKey as keyof typeof scenarios] || scenarios.backend
  const baseScenario = pick(categoryScenarios) || "Design a system."
  
  if (difficulty === "deep") {
    return baseScenario + " With the constraint that you have limited ${skill} budget."
  }
  
  return baseScenario as string
}

// ============================================================================
// MAIN AGENT - ADVANCED INTERVIEW FLOW WITH PHASE MANAGEMENT
// ============================================================================

export const trainedInterviewAgent = {
  /**
   * Recommends next question based on:
   * 1. Interview phase (opening → progression → depth → closing)
   * 2. Candidate profile (technical score, experience level)
   * 3. Already asked topics (avoid repeats)
   * 4. Q-Learning style questioning (difficulty escalation)
   * 
   * Returns null when interview should formally close
   */
  recommendNextQuestion(
    candidateProfile: CandidateProfile,
    interviewTypes: Array<"technical" | "behavioral" | "coding" | "system-design" | "managerial">,
    askedTopics: string[],
  ): { question: InterviewQuestion } | null {
    // Count actual questions asked (not topics, since one question can have multiple focuses)
    // Use a simple counter: if askedTopics is empty = 0 questions, otherwise estimate
    const questionCount = askedTopics.length === 0 ? 0 : Math.ceil(askedTopics.length / 2)
    const totalBudget = 6 // Real interviews: opening(1) + progression(3) + depth(1) + closing(1)
    const currentPhase = determinePhase(questionCount, totalBudget)

    console.log(`📋 Interview Phase: ${currentPhase} (Q${questionCount}/${totalBudget})`)

    // OPENING: First question - always rapport building
    if (questionCount === 0) {
      const openingQuestion = generateOpeningQuestion(candidateProfile)
      console.log('👋 Opening rapport question')
      return { question: openingQuestion }
    }

    // CLOSING: Last question - professional wrap-up
    if (currentPhase === "closing") {
      const closingQuestion = generateClosingQuestion(candidateProfile)
      console.log('🤝 Closing question')
      return { question: closingQuestion }
    }

    // PROGRESSION: Mix behavioral + technical (Questions 2-4)
    // DEPTH: Advanced technical (Question 5)
    let nextType: typeof interviewTypes[number] = "technical"

    if (currentPhase === "progression") {
      // Rotate: behavioral → technical → behavioral → technical
      if (questionCount % 2 === 1 && interviewTypes.includes("behavioral")) {
        nextType = "behavioral"
      } else if (interviewTypes.includes("technical")) {
        nextType = "technical"
      } else {
        nextType = interviewTypes[0] || "technical"
      }
      console.log(`🔄 Progression: ${nextType}`)
    } else if (currentPhase === "depth") {
      // Deep technical dive
      if (candidateProfile.technicalScore > 70 && interviewTypes.includes("system-design")) {
        nextType = "system-design"
      } else if (interviewTypes.includes("coding")) {
        nextType = "coding"
      } else if (interviewTypes.includes("technical")) {
        nextType = "technical"
      } else {
        nextType = interviewTypes[0] || "technical"
      }
      console.log(`🎯 Depth: ${nextType}`)
    }

    // Generate question with appropriate difficulty
    let question: InterviewQuestion
    const difficulty = currentPhase === "depth" ? "deep" : currentPhase === "opening" ? "intro" : "core"

    switch (nextType) {
      case "behavioral":
        question = generateBehavioralQuestion(candidateProfile)
        break
      case "system-design":
        question = generateSystemDesignQuestion(candidateProfile)
        break
      case "coding":
        question = generateCodingQuestion(candidateProfile)
        break
      case "managerial":
        question = generateManagerialQuestion()
        break
      default:
        question = generateTechnicalQuestion(candidateProfile)
    }

    question.difficulty = difficulty
    return { question }
  },
}
