# 💻 AI²SARS Implementation Deep Dive - Code Examples & Patterns

## 1. Authentication Flow

### Registration Example
```typescript
// app/api/auth/register/route.ts
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  // Validate input
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  
  // Check if email exists
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 })
  }
  
  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
      role: "USER"
    }
  })
  
  // Create JWT token
  const token = jwt.sign({ userId: user.id, role: user.role }, 
    process.env.NEXTAUTH_SECRET!, 
    { expiresIn: "30d" }
  )
  
  // Set HttpOnly cookie
  const response = NextResponse.json({ success: true })
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  })
  
  return response
}
```

### Login Flow
```typescript
// Client-side login example
async function handleLogin(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ email, password })
  })
  
  if (response.ok) {
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }
}
```

---

## 2. Interview Question Generation

### Q-Learning Question Selection
```typescript
// lib/trained-interview-agent.ts - Simplified excerpt

export class TrainedInterviewAgent {
  private qTable: Map<string, QValues> = new Map()
  private explorationRate = 0.25 // 25% random, 75% best
  
  recommendNextQuestion(
    candidateProfile: CandidateProfile,
    availableTypes: InterviewType[],
    askedTopics: string[]
  ): InterviewQuestion {
    // Step 1: Quantize candidate profile to discrete state
    const state = this.quantizeProfile(candidateProfile)
    const stateKey = `${state.technical},${state.experience},${state.education},${state.communication},${state.confidence},${state.cultureFit}`
    
    // Step 2: Get Q-values for this state
    const qValues = this.qTable.get(stateKey) || this.getDefaultQValues()
    
    // Step 3: ε-greedy selection
    let selectedType: InterviewType
    if (Math.random() < this.explorationRate) {
      // Random exploration (25%)
      selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)]
    } else {
      // Greedy exploitation (75%) - pick highest Q-value
      selectedType = this.selectBestType(qValues, availableTypes)
    }
    
    // Step 4: Search question pool for matching question
    const question = this.searchQuestionPool(
      selectedType,
      candidateProfile.role,
      candidateProfile.resumeSkills,
      askedTopics
    )
    
    // Step 5: Adjust difficulty based on performance
    if (candidateProfile.technicalScore > 80) {
      question.difficulty = "deep"
    } else if (candidateProfile.technicalScore < 50) {
      question.difficulty = "intro"
    }
    
    return question
  }
  
  private quantizeProfile(profile: CandidateProfile) {
    return {
      technical: Math.round(profile.technicalScore / 10), // 0-10
      experience: Math.round((profile.experienceLevel / 50) * 5), // 0-5
      education: 7, // Example value
      communication: Math.round(profile.communicationScore / 10), // 0-10
      confidence: Math.round((profile.confidenceScore / 100) * 5), // 0-5
      cultureFit: Math.round(profile.cultureFitScore / 10) // 0-10
    }
  }
  
  private selectBestType(qValues: any, availableTypes: InterviewType[]): InterviewType {
    let best = availableTypes[0]
    let bestValue = qValues[best] || 0
    
    for (const type of availableTypes) {
      const value = qValues[type] || 0
      if (value > bestValue) {
        bestValue = value
        best = type
      }
    }
    
    return best
  }
}
```

### Dynamic Question Generation
```typescript
// Questions generated from patterns (2.5+ billion possibilities)

const technicalPatterns = [
  "How would you design ${system} to handle ${scale} with ${constraint}?",
  "Explain the trade-offs between ${option1} and ${option2} for ${context}.",
  // ... more patterns
]

function generateTechnicalQuestion(role: string, skills: string[]): string {
  const system = selectRandomSystem(role)      // e.g., "distributed cache"
  const scale = selectRandomScale()             // e.g., "1M requests/sec"
  const constraint = selectRandomConstraint()   // e.g., "latency < 100ms"
  
  const pattern = technicalPatterns[Math.floor(Math.random() * technicalPatterns.length)]
  
  return pattern
    .replace("${system}", system)
    .replace("${scale}", scale)
    .replace("${constraint}", constraint)
}

// Result: Infinite unique questions from finite patterns
```

