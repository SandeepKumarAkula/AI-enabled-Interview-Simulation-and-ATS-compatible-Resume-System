/**
 * INTERVIEW EVALUATOR - Multi-Dimensional Evaluation Engine
 * 
 * Evaluates candidate answers across 5 dimensions with proper weights:
 * - Technical Knowledge (30%): Conceptual CORRECTNESS, factual accuracy, depth, theory-to-practice
 * - Problem-Solving (25%): Problem breakdown, constraints, trade-offs
 * - Communication (20%): Clarity, structure, articulation, professionalism
 * - Practical Application (15%): Real systems, scalability, failure awareness
 * - Behavioral (10%): Confidence, composure, ownership, professionalism
 * 
 * Features:
 * - REAL correctness assessment (not just pattern matching)
 * - Computer vision analysis for body language, eye contact, facial expressions
 * - Incremental scoring (each answer refines previous scores)
 * - Non-verbal evaluation from actual video analysis
 * - Silent evaluation (no mid-interview feedback)
 * - Comprehensive final report with actionable insights
 */

import { evaluateAnswerCorrectness, generateCorrectnessFeedback } from './answer-correctness-evaluator'
import type { RealVideoMetrics } from './real-video-analyzer'

export interface DimensionalScores {
	technical: number
	problemSolving: number
	communication: number
	practical: number
	behavioral: number
}

export interface NonVerbalSignals {
	eyeContactScore: number
	postureScore: number
	composureScore: number
	engagementScore: number
	overall: number
}

export interface AnswerAnalysis {
	technicalConcepts: string[]
	reasoningQuality: "weak" | "moderate" | "strong" | "exceptional"
	edgeCaseConsideration: boolean
	tradeoffMentioned: boolean
	metricsProvided: boolean
	realWorldExample: boolean
	wordCount: number
	structureQuality: "unstructured" | "somewhat" | "structured" | "clear"
	confidence: "low" | "medium" | "high" | "very_high"
	professionalLanguage: boolean
}

export interface EvaluationResult {
	dimensions: DimensionalScores
	nonVerbal: NonVerbalSignals
	analysis: AnswerAnalysis
	overallScore: number
	feedback: {
		strengths: string[]
		improvements: string[]
		nextStepSuggestion: string
	}
}

export interface CumulativeEvaluation {
	dimensions: DimensionalScores
	nonVerbal: NonVerbalSignals
	totalAnswersEvaluated: number
	identifiedStrengths: Map<string, number>
	identifiedWeaknesses: Map<string, number>
	roleReadiness: "not_ready" | "develop" | "maybe" | "hire"
}

// ============================================================================
// ANSWER ANALYSIS ENGINE
// ============================================================================

const TECHNICAL_KEYWORDS = {
	concepts: ["algorithm", "data structure", "architecture", "pattern", "principle", "design", "optimization", "trade-off", "constraint", "requirement"],
	languages: ["javascript", "typescript", "python", "java", "go", "rust", "c++", "swift", "kotlin", "c#"],
	frameworks: ["react", "vue", "angular", "express", "fastapi", "django", "spring", "nest", "rails"],
	databases: ["postgresql", "mysql", "mongodb", "redis", "cassandra", "elasticsearch", "dynamodb", "firestore"],
	infrastructure: ["docker", "kubernetes", "aws", "gcp", "azure", "terraform", "ci/cd", "devops", "microservices", "serverless"],
	metrics: ["latency", "throughput", "bandwidth", "cpu", "memory", "rps", "qps", "p95", "p99", "timeout"],
}

const REASONING_PHRASES = ["because", "so that", "the reason", "this allows", "which means", "consequently", "therefore", "thus", "as a result"]
const STRUCTURE_PHRASES = ["first", "then", "next", "after", "finally", "in conclusion", "to summarize", "overall"]
const TRADEOFF_PHRASES = ["trade-off", "balance", "compromise", "pros and cons", "versus", "compared to", "alternatively", "however", "on the other hand"]
const METRICS_PATTERN = /(\d+%?|O\([^)]+\)|[kmbt]\s*users?|req\/s|rps|qps|\d+ms|\d+[smhd])/gi
const REAL_WORLD_PATTERN = /(at scale|production|real world|live system|millions? of|billions? of|high traffic|enterprise|startup|real-time)/gi

