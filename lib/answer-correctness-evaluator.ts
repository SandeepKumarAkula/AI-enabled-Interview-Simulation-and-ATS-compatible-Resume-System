/**
 * ANSWER CORRECTNESS EVALUATOR
 * Evaluates factual correctness and contextual appropriateness of answers
 * Beyond pattern matching - assesses if answer actually addresses the question
 */

export interface CorrectnessAssessment {
  factuallyCorrect: boolean
  answersTheQuestion: boolean
  conceptualAccuracy: number // 0-100
  relevanceScore: number // 0-100
  completenessScore: number // 0-100
  misconceptions: string[]
  correctPoints: string[]
  missingElements: string[]
  overallCorrectness: number // 0-100
}

/**
 * Knowledge base of correct concepts and common misconceptions
 */
const KNOWLEDGE_BASE = {
  // Web Development
  'react': {
    correct: ['virtual dom', 'component', 'state', 'props', 'hooks', 'jsx', 'reconciliation', 'unidirectional data flow'],
    incorrect: ['two-way binding by default', 'react is mvc', 'always faster than vanilla'],
    context: ['ui library', 'declarative', 'component-based']
  },
  'closure': {
    correct: ['lexical scope', 'function returns function', 'preserves outer scope', 'private variables'],
    incorrect: ['class feature', 'same as callback', 'only in javascript'],
    context: ['scope', 'function', 'memory']
  },
  'promise': {
    correct: ['asynchronous', 'then', 'catch', 'pending', 'resolved', 'rejected', 'chain'],
    incorrect: ['synchronous', 'blocking', 'same as callback'],
    context: ['async', 'javascript', 'future value']
  },
  
  // Data Structures
  'binary search tree': {
    correct: ['ordered', 'left less than root', 'right greater than root', 'o(log n) average', 'recursive'],
    incorrect: ['always balanced', 'o(log n) worst case', 'faster than all structures'],
    context: ['tree', 'searching', 'sorting']
  },
  'hash table': {
    correct: ['key-value', 'o(1) average', 'hash function', 'collision', 'array-based'],
    incorrect: ['o(1) guaranteed', 'no collisions', 'sorted'],
    context: ['lookup', 'dictionary', 'map']
  },
  
  // Algorithms
  'quicksort': {
    correct: ['divide and conquer', 'pivot', 'o(n log n) average', 'o(n²) worst', 'in-place'],
    incorrect: ['always o(n log n)', 'stable', 'always better than merge sort'],
    context: ['sorting', 'comparison', 'recursive']
  },
  'dynamic programming': {
    correct: ['overlapping subproblems', 'optimal substructure', 'memoization', 'tabulation', 'avoids recomputation'],
    incorrect: ['always faster', 'greedy approach', 'divide and conquer only'],
    context: ['optimization', 'recursion', 'caching']
  },
  
  // System Design
  'load balancer': {
    correct: ['distributes traffic', 'multiple servers', 'round robin', 'least connections', 'health checks'],
    incorrect: ['stores data', 'increases individual server capacity', 'prevents all failures'],
    context: ['scalability', 'availability', 'traffic']
  },
  'microservices': {
    correct: ['independent services', 'decoupled', 'separate databases', 'api communication', 'scalable independently'],
    incorrect: ['always better than monolith', 'no overhead', 'simple to implement'],
    context: ['architecture', 'distributed', 'services']
  },
  'caching': {
    correct: ['faster access', 'reduces load', 'temporary storage', 'ttl', 'invalidation', 'lru', 'memory'],
    incorrect: ['permanent storage', 'always accurate', 'no tradeoffs'],
    context: ['performance', 'speed', 'optimization']
  },
  
  // Database
  'sql injection': {
    correct: ['security vulnerability', 'malicious sql', 'prepared statements', 'parameterized queries', 'sanitization'],
    incorrect: ['performance issue', 'database feature', 'only in mysql'],
    context: ['security', 'vulnerability', 'attack']
  },
  'normalization': {
    correct: ['reduce redundancy', '1nf', '2nf', '3nf', 'separate tables', 'dependencies'],
    incorrect: ['always better', 'improves all queries', 'denormalization is bad'],
    context: ['database design', 'redundancy', 'structure']
  },
  'acid': {
    correct: ['atomicity', 'consistency', 'isolation', 'durability', 'transaction', 'guarantee'],
    incorrect: ['performance feature', 'only for sql', 'no tradeoffs'],
    context: ['database', 'transaction', 'reliability']
  },
  
  // Networking
  'http': {
    correct: ['stateless', 'request-response', 'methods', 'get', 'post', 'status codes', 'headers'],
    incorrect: ['secure by default', 'stateful', 'stores data'],
    context: ['protocol', 'web', 'communication']
  },
  'rest': {
    correct: ['stateless', 'resource-based', 'http methods', 'json', 'urls', 'crud'],
    incorrect: ['fastest api', 'always better than graphql', 'secure by default'],
    context: ['api', 'architecture', 'web service']
  },
  'websocket': {
    correct: ['full-duplex', 'persistent connection', 'real-time', 'bidirectional', 'upgrade from http'],
    incorrect: ['replaces http', 'always better', 'same as polling'],
    context: ['real-time', 'communication', 'protocol']
  },
}