---

## 3. Interview Answer Evaluation

### Multi-Modal Scoring
```typescript
// lib/interview-evaluator.ts - Simplified excerpt

interface AnswerEvaluation {
  clarity: number          // 0-100
  technicalDepth: number   // 0-100
  problemSolving: number   // 0-100
  communication: number    // 0-100
  confidence: number       // 0-100
  bodyLanguage: number     // 0-100
}

export async function evaluateAnswer(
  question: InterviewQuestion,
  audioTranscript: string,
  videoFrame: Uint8Array,
  questionType: InterviewType
): Promise<AnswerEvaluation> {
  
  // Audio analysis
  const audioMetrics = analyzeAudio(audioTranscript)
  // Returns: { wordsPerMinute, fillerWords, pauses, clarity }
  
  // Video analysis
  const videoMetrics = analyzeVideo(videoFrame)
  // Returns: { smileIntensity, eyeContact, posture, engagement }
  
  // Content analysis
  const contentMetrics = analyzeContent(audioTranscript, question)
  // Returns: { accuracy, completeness, relevance }
  
  // Combine scores
  const scores: AnswerEvaluation = {
    clarity: (audioMetrics.clarity * 0.4 + contentMetrics.relevance * 0.6),
    technicalDepth: contentMetrics.accuracy,
    problemSolving: contentMetrics.completeness,
    communication: audioMetrics.clarity,
    confidence: (1 - audioMetrics.fillerWords) * 100,
    bodyLanguage: (videoMetrics.engagement + videoMetrics.eyeContact) / 2
  }
  
  return scores
}
```

### Audio Analysis
```typescript
// Speech patterns indicate confidence/clarity
function analyzeAudio(transcript: string): AudioMetrics {
  const words = transcript.split(/\s+/)
  const fillerWords = (transcript.match(/\bum\b|\buh\b|\like\b|\byou know\b/gi) || []).length
  const clarity = 100 - (fillerWords / words.length) * 100
  
  return {
    wordsPerMinute: calculateWPM(transcript),
    fillerWords: fillerWords,
    pauses: countPauses(transcript),
    clarity: Math.max(0, clarity)
  }
}
```

### Video Analysis
```typescript
// lib/real-video-analyzer.ts - Facial expression detection
async function analyzeVideo(videoFrame: Uint8Array): VideoMetrics {
  // Use MediaPipe for face detection
  const results = await faceDetection.estimateFaces(videoFrame)
  
  if (!results.length) {
    return { smileIntensity: 0, eyeContact: 0, posture: "neutral", engagement: 0 }
  }
  
  const face = results[0]
  
  // Smile detection - check mouth corners
  const smileIntensity = calculateSmile(face.landmarks)
  
  // Eye contact - face looking at camera
  const eyeContact = calculateGaze(face.landmarks)
  
  // Posture - shoulder alignment
  const posture = determinePosture(face.boundingBox)
  
  // Overall engagement
  const engagement = (smileIntensity + eyeContact) / 2
  
  return { smileIntensity, eyeContact, posture, engagement }
}
```

---

## 4. Resume Analysis with ATS Agent