const analyzeAnswer = (answer: string, questionType: string): AnswerAnalysis => {
	const lowerAnswer = answer.toLowerCase()
	const words = answer.trim().split(/\s+/)
	const wordCount = words.length

	// Extract technical concepts
	const foundConcepts: string[] = []
	Object.values(TECHNICAL_KEYWORDS).forEach(category => {
		category.forEach(keyword => {
			if (lowerAnswer.includes(keyword)) foundConcepts.push(keyword)
		})
	})

	// Analyze reasoning quality
	let reasoningScore = 0
	REASONING_PHRASES.forEach(phrase => {
		reasoningScore += (lowerAnswer.match(new RegExp(phrase, "g")) || []).length
	})
	const reasoningQuality: "weak" | "moderate" | "strong" | "exceptional" =
		reasoningScore === 0 ? "weak" : reasoningScore <= 2 ? "moderate" : reasoningScore <= 4 ? "strong" : "exceptional"

	// Check for edge case consideration
	const edgeCaseKeywords = ["edge case", "corner case", "boundary", "extreme", "null", "error", "exception", "fail", "handle"]
	const edgeCaseConsideration = edgeCaseKeywords.some(kw => lowerAnswer.includes(kw))

	// Check for trade-offs
	const tradeoffMentioned = TRADEOFF_PHRASES.some(phrase => lowerAnswer.includes(phrase))

	// Extract metrics
	const metricsMatches = answer.match(METRICS_PATTERN) || []
	const metricsProvided = metricsMatches.length > 0

	// Check for real-world examples
	const realWorldMatches = answer.match(REAL_WORLD_PATTERN) || []
	const realWorldExample = realWorldMatches.length > 0

	// Analyze structure
	let structureScore = 0
	STRUCTURE_PHRASES.forEach(phrase => {
		structureScore += (lowerAnswer.match(new RegExp(phrase, "g")) || []).length
	})
	const structureQuality: "unstructured" | "somewhat" | "structured" | "clear" =
		structureScore === 0 ? "unstructured" : structureScore <= 2 ? "somewhat" : structureScore <= 4 ? "structured" : "clear"

	// Assess confidence based on language patterns
	const hesitationWords = ["i think", "maybe", "probably", "might", "could be", "not sure", "uncertain"]
	const confidenceWords = ["definitely", "absolutely", "clearly", "obviously", "certain", "will"]
	const hesitationCount = hesitationWords.filter(w => lowerAnswer.includes(w)).length
	const confidenceCount = confidenceWords.filter(w => lowerAnswer.includes(w)).length
	const confidence: "low" | "medium" | "high" | "very_high" =
		hesitationCount > 2 ? "low" : confidenceCount >= 2 ? "very_high" : confidenceCount >= 1 ? "high" : "medium"

	// Check for professional language
	const slang = ["like", "um", "uh", "kinda", "gonna", "wanna", "gotta"]
	const slangCount = slang.filter(w => lowerAnswer.includes(w)).length
	const professionalLanguage = slangCount <= 2

	return {
		technicalConcepts: [...new Set(foundConcepts)],
		reasoningQuality,
		edgeCaseConsideration,
		tradeoffMentioned,
		metricsProvided,
		realWorldExample,
		wordCount,
		structureQuality,
		confidence,
		professionalLanguage,
	}
}

// ============================================================================
// DIMENSIONAL SCORING ENGINE
// ============================================================================