/**
 * Question-Answer correctness patterns
 */
const QUESTION_PATTERNS = {
  'what is': { expects: ['definition', 'explanation', 'concept'], avoids: ['unrelated', 'wrong definition'] },
  'how does': { expects: ['process', 'mechanism', 'steps'], avoids: ['only definition', 'vague'] },
  'why': { expects: ['reason', 'benefit', 'cause'], avoids: ['how', 'what'] },
  'difference between': { expects: ['comparison', 'contrast', 'both mentioned'], avoids: ['only one', 'unrelated'] },
  'when would you': { expects: ['scenario', 'use case', 'condition'], avoids: ['always', 'never'] },
  'implement': { expects: ['code', 'steps', 'logic', 'approach'], avoids: ['theory only', 'vague'] },
  'optimize': { expects: ['improvement', 'performance', 'specific technique'], avoids: ['generic', 'unrelated'] },
  'design': { expects: ['architecture', 'components', 'tradeoffs', 'scale'], avoids: ['single solution', 'no tradeoffs'] },
}

/**
 * Common red flags in answers
 */
const RED_FLAGS = [
  { pattern: /i don't know/i, severity: 'high', issue: 'Lack of knowledge or confidence' },
  { pattern: /not sure|maybe|i think|probably/gi, severity: 'medium', issue: 'Uncertainty (multiple instances)' },
  { pattern: /always works|never fails|best solution|perfect/gi, severity: 'medium', issue: 'Absolute statements without nuance' },
  { pattern: /just use|simply|easy|trivial/gi, severity: 'low', issue: 'Oversimplification' },
  { pattern: /\b(um|uh|er|ah){3,}/gi, severity: 'low', issue: 'Excessive filler words' },
  { pattern: /copy paste|google it|stack overflow|chatgpt/gi, severity: 'high', issue: 'Deflection to external resources' },
]

/**
 * Evaluate answer correctness based on question and answer content
 */
export function evaluateAnswerCorrectness(
  question: string,
  answer: string,
  questionType: string,
  focuses: string[]
): CorrectnessAssessment {
  
  const lowerQuestion = question.toLowerCase()
  const lowerAnswer = answer.toLowerCase()
  const wordCount = answer.split(/\s+/).length
  
  // Check if answer is too short
  if (wordCount < 10) {
    return {
      factuallyCorrect: false,
      answersTheQuestion: false,
      conceptualAccuracy: 10,
      relevanceScore: 20,
      completenessScore: 5,
      misconceptions: ['Answer too brief - lacks detail'],
      correctPoints: [],
      missingElements: ['Detailed explanation', 'Examples', 'Context'],
      overallCorrectness: 10,
    }
  }
  
  // Detect red flags
  const detectedFlags: string[] = []
  RED_FLAGS.forEach(flag => {
    const matches = answer.match(flag.pattern)
    if (matches && matches.length > 0) {
      if (flag.severity === 'medium' && matches.length >= 3) {
        detectedFlags.push(flag.issue)
      } else if (flag.severity === 'high') {
        detectedFlags.push(flag.issue)
      }
    }
  })
  
  // Check if answer addresses the question type
  let questionPattern: { expects: string[]; avoids: string[] } | null = null
  for (const [pattern, expectations] of Object.entries(QUESTION_PATTERNS)) {
    if (lowerQuestion.includes(pattern)) {
      questionPattern = expectations
      break
    }
  }
  
  const missingElements: string[] = []
  let answersQuestionScore = 50 // base score
  
  if (questionPattern) {
    // Check if answer contains expected elements
    const hasExpected = questionPattern.expects.some(expect => {
      if (expect === 'definition') return lowerAnswer.includes('is') || lowerAnswer.includes('means')
      if (expect === 'process') return lowerAnswer.includes('first') || lowerAnswer.includes('then') || lowerAnswer.includes('step')
      if (expect === 'reason') return lowerAnswer.includes('because') || lowerAnswer.includes('reason')
      if (expect === 'comparison') return lowerAnswer.includes('while') || lowerAnswer.includes('whereas') || lowerAnswer.includes('compared')
      if (expect === 'scenario') return lowerAnswer.includes('when') || lowerAnswer.includes('if') || lowerAnswer.includes('case')
      if (expect === 'code') return lowerAnswer.includes('function') || lowerAnswer.includes('class') || lowerAnswer.includes('return')
      if (expect === 'tradeoffs') return lowerAnswer.includes('trade') || lowerAnswer.includes('advantage') || lowerAnswer.includes('disadvantage')
      return false
    })
    
    if (hasExpected) {
      answersQuestionScore += 30
    } else {
      questionPattern.expects.forEach(exp => missingElements.push(exp))
    }
    
    // Check if answer avoids wrong types
    const hasAvoided = !questionPattern.avoids.some(avoid => {
      if (avoid === 'theory only') return !lowerAnswer.includes('example') && !lowerAnswer.includes('implement')
      if (avoid === 'only one') return !lowerAnswer.includes('other') && !lowerAnswer.includes('also')
      return false
    })
    
    if (hasAvoided) answersQuestionScore += 20
  }
  
  // Check knowledge against knowledge base
  const correctPoints: string[] = []
  const misconceptions: string[] = []
  let conceptScore = 50
  
  focuses.forEach(focus => {
    const knowledge = KNOWLEDGE_BASE[focus.toLowerCase() as keyof typeof KNOWLEDGE_BASE]
    if (knowledge) {
      // Check for correct concepts
      const correctMatches = knowledge.correct.filter(concept => 
        lowerAnswer.includes(concept)
      )
      correctPoints.push(...correctMatches)
      conceptScore += Math.min(30, correctMatches.length * 10)
      
      // Check for misconceptions
      const incorrectMatches = knowledge.incorrect.filter(misconception =>
        lowerAnswer.includes(misconception)
      )
      if (incorrectMatches.length > 0) {
        misconceptions.push(...incorrectMatches.map(m => `Misconception: ${m}`))
        conceptScore -= incorrectMatches.length * 15
      }
      
      // Check if context is mentioned
      const contextMatches = knowledge.context.filter(ctx => lowerAnswer.includes(ctx))
      if (contextMatches.length > 0) {
        conceptScore += 10
      }
    }
  })
  
  conceptScore = Math.max(0, Math.min(100, conceptScore))
  
  // Calculate relevance (does answer relate to question topic?)
  const questionWords = lowerQuestion.split(/\s+/).filter(w => w.length > 4)
  const answerWords = lowerAnswer.split(/\s+/)
  const overlap = questionWords.filter(qw => answerWords.includes(qw)).length
  const relevanceScore = Math.min(100, (overlap / Math.max(questionWords.length, 1)) * 100 + 30)
  
  // Calculate completeness
  let completenessScore = 40
  if (wordCount > 30) completenessScore += 20
  if (wordCount > 60) completenessScore += 20
  if (lowerAnswer.includes('example')) completenessScore += 10
  if (lowerAnswer.includes('because') || lowerAnswer.includes('reason')) completenessScore += 10
  completenessScore = Math.min(100, completenessScore)
  
  // Add missing elements if incomplete
  if (completenessScore < 60) {
    if (!lowerAnswer.includes('example')) missingElements.push('Real-world example')
    if (!lowerAnswer.includes('because')) missingElements.push('Reasoning/explanation')
    if (wordCount < 40) missingElements.push('More detail and depth')
  }
  
  // Overall correctness
  const overallCorrectness = Math.round(
    conceptScore * 0.35 +
    answersQuestionScore * 0.30 +
    relevanceScore * 0.20 +
    completenessScore * 0.15
  )
  
  const factuallyCorrect = conceptScore >= 60 && misconceptions.length === 0
  const answersTheQuestion = answersQuestionScore >= 70
  
  return {
    factuallyCorrect,
    answersTheQuestion,
    conceptualAccuracy: Math.round(conceptScore),
    relevanceScore: Math.round(relevanceScore),
    completenessScore: Math.round(completenessScore),
    misconceptions: [...new Set([...misconceptions, ...detectedFlags])],
    correctPoints: [...new Set(correctPoints)],
    missingElements: [...new Set(missingElements)],
    overallCorrectness: Math.max(0, Math.min(100, overallCorrectness)),
  }
}

/**
 * Generate feedback based on correctness assessment
 */
export function generateCorrectnessFeedback(assessment: CorrectnessAssessment): string[] {
  const feedback: string[] = []
  
  if (!assessment.factuallyCorrect) {
    feedback.push('⚠️ Contains factual inaccuracies or misconceptions')
  }
  
  if (!assessment.answersTheQuestion) {
    feedback.push('❌ Answer doesn\'t directly address the question asked')
  }
  
  if (assessment.conceptualAccuracy < 50) {
    feedback.push('📚 Needs stronger understanding of core concepts')
  }
  
  if (assessment.relevanceScore < 50) {
    feedback.push('🎯 Answer strays from the question topic')
  }
  
  if (assessment.completenessScore < 50) {
    feedback.push('📝 Answer lacks depth and completeness')
  }
  
  if (assessment.misconceptions.length > 0) {
    feedback.push(`🔴 Misconceptions detected: ${assessment.misconceptions.slice(0, 2).join(', ')}`)
  }
  
  if (assessment.correctPoints.length > 0) {
    feedback.push(`✅ Correctly mentioned: ${assessment.correctPoints.slice(0, 3).join(', ')}`)
  }
  
  if (assessment.missingElements.length > 0) {
    feedback.push(`➕ Could improve by adding: ${assessment.missingElements.slice(0, 2).join(', ')}`)
  }
  
  return feedback
}