### Resume Feature Extraction
```typescript
// lib/rl-ats-agent.ts - Feature extraction

interface ResumFeatures {
  technicalScore: number    // 0-100 (based on keywords)
  experienceYears: number   // 0-50
  educationLevel: number    // 0-10 (HS=2, Bachelor=5, Master=7, PhD=10)
  communicationScore: number // 0-100 (word choice, tone)
  leadershipScore: number   // 0-100 (keywords indicating leadership)
  cultureFitScore: number   // 0-100 (cultural keywords)
}

function extractFeaturesFromResume(resume: string): ResumFeatures {
  // Extract experience years
  const experienceMatch = resume.match(/(\d+)\s*years?/i)
  const experienceYears = experienceMatch ? parseInt(experienceMatch[1]) : 0
  
  // Extract education level
  let educationLevel = 2
  if (resume.match(/phd|doctorate/i)) educationLevel = 10
  else if (resume.match(/master|msc|ms|mba/i)) educationLevel = 7
  else if (resume.match(/bachelor|ba|bs|bsc/i)) educationLevel = 5
  else if (resume.match(/diploma|certificate/i)) educationLevel = 3
  
  // Extract technical skills
  const techKeywords = ['python', 'java', 'javascript', 'react', 'aws', 'kubernetes', ...]
  const technicalScore = (resume.match(new RegExp(techKeywords.join('|'), 'gi')) || []).length * 5
  
  // Extract communication indicators
  const communicationKeywords = ['communicated', 'presented', 'collaborated', 'explained', ...]
  const communicationScore = (resume.match(new RegExp(communicationKeywords.join('|'), 'gi')) || []).length * 8
  
  // Extract leadership indicators
  const leadershipKeywords = ['led', 'managed', 'directed', 'supervised', 'mentored', ...]
  const leadershipScore = (resume.match(new RegExp(leadershipKeywords.join('|'), 'gi')) || []).length * 10
  
  // Extract culture fit signals
  const cultureFitKeywords = ['team', 'collaborate', 'innovative', 'passionate', 'growth', ...]
  const cultureFitScore = (resume.match(new RegExp(cultureFitKeywords.join('|'), 'gi')) || []).length * 8
  
  return {
    technicalScore: Math.min(100, Math.max(0, technicalScore)),
    experienceYears,
    educationLevel,
    communicationScore: Math.min(100, Math.max(0, communicationScore)),
    leadershipScore: Math.min(100, Math.max(0, leadershipScore)),
    cultureFitScore: Math.min(100, Math.max(0, cultureFitScore))
  }
}
```

### Q-Learning Hiring Decision
```typescript
// Make hiring decision based on learned Q-table

function makeHiringDecision(features: ResumFeatures): HiringDecision {
  // Quantize features to discrete state
  const state = {
    technical: Math.round(features.technicalScore / 10),    // 0-10
    experience: Math.round(features.experienceYears / 10),  // 0-5
    education: features.educationLevel,                      // 0-10
    communication: Math.round(features.communicationScore / 10), // 0-10
    leadership: Math.round(features.leadershipScore / 10),  // 0-10
    culture: Math.round(features.cultureFitScore / 10)      // 0-10
  }
  
  const stateKey = `${state.technical},${state.experience},${state.education},${state.communication},${state.leadership},${state.culture}`
  
  // Look up Q-values for this state
  const qValues = qTable.get(stateKey) || { hire: 0.5, reject: 0.3, consider: 0.2 }
  
  // ε-greedy: 75% best, 25% random exploration
  let decision: 'HIRE' | 'REJECT' | 'CONSIDER'
  if (Math.random() < 0.25) {
    // Random exploration
    const actions = ['HIRE', 'REJECT', 'CONSIDER']
    decision = actions[Math.floor(Math.random() * 3)]
  } else {
    // Greedy exploitation - pick highest Q-value
    const entries = Object.entries(qValues)
    decision = entries.reduce((best, current) => 
      current[1] > (qValues[best.toLowerCase()] || 0) ? current[0] : best
    ) as any
  }
  
  const confidenceScore = qValues[decision.toLowerCase()] || 0.5
  
  return {
    candidateId: features.candidateId,
    decision,
    confidenceScore,
    reasoning: `Technical: ${features.technicalScore}/100, Experience: ${features.experienceYears}yrs, Communication: ${features.communicationScore}/100`,
    predictedSuccessRate: calculateSuccessRate(features),
    qValue: confidenceScore,
    timestamp: Date.now()
  }
}
```

---

## 5. Security Implementation Examples

### Rate Limiting Middleware
```typescript
// middleware.ts - Rate limiting example

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    // Create new rate limit window
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false // Rate limit exceeded
  }
  
  record.count++
  return true
}

export function middleware(request: NextRequest) {
  const ip = getClientIP(request)
  
  if (!checkRateLimit(ip, 100, 60000)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    )
  }
  
  // Continue to next middleware
  return NextResponse.next()
}
```