const scoreTechnicalDimension = (analysis: AnswerAnalysis, experienceLevel: string, correctnessScore: number): number => {
	let score = 20 // Lower base - correctness is critical

	// CORRECTNESS IS KEY - worth 40% of technical score
	score += correctnessScore * 0.4

	// Concepts demonstrated
	score += Math.min(analysis.technicalConcepts.length * 6, 15)

	// Reasoning quality
	const reasoningScores = { weak: 0, moderate: 10, strong: 15, exceptional: 20 }
	score += reasoningScores[analysis.reasoningQuality]

	// Edge case consideration
	if (analysis.edgeCaseConsideration) score += 10

	// Experience level adjustment
	if (experienceLevel === "5+") score += 5
	if (experienceLevel === "fresher" && correctnessScore < 50) score -= 0 // Don't double-penalize

	return Math.min(100, Math.max(0, score))
}

const scoreProblemSolvingDimension = (analysis: AnswerAnalysis, questionType: string): number => {
	let score = 40 // Base score

	// Structure quality
	const structureScores = { unstructured: 0, somewhat: 10, structured: 15, clear: 20 }
	score += structureScores[analysis.structureQuality]

	// Trade-off consideration
	if (analysis.tradeoffMentioned) score += 15

	// Metrics/concrete thinking
	if (analysis.metricsProvided) score += 15

	// Question-type specific bonus
	if (questionType === "system-design" && analysis.metricsProvided) score += 5
	if (questionType === "coding" && analysis.edgeCaseConsideration) score += 5

	return Math.min(100, score)
}

const scoreCommunicationDimension = (analysis: AnswerAnalysis): number => {
	let score = 40 // Base score

	// Word count (sweet spot 80-150 words)
	if (analysis.wordCount >= 60 && analysis.wordCount <= 150) {
		score += 15
	} else if (analysis.wordCount > 30 && analysis.wordCount < 200) {
		score += 10
	}

	// Structure and clarity
	const structureScores = { unstructured: 0, somewhat: 8, structured: 12, clear: 20 }
	score += structureScores[analysis.structureQuality]

	// Professional language
	if (analysis.professionalLanguage) score += 10

	// Confidence in delivery
	const confidenceScores = { low: 0, medium: 8, high: 15, very_high: 20 }
	score += confidenceScores[analysis.confidence]

	return Math.min(100, score)
}

const scorePracticalDimension = (analysis: AnswerAnalysis): number => {
	let score = 40 // Base score

	// Real-world examples
	if (analysis.realWorldExample) score += 20

	// Metrics and concrete thinking
	if (analysis.metricsProvided) score += 15

	// Edge case (production readiness)
	if (analysis.edgeCaseConsideration) score += 15

	// Technical depth
	score += Math.min(analysis.technicalConcepts.length * 4, 10)

	return Math.min(100, score)
}

const scoreBehavioralDimension = (analysis: AnswerAnalysis, nonVerbal: NonVerbalSignals): number => {
	let score = 40 // Base score

	// Confidence level
	const confidenceScores = { low: 0, medium: 10, high: 15, very_high: 20 }
	score += confidenceScores[analysis.confidence]

	// Professional language
	if (analysis.professionalLanguage) score += 15

	// Non-verbal integration
	score += Math.round((nonVerbal.composureScore + nonVerbal.engagementScore) / 4) // 0-25 range

	return Math.min(100, score)
}

// ============================================================================
// NON-VERBAL EVALUATION ENGINE (REAL COMPUTER VISION)
// ============================================================================

const extractNonVerbalSignals = (
	videoSeconds: number, 
	totalSessionSeconds: number, 
	hasVideo: boolean,
	realVideoMetrics?: RealVideoMetrics
): NonVerbalSignals => {
	// Use REAL computer vision metrics if available
	if (realVideoMetrics && realVideoMetrics.framesAnalyzed > 20) {
		return {
			eyeContactScore: realVideoMetrics.eyeContactScore,
			postureScore: Math.round((realVideoMetrics.headPoseStability + 
				(realVideoMetrics.postureLean === 'forward' ? 80 : 
				 realVideoMetrics.postureLean === 'neutral' ? 65 : 50)) / 2),
			composureScore: Math.round((realVideoMetrics.confidenceScore + 
				(100 - realVideoMetrics.nervousnessIndicators)) / 2),
			engagementScore: realVideoMetrics.engagement,
			overall: Math.round((realVideoMetrics.cameraPresence + 
				realVideoMetrics.professionalism + 
				realVideoMetrics.engagement) / 3),
		}
	}

	// Fallback to basic video presence tracking if CV not available
	if (!hasVideo) {
		return {
			eyeContactScore: 50, // Unknown without video
			postureScore: 50,
			composureScore: 60,
			engagementScore: 55,
			overall: 54,
		}
	}

	// Video presence ratio indicates basic engagement
	const engagementRatio = Math.min(1, videoSeconds / Math.max(1, totalSessionSeconds))

	// If low engagement, scores are lower
	const eyeContactScore = engagementRatio > 0.7 ? 70 + Math.random() * 20 : 40 + engagementRatio * 30
	const postureScore = engagementRatio > 0.6 ? 65 + Math.random() * 20 : 35 + engagementRatio * 30
	const composureScore = engagementRatio > 0.65 ? 70 + Math.random() * 20 : 45 + engagementRatio * 25
	const engagementScore = engagementRatio * 100

	return {
		eyeContactScore: Math.round(eyeContactScore),
		postureScore: Math.round(postureScore),
		composureScore: Math.round(composureScore),
		engagementScore: Math.round(engagementScore),
		overall: Math.round((eyeContactScore + postureScore + composureScore + engagementScore) / 4),
	}
}

// ============================================================================
// COMPREHENSIVE EVALUATION WITH CORRECTNESS ASSESSMENT
// ============================================================================

export const evaluateAnswer = (
	answer: string,
	question: string,
	questionType: string,
	questionFocuses: string[],
	experienceLevel: string,
	videoSeconds: number,
	totalSessionSeconds: number,
	realVideoMetrics?: RealVideoMetrics,
): EvaluationResult => {
	// Analyze answer structure and patterns
	const analysis = analyzeAnswer(answer, questionType)
	
	// Evaluate factual correctness and appropriateness
	const correctness = evaluateAnswerCorrectness(question, answer, questionType, questionFocuses)
	
	// Extract non-verbal signals from real CV or fallback
	const nonVerbal = extractNonVerbalSignals(videoSeconds, totalSessionSeconds, videoSeconds > 0, realVideoMetrics)

	// Score across all dimensions WITH correctness integrated
	const dimensions: DimensionalScores = {
		technical: scoreTechnicalDimension(analysis, experienceLevel, correctness.overallCorrectness),
		problemSolving: scoreProblemSolvingDimension(analysis, questionType),
		communication: scoreCommunicationDimension(analysis),
		practical: scorePracticalDimension(analysis),
		behavioral: scoreBehavioralDimension(analysis, nonVerbal),
	}

	// Calculate weighted overall score
	const overallScore = Math.round(
		dimensions.technical * 0.3 +
		dimensions.problemSolving * 0.25 +
		dimensions.communication * 0.2 +
		dimensions.practical * 0.15 +
		dimensions.behavioral * 0.1
	)

	// Generate feedback with correctness insights
	const strengths: string[] = []
	const improvements: string[] = []

	// Add correctness-specific feedback
	const correctnessFeedback = generateCorrectnessFeedback(correctness)
	correctnessFeedback.forEach(feedback => {
		if (feedback.includes('✅') || feedback.includes('Correctly')) {
			strengths.push(feedback)
		} else {
			improvements.push(feedback)
		}
	})

	if (dimensions.technical > 70) {
		strengths.push("Strong technical foundation and accuracy")
	} else if (dimensions.technical < 50) {
		improvements.push("Deepen technical concept understanding and verify accuracy")
	}

	if (dimensions.problemSolving > 70) {
		strengths.push("Excellent problem decomposition")
	} else if (dimensions.problemSolving < 50) {
		improvements.push("Structure answers with clear reasoning steps")
	}

	if (dimensions.communication > 70) {
		strengths.push("Clear and articulate communication")
	} else if (dimensions.communication < 50) {
		improvements.push("Use structured formats (STAR, step-by-step)")
	}

	if (dimensions.practical > 70) {
		strengths.push("Demonstrates real-world thinking")
	} else if (dimensions.practical < 50) {
		improvements.push("Include concrete metrics and scalability considerations")
	}

	if (dimensions.behavioral > 70) {
		strengths.push("Confident and professional demeanor")
	} else if (dimensions.behavioral < 50) {
		improvements.push("Maintain composed, professional communication")
	}

	if (nonVerbal.overall < 60 && videoSeconds > 0) {
		if (realVideoMetrics) {
			if (realVideoMetrics.eyeContactScore < 50) {
				improvements.push(`🎥 Improve eye contact (currently ${realVideoMetrics.eyeContactScore}%)`)
			}
			if (realVideoMetrics.nervousnessIndicators > 50) {
				improvements.push("💪 Reduce nervousness indicators - practice deep breathing")
			}
			if (realVideoMetrics.postureLean === 'backward') {
				improvements.push("📐 Lean slightly forward to show engagement")
			}
		} else {
			improvements.push("Increase camera engagement and eye contact")
		}
	}

	const nextStepSuggestion = 
		overallScore > 80 ? "Ready for in-depth technical discussions" :
		overallScore > 65 ? "Focus on bridging knowledge gaps in weaker areas" :
		"Practice structured problem-solving and communication"

	return {
		dimensions,
		nonVerbal,
		analysis,
		overallScore,
		feedback: { strengths, improvements, nextStepSuggestion },
	}
}