### Input Sanitization
```typescript
// lib/security-utils.ts - XSS prevention

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '')                    // Remove < and >
    .replace(/javascript:/gi, '')            // Remove javascript:
    .replace(/on\w+\s*=/gi, '')              // Remove event handlers (onclick=, etc.)
    .trim()
}

export function sanitizeJSON(obj: any, depth = 0, maxDepth = 10): any {
  if (depth > maxDepth) return null // Prevent deep recursion
  
  if (typeof obj === 'string') {
    return sanitizeInput(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeJSON(item, depth + 1, maxDepth))
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      // Skip dangerous keys
      if (['__proto__', 'constructor', 'prototype'].includes(key)) continue
      sanitized[key] = sanitizeJSON(value, depth + 1, maxDepth)
    }
    return sanitized
  }
  
  return obj
}

// Example usage in API
export async function POST(request: NextRequest) {
  let body = await request.json()
  body = sanitizeJSON(body) // Sanitize everything
  // Now safe to use
}
```

### Password Hashing
```typescript
// lib/auth.ts - Secure password handling

import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  // bcrypt with 10 rounds (100k iterations internally)
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Example: Create admin user
async function createAdminUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password)
  
  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
      role: 'ADMIN'
    }
  })
  
  return user
}
```

---

## 6. Database Queries Examples

### Resume CRUD
```typescript
// app/api/resumes/route.ts

// Get user's resumes
export async function GET(request: NextRequest) {
  const userId = getAuthenticatedUserId(request)
  
  const resumes = await prisma.resume.findMany({
    where: { userId },
    include: {
      versions: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  
  return NextResponse.json(resumes)
}

// Create new resume
export async function POST(request: NextRequest) {
  const userId = getAuthenticatedUserId(request)
  const { title, description, data } = await request.json()
  
  const resume = await prisma.resume.create({
    data: {
      userId,
      title,
      description,
      versions: {
        create: {
          data: JSON.stringify(data)
        }
      }
    },
    include: { versions: true }
  })
  
  return NextResponse.json(resume)
}
```

### Interview Records
```typescript
// Create interview with video

const interview = await prisma.interview.create({
  data: {
    userId: currentUserId,
    title: "Interview Session 1",
    meta: JSON.stringify({
      role: "software-engineer",
      experienceLevel: "3-5",
      startTime: new Date(),
      questionCount: 5
    }),
    video: {
      create: {
        s3Key: "interviews/2026-01-28/user-id-video.mp4",
        url: s3PresignedUrl
      }
    },
    report: {
      create: {
        content: JSON.stringify({
          totalScore: 82,
          dimensions: { ... },
          feedback: "..."
        }),
        score: "82/100"
      }
    }
  }
})
```

---

## 7. S3 Integration Examples

### Presigned URL Generation
```typescript
// app/api/uploads/presign/route.ts

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export async function POST(request: NextRequest) {
  const userId = getAuthenticatedUserId(request)
  const { fileName, contentType } = await request.json()
  
  // Sanitize filename
  const sanitizedFileName = fileName.replace(/[^a-z0-9.-]/gi, '_')
  const s3Key = `resumes/${userId}/${Date.now()}-${sanitizedFileName}`
  
  // Generate presigned URL (valid for 1 hour)
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    ContentType: contentType
  })
  
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  
  return NextResponse.json({ presignedUrl, s3Key })
}
```

### Client-Side Upload
```typescript
// Client uploads directly to S3 using presigned URL

async function uploadResume(file: File) {
  // Step 1: Get presigned URL
  const presignResponse = await fetch('/api/uploads/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type
    })
  })
  
  const { presignedUrl, s3Key } = await presignResponse.json()
  
  // Step 2: Upload directly to S3
  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  })
  
  if (uploadResponse.ok) {
    // Step 3: Notify API that upload is complete
    await fetch('/api/uploads/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ s3Key, fileName: file.name })
    })
  }
}
```

---

## 8. Email Integration (Password Reset)

```typescript
// lib/mailer.ts

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  resetUrl: string
) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset Request - AI²SARS',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}?token=${resetToken}">Reset Password</a>
      <p>This link expires in 24 hours.</p>
    `
  }
  
  return transporter.sendMail(mailOptions)
}

// Usage in forgot-password endpoint
export async function POST(request: NextRequest) {
  const { email } = await request.json()
  
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  
  // Create reset token
  const token = crypto.randomBytes(32).toString('hex')
  const hashedToken = await bcrypt.hash(token, 10)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt
    }
  })
  
  // Send email
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset?email=${email}`
  await sendPasswordResetEmail(email, token, resetUrl)
  
  return NextResponse.json({ success: true })
}
```

---

## 9. Frontend Component Example

```typescript
// components/ai-interviewer.tsx - Interview UI

export default function AIInterviewer() {
  const [sessionId, setSessionId] = useState<string>('')
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  async function startInterview() {
    const response = await fetch('/api/ai-interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start-session',
        role: 'software-engineer',
        experienceLevel: '3-5',
        resumeText: resumeContent
      })
    })
    
    const { sessionId, question } = await response.json()
    setSessionId(sessionId)
    setCurrentQuestion(question)
  }
  
  async function submitAnswer() {
    // Get video data
    const canvas = document.createElement('canvas')
    canvas.getContext('2d')!.drawImage(videoRef.current!, 0, 0)
    
    const response = await fetch('/api/ai-interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'answer-question',
        sessionId,
        answer: recordedTranscript,
        videoFrame: canvas.toDataURL(),
        duration: recordingDuration
      })
    })
    
    const { scores, nextQuestion } = await response.json()
    
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion)
    } else {
      // Interview complete
      const reportResponse = await fetch(`/api/interviews?sessionId=${sessionId}`)
      const { report } = await reportResponse.json()
      showReport(report)
    }
  }
  
  return (
    <div className="interview-container">
      <div className="question-display">
        <h2>{currentQuestion?.prompt}</h2>
        <p>Type: {currentQuestion?.type} | Difficulty: {currentQuestion?.difficulty}</p>
      </div>
      
      <div className="video-recording">
        <video ref={videoRef} autoPlay muted />
        <button onClick={() => setIsRecording(!isRecording)}>
          {isRecording ? 'Stop' : 'Start'} Recording
        </button>
      </div>
      
      <button onClick={submitAnswer} disabled={!isRecording}>
        Submit Answer
      </button>
    </div>
  )
}
```

---

## 10. Testing Patterns

### Test Interview Generation
```typescript
// Example: Verify Q-Learning is working
async function testInterviewGeneration() {
  const agent = new TrainedInterviewAgent()
  
  const profile: CandidateProfile = {
    role: "software-engineer",
    experienceLevel: "3-5",
    technicalScore: 85,
    communicationScore: 75,
    confidenceScore: 80,
    resumeSkills: ["React", "TypeScript", "Node.js"]
  }
  
  // Generate 10 questions
  const questions = []
  for (let i = 0; i < 10; i++) {
    const question = agent.recommendNextQuestion(profile, 
      ["technical", "coding", "system-design"], 
      []
    )
    questions.push(question)
    console.log(`Q${i+1}: ${question.type} - ${question.difficulty}`)
  }
  
  // Verify variety
  const types = new Set(questions.map(q => q.type))
  console.log(`Generated ${types.size} different types`)
  
  // Should see mix of types
  expect(types.size).toBeGreaterThan(1)
}
```

---

## Summary of Key Patterns

| Pattern | Purpose | Location |
|---------|---------|----------|
| JWT + Cookies | Stateless auth with security | middleware.ts, lib/auth.ts |
| Q-Learning | Adaptive AI decisions | lib/trained-interview-agent.ts |
| Presigned URLs | Secure S3 uploads | app/api/uploads/ |
| Middleware | Global security | middleware.ts |
| Zod Validation | Type-safe input validation | All API routes |
| Multi-modal Analysis | Audio + video scoring | lib/real-video-analyzer.ts |
| Stream Processing | Handle large files | app/api/ai-interview/ |
| Caching | Improve performance | (Redis ready) |