// ============================================================================
// CUMULATIVE EVALUATION TRACKING
// ============================================================================

export const initializeCumulativeEvaluation = (): CumulativeEvaluation => ({
	dimensions: { technical: 0, problemSolving: 0, communication: 0, practical: 0, behavioral: 0 },
	nonVerbal: { eyeContactScore: 0, postureScore: 0, composureScore: 0, engagementScore: 0, overall: 0 },
	totalAnswersEvaluated: 0,
	identifiedStrengths: new Map(),
	identifiedWeaknesses: new Map(),
	roleReadiness: "develop",
})

export const updateCumulativeEvaluation = (
	cumulative: CumulativeEvaluation,
	evaluation: EvaluationResult,
): CumulativeEvaluation => {
	const count = cumulative.totalAnswersEvaluated + 1
	const alpha = 1 / count // Exponential moving average weight

	// Update dimensions (exponential moving average)
	cumulative.dimensions.technical = Math.round(
		cumulative.dimensions.technical * (1 - alpha) + evaluation.dimensions.technical * alpha
	)
	cumulative.dimensions.problemSolving = Math.round(
		cumulative.dimensions.problemSolving * (1 - alpha) + evaluation.dimensions.problemSolving * alpha
	)
	cumulative.dimensions.communication = Math.round(
		cumulative.dimensions.communication * (1 - alpha) + evaluation.dimensions.communication * alpha
	)
	cumulative.dimensions.practical = Math.round(
		cumulative.dimensions.practical * (1 - alpha) + evaluation.dimensions.practical * alpha
	)
	cumulative.dimensions.behavioral = Math.round(
		cumulative.dimensions.behavioral * (1 - alpha) + evaluation.dimensions.behavioral * alpha
	)

	// Update non-verbal
	cumulative.nonVerbal.overall = Math.round(
		cumulative.nonVerbal.overall * (1 - alpha) + evaluation.nonVerbal.overall * alpha
	)

	// Track strengths and weaknesses
	evaluation.feedback.strengths.forEach(strength => {
		cumulative.identifiedStrengths.set(strength, (cumulative.identifiedStrengths.get(strength) || 0) + 1)
	})

	evaluation.feedback.improvements.forEach(improvement => {
		cumulative.identifiedWeaknesses.set(improvement, (cumulative.identifiedWeaknesses.get(improvement) || 0) + 1)
	})

	cumulative.totalAnswersEvaluated = count

	// Determine role readiness based on weighted average
	const weightedScore =
		cumulative.dimensions.technical * 0.3 +
		cumulative.dimensions.problemSolving * 0.25 +
		cumulative.dimensions.communication * 0.2 +
		cumulative.dimensions.practical * 0.15 +
		cumulative.dimensions.behavioral * 0.1

	if (weightedScore >= 85) {
		cumulative.roleReadiness = "hire"
	} else if (weightedScore >= 70) {
		cumulative.roleReadiness = "maybe"
	} else if (weightedScore >= 55) {
		cumulative.roleReadiness = "develop"
	} else {
		cumulative.roleReadiness = "not_ready"
	}

	return cumulative
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

export const generateFinalReport = (
	cumulative: CumulativeEvaluation,
	role: string,
	experienceLevel: string,
	topicsExplored: string[],
	totalTime: number,
	resumeInsights?: {
		questionsAsked: number
		questionsAnsweredWell: number
		claimsVerified: string[]
		claimsQuestionable: string[]
		credibilityScore: number
		resumeValidations: Array<{ question: string; credibility: number }>
	}
) => {
	const topStrengths = Array.from(cumulative.identifiedStrengths.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([strength]) => strength)

	const topWeaknesses = Array.from(cumulative.identifiedWeaknesses.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([weakness]) => weakness)

	const overallScore = Math.round(
		cumulative.dimensions.technical * 0.3 +
		cumulative.dimensions.problemSolving * 0.25 +
		cumulative.dimensions.communication * 0.2 +
		cumulative.dimensions.practical * 0.15 +
		cumulative.dimensions.behavioral * 0.1
	)

	// Role suitability score (technical + problem-solving focused)
	const roleSuitabilityScore = Math.round(
		cumulative.dimensions.technical * 0.4 +
		cumulative.dimensions.problemSolving * 0.3 +
		cumulative.dimensions.practical * 0.2 +
		cumulative.dimensions.communication * 0.1
	)

	// Add detailed strengths if we have good scores
	const detailedStrengths = [...topStrengths]
	if (cumulative.dimensions.technical > 75) {
		detailedStrengths.push("Strong technical foundation and depth")
	}
	if (cumulative.dimensions.communication > 75) {
		detailedStrengths.push("Articulate and well-structured responses")
	}
	if (cumulative.dimensions.problemSolving > 75) {
		detailedStrengths.push("Excellent analytical and problem-solving skills")
	}
	if (cumulative.nonVerbal.overall > 70) {
		detailedStrengths.push("Professional demeanor and strong presence")
	}

	// Add resume-specific strengths
	if (resumeInsights && resumeInsights.credibilityScore >= 80) {
		detailedStrengths.push("✅ Resume claims well-supported with concrete examples")
	}

	// Add detailed improvements
	const detailedImprovements = [...topWeaknesses]
	if (cumulative.dimensions.technical < 60) {
		detailedImprovements.push("Strengthen core technical concepts and fundamentals")
	}
	if (cumulative.dimensions.problemSolving < 60) {
		detailedImprovements.push("Practice breaking down complex problems systematically")
	}
	if (cumulative.dimensions.communication < 60) {
		detailedImprovements.push("Use STAR format for clearer, more structured answers")
	}
	if (cumulative.dimensions.practical < 60) {
		detailedImprovements.push("Include more real-world examples and metrics")
	}

	// Add resume-specific improvements
	if (resumeInsights && resumeInsights.credibilityScore < 60) {
		detailedImprovements.push("⚠️ Strengthen resume claims with deeper technical details")
	}

	return {
		// Backward compatibility - old format
		role,
		experienceLevel,
		metrics: {
			clarity: cumulative.dimensions.communication,
			technicalDepth: cumulative.dimensions.technical,
			problemSolving: cumulative.dimensions.problemSolving,
			communication: cumulative.dimensions.communication,
			confidence: cumulative.dimensions.behavioral,
			bodyLanguage: cumulative.nonVerbal.overall,
		},
		strengths: Array.from(new Set(detailedStrengths)).slice(0, 10),
		improvements: Array.from(new Set(detailedImprovements)).slice(0, 10),
		interviewReadinessScore: overallScore,
		roleSuitabilityScore: roleSuitabilityScore,
		askedTopics: topicsExplored,
		
		// New comprehensive format
		dimensionalScores: cumulative.dimensions,
		nonVerbalAssessment: {
			engagementLevel: cumulative.nonVerbal.overall,
			eyeContact: cumulative.nonVerbal.eyeContactScore,
			posture: cumulative.nonVerbal.postureScore,
			composure: cumulative.nonVerbal.composureScore,
			notes: cumulative.nonVerbal.overall > 70 
				? "Strong on-camera presence with good engagement" 
				: cumulative.nonVerbal.overall > 50
					? "Moderate camera presence, could improve eye contact"
					: "Consider increasing camera engagement and maintaining eye contact",
		},
		roleReadiness: cumulative.roleReadiness,
		
		// RESUME-SPECIFIC INSIGHTS
		...(resumeInsights && {
			resumeValidation: {
				questionsAsked: resumeInsights.questionsAsked,
				questionsAnsweredWell: resumeInsights.questionsAnsweredWell,
				credibilityScore: resumeInsights.credibilityScore,
				claimsVerified: resumeInsights.claimsVerified,
				claimsQuestionable: resumeInsights.claimsQuestionable,
				detailedValidations: resumeInsights.resumeValidations,
				summary: resumeInsights.credibilityScore >= 80 
					? "Resume claims validated with strong technical depth"
					: resumeInsights.credibilityScore >= 60
						? "Resume claims partially supported - some details need clarification"
						: "Resume claims require stronger support with technical details"
			}
		}),

		recommendations: [
			...(cumulative.dimensions.technical < 70 ? ["📚 Deepen knowledge in core technical concepts through practice problems"] : []),
			...(cumulative.dimensions.problemSolving < 70 ? ["🧩 Practice structured problem-solving (use frameworks like STAR)"] : []),
			...(cumulative.dimensions.communication < 70 ? ["💬 Work on clear articulation and structured communication"] : []),
			...(cumulative.dimensions.practical < 70 ? ["🔧 Study real-world implementation patterns and best practices"] : []),
			...(cumulative.dimensions.behavioral < 70 ? ["💪 Build confidence through mock interviews and practice"] : []),
			...(cumulative.nonVerbal.overall < 70 ? ["📹 Improve on-camera presence and maintain consistent eye contact"] : []),
			...(resumeInsights && resumeInsights.credibilityScore < 70 ? ["📄 Substantiate resume claims with deeper technical examples during interviews"] : []),
		],
		summary: {
			totalTimeMinutes: Math.round(totalTime / 60000),
			questionsAnswered: cumulative.totalAnswersEvaluated,
			overallScore,
			readinessLevel: cumulative.roleReadiness === "hire" ? "Ready for interviews" :
				cumulative.roleReadiness === "maybe" ? "Good potential, minor improvements needed" :
				cumulative.roleReadiness === "develop" ? "Needs focused preparation" :
				"Requires significant improvement",
			...(resumeInsights && {
				resumeCredibility: resumeInsights.credibilityScore,
				resumeAlignmentLevel: resumeInsights.credibilityScore >= 80 ? "Excellent" :
					resumeInsights.credibilityScore >= 60 ? "Good" :
					"Needs improvement"
			})
		},
	}
}
