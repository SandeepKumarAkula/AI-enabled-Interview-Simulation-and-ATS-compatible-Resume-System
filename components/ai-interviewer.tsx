"use client"

import { useEffect, useMemo, useRef, useState, type DragEvent, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/toast"
import {
  AlertCircle,
  BadgeCheck,
  Camera,
  CameraOff,
  CheckCircle,
  Download,
  Loader2,
  Mic,
  MicOff,
  Play,
  Send,
  Sparkles,
  Video,
  X
} from "lucide-react"

// Minimal SpeechRecognition typings for browser use
type SpeechRecognition = {
  start: () => void
  stop: () => void
  abort: () => void
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult?: (event: SpeechRecognitionEvent) => void
  onerror?: (event: unknown) => void
  onend?: () => void
  onstart?: () => void
}

type SpeechRecognitionEvent = {
  resultIndex: number
  results: Array<{ 0: { transcript: string } }>
}

interface InterviewQuestion {
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

interface AnswerScorecard {
  clarity: number
  technicalDepth: number
  problemSolving: number
  communication: number
  confidence: number
  bodyLanguage: number
  notes: string
}

interface ResumeInsights {
  skills: string[]
  projects: string[]
  gaps: string[]
  issues: string[]
  strengths: string[]
  validationScore: number
}

interface AggregateScores extends AnswerScorecard {}

interface LiveTranscriptEntry {
  question: InterviewQuestion
  answer: string
  codeAnswer?: string
  scores: AnswerScorecard
}

interface ReportTranscriptEntry {
  question: string
  type: string
  answer: string
  scores: AnswerScorecard
}

interface CombinedReport {
  interview: {
    role: string
    experienceLevel: string
    metrics: AnswerScorecard
    strengths: string[]
    improvements: string[]
    interviewReadinessScore: number
    roleSuitabilityScore: number
    transcript: ReportTranscriptEntry[]
    askedTopics: string[]
  }
  resume?: ResumeInsights & { validationScore: number }
}

const rolePresets = [
  "Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Engineer",
  "Data Scientist",
  "ML Engineer",
  "QA Engineer",
  "DevOps Engineer",
  "Product Manager",
]

const interviewTypePresets: Array<InterviewQuestion["type"]> = [
  "technical",
  "behavioral",
  "coding",
  "system-design",
  "managerial",
]

const experienceLevels = [
  { label: "Fresher", value: "fresher" },
  { label: "1-3 Years", value: "1-3" },
  { label: "3-5 Years", value: "3-5" },
  { label: "5+ Years", value: "5+" },
] as const

const scoreBar = (label: string, value: number, tone: "primary" | "muted" = "primary") => (
  <div className="space-y-1" key={label}>
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>{label}</span>
      <span className="font-semibold">{value}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
      <div
        className={
          tone === "primary"
            ? "h-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
            : "h-2 rounded-full bg-gray-400"
        }
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  </div>
)

export function AIInterviewer() {
  const { addToast } = useToast()
  const [role, setRole] = useState("Software Engineer")
  const [customRole, setCustomRole] = useState("")
  const [interviewTypes, setInterviewTypes] = useState<InterviewQuestion["type"][]>(["technical", "behavioral", "coding"])
  const [experienceLevel, setExperienceLevel] = useState<typeof experienceLevels[number]["value"]>("1-3")
  const [resumeText, setResumeText] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [question, setQuestion] = useState<InterviewQuestion | null>(null)
  const [codeAnswer, setCodeAnswer] = useState("")
  const [aggregate, setAggregate] = useState<AggregateScores | null>(null)
  const [resumeInsights, setResumeInsights] = useState<ResumeInsights | undefined>(undefined)
  const [report, setReport] = useState<CombinedReport | null>(null)
  const [transcript, setTranscript] = useState<LiveTranscriptEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedResume, setUploadedResume] = useState<{ fileName: string; fileSize: number; text: string } | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [mainView, setMainView] = useState<"camera" | "ai">("camera") // Toggle between camera and AI as main view
  const [interviewDuration, setInterviewDuration] = useState<number>(15)
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const autoEndTriggered = useRef(false)
  const [audioTestInProgress, setAudioTestInProgress] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenExitTimer, setFullscreenExitTimer] = useState<number | null>(null)
  const fullscreenExitTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [isListening, setIsListening] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [listeningError, setListeningError] = useState<string | null>(null)
  const [answerTranscript, setAnswerTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("") // Real-time display like Google Meet
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioTestRecRef = useRef<SpeechRecognition | null>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const startingRef = useRef<boolean>(false) // Prevent double-clicks
  const isRecognitionRunning = useRef<boolean>(false) // Track actual recognition state
  const lastProcessedResultIndex = useRef<number>(-1) // Track last processed result to prevent duplicates

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const previewVideoRef = useRef<HTMLVideoElement | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null) // Keep stream alive across transitions
  const [cameraOn, setCameraOn] = useState(false)
  const [videoSeconds, setVideoSeconds] = useState(0)
  const lastVideoStart = useRef<number | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const currentRole = customRole.trim() || role

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    if (cameraOn && lastVideoStart.current === null) {
      lastVideoStart.current = Date.now()
    }
    if (cameraOn) {
      timer = setInterval(() => {
        setVideoSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [cameraOn])

  // Countdown timer for interview duration
  useEffect(() => {
    if (remainingSeconds === null) return

    if (remainingSeconds <= 0 && !autoEndTriggered.current) {
      autoEndTriggered.current = true
      endSession(true)  // true = auto-ended by timer
      return
    }

    // Clear any existing interval and create new one
    if (timerRef.current) clearInterval(timerRef.current)
    
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev === null || prev <= 0) return null
        return prev - 1
      })
    }, 1000)

    return () => {
      // Cleanup on unmount
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds])

  // Recording seconds timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    if (isListening) {
      timer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1)
      }, 1000)
    } else {
      setRecordingSeconds(0)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isListening])

  useEffect(() => {
    if (question?.prompt) {
      speakQuestion(question.prompt)
    }
  }, [question])

  // Attach stream to video element when entering interview room
  useEffect(() => {
    if (interviewStarted && mediaStreamRef.current && videoRef.current) {
      console.log("Attaching stream to interview video element...")
      videoRef.current.srcObject = mediaStreamRef.current
      // Let autoPlay attribute handle playback
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => {
          if (e.name !== "AbortError") console.error("Play error:", e)
        })
      }
    }
  }, [interviewStarted])

  // Ensure stream stays attached when switching between main/pip views
  useEffect(() => {
    if (interviewStarted && mediaStreamRef.current && videoRef.current) {
      console.log("Reattaching stream after view switch...")
      // Only reattach if srcObject is lost
      if (!videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStreamRef.current
      }
      // Resume playback if paused
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => {
          if (e.name !== "AbortError") console.error("Play error after switch:", e)
        })
      }
    }
  }, [mainView, interviewStarted])

  // Fullscreen management
  useEffect(() => {
    if (!interviewStarted) return

    // Request fullscreen when interview starts
    const enterFullscreen = async () => {
      const elem = document.documentElement
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen()
          setIsFullscreen(true)
          console.log("Entered fullscreen")
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen()
          setIsFullscreen(true)
          console.log("Entered fullscreen (webkit)")
        }
      } catch (err) {
        console.error("Fullscreen request failed:", err)
      }
    }

    enterFullscreen()

    // Monitor fullscreen changes
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement)
      setIsFullscreen(isCurrentlyFullscreen)

      // If user exited fullscreen, start the 10-second timer
      if (!isCurrentlyFullscreen && interviewStarted && !report) {
        console.log("User exited fullscreen - starting 10-second timer")
        setFullscreenExitTimer(10)
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
    }
  }, [interviewStarted, report])

  // Fullscreen exit timer countdown
  useEffect(() => {
    if (fullscreenExitTimer === null) return

    if (fullscreenExitTimer <= 0) {
      addToast("Time's up - ending interview due to fullscreen exit", "info")
      endSession(true)
      setFullscreenExitTimer(null)
      return
    }

    if (fullscreenExitTimerRef.current) clearInterval(fullscreenExitTimerRef.current)

    fullscreenExitTimerRef.current = setInterval(() => {
      setFullscreenExitTimer(prev => {
        if (prev === null || prev <= 1) {
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (fullscreenExitTimerRef.current) clearInterval(fullscreenExitTimerRef.current)
    }
  }, [fullscreenExitTimer])

  // Prevent navigation and lock UI during active interview
  useEffect(() => {
    if (!interviewStarted || report) {
      // Cleanup when interview ends
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
      const header = document.querySelector("header")
      if (header) (header as HTMLElement).style.display = ""
      return
    }

    // Lock body scrolling during interview
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    // Hide header during interview
    const header = document.querySelector("header")
    if (header) {
      (header as HTMLElement).style.display = "none"
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
      return ""
    }

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      addToast("Cannot navigate during interview. Click 'End Interview' to exit.", "error")
      window.history.pushState(null, "", window.location.href)
    }

    // Prevent accidental key shortcuts (ESC was handled by fullscreen, Ctrl+W by browser)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common navigation shortcuts during interview
      if ((e.ctrlKey || e.metaKey) && (e.key === "w" || e.key === "q")) {
        e.preventDefault()
        addToast("Cannot close during interview.", "error")
      }
      if (e.key === "Tab") {
        // Keep tab focus within interview room
        if (e.shiftKey) {
          e.preventDefault() // Disable shift+tab for back navigation
        }
      }
    }

    // Prevent page refresh/close
    window.addEventListener("beforeunload", handleBeforeUnload)
    // Prevent back button
    window.addEventListener("popstate", handlePopState)
    // Prevent keyboard shortcuts
    window.addEventListener("keydown", handleKeyDown)
    // Push initial state to allow back button detection
    window.history.pushState(null, "", window.location.href)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("keydown", handleKeyDown)
      // Cleanup styles
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
      const headerCleanup = document.querySelector("header")
      if (headerCleanup) (headerCleanup as HTMLElement).style.display = ""
    }
  }, [interviewStarted, report, addToast])

  // Detect tab/window focus changes during interview
  useEffect(() => {
    if (!interviewStarted || report) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs/windows
        console.warn("Interview tab lost focus - stopping camera feed")
        addToast("Interview paused - you switched tabs. Return to continue.", "warning")
        // Stop listening/recording
        if (isListening) stopListening()
      }
    }

    const handleBlur = () => {
      // Window lost focus
      console.warn("Window lost focus - stopping camera feed")
      if (isListening) stopListening()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
    }
  }, [interviewStarted, report, isListening, addToast])

  const toggleInterviewType = (type: InterviewQuestion["type"]) => {
    setInterviewTypes(prev => {
      // Prevent deselecting all types - must have at least 1
      if (prev.includes(type) && prev.length === 1) {
        addToast("At least one interview type must be selected", "error")
        return prev
      }
      return prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    })
  }

  const handleResumeUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    addToast(`Uploading ${file.name}...`, "info", 2000)
      stopAllMedia()


    try {
      const buffer = await file.arrayBuffer()
      const fileName = file.name.toLowerCase()
      const isPDF = fileName.endsWith(".pdf")
      const isDOCX = fileName.endsWith(".docx")
      const isText = fileName.endsWith(".txt") || fileName.endsWith(".tex")

      let extractedText = ""

      if (isPDF) {
        try {
          const { extractPDFText } = await import("@/lib/pdf-extract-simple")
          extractedText = await extractPDFText(buffer)
        } catch (err) {
          setUploadedResume(null)
          addToast("Cannot read this PDF. Paste text or convert to DOCX.", "info", 5000)
          return
        }
      } else if (isDOCX) {
        try {
          const mammoth = await import("mammoth")
          const result = await mammoth.extractRawText({ arrayBuffer: buffer })
          extractedText = result.value || ""
        } catch (err) {
          addToast("Could not extract DOCX. Try TXT format instead.", "error", 5000)
          return
        }
      } else if (isText) {
        const decoder = new TextDecoder()
        extractedText = decoder.decode(buffer)
      } else {
        addToast("Unsupported file format. Use PDF, DOCX, or TXT.", "error", 5000)
        return
      }

      if (!extractedText || extractedText.trim().length < 10) {
        addToast("File contains too little text. Try DOCX or paste manually.", "error", 5000)
        setUploadedResume(null)
        return
      }

      setUploadedResume({ fileName: file.name, fileSize: file.size, text: extractedText.trim() })
      addToast(`${file.name} uploaded!`, "success", 3000)
    } catch (err: any) {
      addToast(`Upload failed: ${err?.message || "unknown error"}`, "error", 5000)
    }
  }

  const speakQuestion = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    // Stop any active mic capture so the AI's voice is not recorded as answer
    if (isListening) {
      stopListening()
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    speechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  // Mic test: ask user to speak a phrase and validate recognition
  const testAudio = () => {
    // If test is already in progress, stop it
    if (audioTestInProgress) {
      if (audioTestRecRef.current) {
        try {
          audioTestRecRef.current.abort()
        } catch (e) {
          // Ignore error
        }
      }
      setAudioTestInProgress(false)
      audioTestRecRef.current = null
      addToast("Test stopped", "info")
      return
    }

    // Start new test
    const phrase = "I am ready for the interview"
    const Recognition = typeof window !== "undefined" ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null
    if (!Recognition) {
      setAudioReady(false)
      addToast("Mic test not supported in this browser", "error")
      return
    }

    // CRITICAL: Stop the main recognition first to avoid conflicts
    // Only one SpeechRecognition instance can be active at a time in most browsers
    if (recognitionRef.current && isRecognitionRunning.current) {
      try {
        recognitionRef.current.abort()
        isRecognitionRunning.current = false
                console.log('🛑 Paused main recognition for audio test')
      } catch (e) {
        console.log('Main rec abort error (safe):', e)
      }
    }

    setAudioTestInProgress(true)
    addToast(`Say: "${phrase}"`, "info")
    
    // Use a longer delay to ensure main recognition is fully stopped
    setTimeout(() => {
      try {
        const rec = new Recognition()
        audioTestRecRef.current = rec
        rec.continuous = false
        rec.interimResults = false
        rec.lang = "en-US"

        let finished = false
        let testErrorOccurred = false

        rec.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim()
          const target = phrase.toLowerCase()
          finished = true
          if (transcript.includes(target)) {
            setAudioReady(true)
            addToast("Mic OK — phrase matched", "success")
          } else {
            setAudioReady(false)
            addToast(`Mic heard: "${transcript}" — please retry`, "error")
          }
          setAudioTestInProgress(false)
          audioTestRecRef.current = null
        }

        rec.onerror = (event: any) => {
          // Get error type for better diagnostics
          const errorType = event?.error || "unknown"
          
          // Ignore "aborted" errors - these are expected when we abort the recognition
          if (errorType === "aborted") {
            console.log('Audio test aborted (expected)')
            return
          }
          
          testErrorOccurred = true
          console.error('Audio test error:', { type: errorType, message: event?.message || "No details" })
          
          if (!finished) {
            setAudioReady(false)
            const errorMsg = errorType === "no-speech" 
              ? "No speech detected. Speak louder or closer to mic."
              : errorType === "network"
              ? "Network error. Check internet connection."
              : errorType === "permission-denied"
              ? "Microphone permission denied. Check browser settings."
              : "Mic test failed. Try again."
            addToast(errorMsg, "error")
          }
          setAudioTestInProgress(false)
          audioTestRecRef.current = null
        }

        rec.onend = () => {
          console.log('Audio test ended')
          // Only show "no phrase" error if recognition actually ran and no result was received
          if (!finished && !testErrorOccurred) {
            setAudioReady(false)
            addToast("Mic test ended without phrase", "error")
          }
          setAudioTestInProgress(false)
          audioTestRecRef.current = null
        }

        rec.start()
        console.log('Audio test started')

        // Safety stop after 6s
        setTimeout(() => {
          if (!finished && audioTestRecRef.current) {
            try {
              audioTestRecRef.current.abort()
            } catch (e) {
              // Ignore error
            }
            setAudioTestInProgress(false)
            audioTestRecRef.current = null
          }
        }, 6000)
      } catch (error: any) {
        console.error('Audio test failed to start:', error?.message || error)
        setAudioReady(false)
        addToast("Mic test error. Refresh and try again.", "error")
        setAudioTestInProgress(false)
        audioTestRecRef.current = null
      }
    }, 200)
  }

  const handleJoin = async () => {
    await startCamera()
  }

  const startSession = async () => {
    if (!currentRole.trim()) {
      addToast("Enter a role to begin", "error")
      return
    }
    if (!cameraReady || !audioReady) {
      addToast("Check camera and audio first", "error")
      return
    }
    setStarting(true)
    try {
      console.log("Starting interview session...")
      console.log("VideoRef current before API call:", videoRef.current)
      console.log("Camera stream before API call:", videoRef.current?.srcObject)
      
      const response = await fetch("/api/ai-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start-session",
          role: currentRole,
          interviewTypes,
          experienceLevel,
          resumeText: resumeText || uploadedResume?.text || "",
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || "Unable to start interview")
      }

      const data = await response.json()
      console.log("Interview started, switching to interview room...")
      console.log("VideoRef after API call:", videoRef.current)
      console.log("Stream after API call:", videoRef.current?.srcObject)
      
      // Keep camera stream alive - don't stop it
      console.log("Keeping camera stream active for interview room")
      
      setSessionId(data.sessionId)
      setQuestion(data.question)
      setResumeInsights(data.resumeInsights)
      setReport(null)
      setTranscript([])
      setAggregate(null)
      setInterviewStarted(true)

      // reset timers
      autoEndTriggered.current = false
      const totalSeconds = interviewDuration * 60
      setRemainingSeconds(totalSeconds)
      
      // Ensure video keeps playing after transition
      setTimeout(() => {
        if (videoRef.current?.srcObject) {
          console.log("Stream still active after transition, ensuring playback...")
          videoRef.current.play().catch(e => console.error("Play error after transition:", e))
        } else {
          console.warn("Stream LOST - stream was disconnected during transition")
          // Try to get stream again, but don't restart camera yet
          console.log("Current camera state:", { cameraOn, videoRefExists: !!videoRef.current })
        }
      }, 300)
      
      addToast("Interview started — listen for the question", "success")
    } catch (err: any) {
      addToast(err.message || "Failed to start interview", "error")
    } finally {
      setStarting(false)
    }
  }

  const submitAnswer = async () => {
    if (!sessionId || !question) {
      addToast("Start the interview first", "error")
      return
    }
    if (!answerTranscript.trim() && question.requiresCoding && !codeAnswer.trim()) {
      addToast("Please provide an answer - speak or type your response", "error")
      return
    }

    // Validation: at least some answer required
    if (!answerTranscript.trim() && !codeAnswer.trim()) {
      addToast("Answer is empty - Please speak your answer", "error")
      return
    }

    // CRITICAL: Stop speech recognition before submitting
    console.log('📤 Submitting answer, stopping recognition...')
    stopListening()

    // Give recognition a moment to fully stop
    await new Promise(resolve => setTimeout(resolve, 300))

    setLoading(true)
    try {
      console.log('📨 Sending to API:', {
        sessionId,
        questionId: question.id,
        answerLength: answerTranscript.length,
        hasCode: !!codeAnswer.trim(),
        videoSeconds
      })

      const response = await fetch("/api/ai-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "next-question",
          sessionId,
          questionId: question.id,
          answer: answerTranscript.trim(),
          codeAnswer: codeAnswer.trim(),
          videoSeconds,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Network error" }))
        console.error('API Error:', error)
        throw new Error(error.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success && data.error) {
        throw new Error(data.error)
      }

      const newEntry: LiveTranscriptEntry = {
        question,
        answer: answerTranscript,
        codeAnswer,
        scores: data.scores,
      }
      setTranscript(prev => [...prev, newEntry])
      setAggregate(data.aggregate)
      setQuestion(data.nextQuestion)
      
      // Reset for next question
      setAnswerTranscript("")
      setInterimTranscript("")
      setCodeAnswer("")
      setIsListening(false)
      startingRef.current = false
      isRecognitionRunning.current = false
      lastProcessedResultIndex.current = -1
      
      addToast("Answer recorded - Next question ready", "success")
    } catch (err: any) {
      console.error('🔴 Submit error:', err)
      addToast(`Failed to submit: ${err.message}`, "error")
      // Don't clear the answer on error - let user retry
    } finally {
      setLoading(false)
    }
  }

  const endSession = async (isAutoEnd = false) => {
    if (!sessionId) return
    setLoading(true)
    try {
      // Stop speech synthesis immediately
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }

      const response = await fetch("/api/ai-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "end-session",
          sessionId,
          mergeResumeReport: true,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || "Unable to close interview")
      }

      const data = await response.json()
      // Only show report if interview ended automatically (time expired) or naturally
      if (isAutoEnd) {
        setReport(data.report)
        addToast("Time expired - final evaluation ready", "success")
      } else {
        setReport(null)  // Don't show report for manual end
        addToast("Interview ended early - no analysis report", "info")
      }
      setQuestion(null)
      setSessionId(null)
      setRemainingSeconds(null)
      autoEndTriggered.current = false
      if (!isAutoEnd) {
        // Only exit the interview room on manual end; keep it open to show the auto-end report
        setInterviewStarted(false)
      }
    } catch (err: any) {
      addToast(err.message || "Failed to generate report", "error")
    } finally {
      setLoading(false)
      if (timerRef.current) clearInterval(timerRef.current!)
      stopAllMedia()
    }
  }

  const downloadReport = async () => {
    if (!report) return
    try {
      const { jsPDF } = await import("jspdf")
      const pdf = new jsPDF({ unit: "mm", format: "a4" })

      const margin = 18
      const pageWidth = 210
      const pageHeight = 297
      const contentWidth = pageWidth - 2 * margin
      let y = 18

      // MODERN HEADER WITH BRAND BADGE
      pdf.setFillColor(46, 204, 113)
      pdf.roundedRect(margin, y, 10, 10, 2, 2, "F")
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(16)
      pdf.setTextColor(255, 255, 255)
      pdf.text("A", margin + 3, y + 7)

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(18)
      pdf.setTextColor(17, 24, 39)
      pdf.text("AI²SARS", margin + 13, y + 7)

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(8)
      pdf.setTextColor(107, 114, 128)
      pdf.text("AI Interview Intelligence Report", margin + 13, y + 11)
      
      // Role and Experience on RIGHT side
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(8)
      pdf.setTextColor(75, 85, 99)
      pdf.text(`Role: ${report.interview?.role || "-"}`, pageWidth - 60, y + 3)
      pdf.text(`Experience: ${report.interview?.experienceLevel || "-"}`, pageWidth - 60, y + 8)
      pdf.text(new Date().toLocaleDateString(), pageWidth - 60, y + 13)

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(6)
      pdf.setTextColor(107, 114, 128)
      pdf.text("Note: Interview Score = Overall performance", pageWidth - 60, y + 17)
      pdf.text("Role Match = Job fit percentage", pageWidth - 60, y + 20)

      y += 18

      // HERO SECTION with gradient-like effect
      const readiness = report.interview?.interviewReadinessScore ?? 0
      const suitability = report.interview?.roleSuitabilityScore ?? 0

      pdf.setFillColor(240, 253, 244)
      pdf.roundedRect(margin, y, contentWidth, 38, 3, 3, "F")
      pdf.setDrawColor(191, 233, 210)
      pdf.setLineWidth(0.5)
      pdf.roundedRect(margin, y, contentWidth, 38, 3, 3, "S")

      // Left side - main score
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(8)
      pdf.setTextColor(75, 85, 99)
      pdf.text("OVERALL INTERVIEW PERFORMANCE", margin + 4, y + 6)

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(38)
      pdf.setTextColor(22, 163, 74)
      pdf.text(String(readiness), margin + 4, y + 23)

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(12)
      pdf.setTextColor(75, 85, 99)
      pdf.text("/100", margin + 22, y + 20)

      const readinessLabel = readiness >= 75 ? "Excellent Performance" : readiness >= 55 ? "Good Performance" : "Needs Improvement"
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(8)
      pdf.setTextColor(75, 85, 99)
      pdf.text(readinessLabel, margin + 4, y + 30)

      // Right side - circular score visualization
      const circleX = pageWidth - margin - 30
      const circleY = y + 19
      const circleRadius = 18

      pdf.setFillColor(250, 255, 251)
      pdf.circle(circleX, circleY, circleRadius, "F")
      pdf.setDrawColor(22, 163, 74)
      pdf.setLineWidth(1)
      pdf.circle(circleX, circleY, circleRadius, "S")

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(16)
      pdf.setTextColor(22, 163, 74)
      pdf.text(`${suitability}%`, circleX - 8, circleY + 2)

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(7)
      pdf.setTextColor(75, 85, 99)
      pdf.text("Job Fit %", circleX - 7, circleY + 7)

      y += 44

      // AI INTELLIGENCE INSIGHTS - Purple Gradient
      pdf.setFillColor(198, 216, 255)
      pdf.roundedRect(margin, y, contentWidth, 30, 3, 3, "F")
      
      // Add gradient effect manually with multiple rectangles
      for (let i = 0; i < 10; i++) {
        const alpha = i / 10
        const r = 198 + (161 - 198) * alpha
        const g = 216 + (140 - 216) * alpha
        const b = 255
        pdf.setFillColor(r, g, b)
        pdf.rect(margin, y + i * 3, contentWidth, 3, "F")
      }

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(9)
      pdf.setTextColor(255, 255, 255)
      pdf.text("Pre-trained AI Intelligence Insights", margin + 4, y + 6)

      const decision = suitability >= 70 || readiness >= 70 ? "HIRE" : "CONSIDER"
      const decisionColor = decision === "HIRE" ? [34, 197, 94] : [234, 179, 8]
      
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(9)
      pdf.setTextColor(255, 255, 255)
      pdf.text(`Decision: ${decision}`, margin + 4, y + 12)

      // RL Metrics Grid
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(7)
      pdf.setTextColor(255, 255, 255)
      pdf.text(`Confidence: ${readiness}%`, margin + 4, y + 18)
      pdf.text(`Success Prediction: ${Math.round((readiness + suitability) / 2)}%`, margin + 4, y + 22)

      const reasoning = (report.interview?.strengths || []).slice(0, 1).join("") || "Confident and professional demeanor"
      const reasoningLines = pdf.splitTextToSize(`Reasoning: ${reasoning}`, contentWidth - 8)
      pdf.setFontSize(7)
      reasoningLines.slice(0, 2).forEach((line, idx) => {
        pdf.text(line, margin + 4, y + 26 + idx * 3)
      })

      y += 34

      // METRICS SECTION - Grid Layout
      const dims = report.interview?.dimensionalScores || {}
      const metrics = [
        { label: "Technical", value: dims.technical || 0, color: [99, 102, 241] },
        { label: "Problem-Solving", value: dims.problemSolving || 0, color: [99, 102, 241] },
        { label: "Communication", value: dims.communication || 0, color: [99, 102, 241] },
        { label: "Practical", value: dims.practical || 0, color: [99, 102, 241] },
        { label: "Behavioral", value: dims.behavioral || 0, color: [99, 102, 241] },
      ]

      const metricWidth = (contentWidth - 8) / 3
      const metricHeight = 20

      metrics.forEach((metric, idx) => {
        const col = idx % 3
        const row = Math.floor(idx / 3)
        const mx = margin + col * (metricWidth + 4)
        const my = y + row * (metricHeight + 4)

        pdf.setFillColor(238, 242, 255)
        pdf.roundedRect(mx, my, metricWidth, metricHeight, 2, 2, "F")
        pdf.setDrawColor(224, 231, 255)
        pdf.setLineWidth(0.3)
        pdf.roundedRect(mx, my, metricWidth, metricHeight, 2, 2, "S")

        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(7)
        pdf.setTextColor(67, 56, 202)
        pdf.text(metric.label, mx + 3, my + 5)

        // Number and "/100" with proper spacing
        const numValue = String(metric.value)
        
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(14)
        pdf.setTextColor(49, 46, 129)
        pdf.text(numValue, mx + 3, my + 14)

        // Get actual width of number to position /100 correctly
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(14)
        const numWidth = pdf.getTextWidth(numValue)
        
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(8)
        pdf.setTextColor(67, 56, 202)
        pdf.text("/ 100", mx + 3 + numWidth + 2, my + 14)
      })

      y += Math.ceil(metrics.length / 3) * (metricHeight + 4) + 6

      // TWO COLUMN LAYOUT - Strengths & Improvements
      const leftColX = margin
      const rightColX = margin + contentWidth / 2 + 2
      const colWidth = contentWidth / 2 - 2
      
      if (y > pageHeight - 60) {
        pdf.addPage()
        y = margin
      }

      // Left - Strengths
      pdf.setFillColor(248, 250, 252)
      pdf.roundedRect(leftColX, y, colWidth, 50, 2, 2, "F")
      pdf.setDrawColor(226, 232, 240)
      pdf.setLineWidth(0.3)
      pdf.roundedRect(leftColX, y, colWidth, 50, 2, 2, "S")

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(8)
      pdf.setTextColor(34, 197, 94)
      pdf.text("Profile - Strengths", leftColX + 3, y + 5)

      const strengths = report.interview?.strengths || []
      let leftY = y + 10

      strengths.slice(0, 5).forEach(strength => {
        const cleanStrength = strength.replace(/[^\x20-\x7E]/g, '')
        const lines = pdf.splitTextToSize(`- ${cleanStrength}`, colWidth - 6)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(7)
        pdf.setTextColor(31, 41, 55)
        lines.slice(0, 2).forEach(line => {
          if (leftY < y + 48) {
            pdf.text(line, leftColX + 3, leftY)
            leftY += 3
          }
        })
      })

      // Right - Improvements
      pdf.setFillColor(248, 250, 252)
      pdf.roundedRect(rightColX, y, colWidth, 50, 2, 2, "F")
      pdf.setDrawColor(226, 232, 240)
      pdf.setLineWidth(0.3)
      pdf.roundedRect(rightColX, y, colWidth, 50, 2, 2, "S")

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(8)
      pdf.setTextColor(234, 88, 12)
      pdf.text("Profile - Improvements", rightColX + 3, y + 5)

      const improvements = report.interview?.improvements || []
      let rightY = y + 10

      improvements.slice(0, 5).forEach(improvement => {
        const cleanImprovement = improvement.replace(/[^\x20-\x7E]/g, '')
        const lines = pdf.splitTextToSize(`- ${cleanImprovement}`, colWidth - 6)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(7)
        pdf.setTextColor(31, 41, 55)
        lines.slice(0, 2).forEach(line => {
          if (rightY < y + 48) {
            pdf.text(line, rightColX + 3, rightY)
            rightY += 3
          }
        })
      })

      y += 54

      // TOPICS COVERED
      if (y > pageHeight - 30) {
        pdf.addPage()
        y = margin
      }

      pdf.setFillColor(248, 250, 252)
      pdf.roundedRect(margin, y, contentWidth, 15, 2, 2, "F")
      pdf.setDrawColor(226, 232, 240)
      pdf.setLineWidth(0.2)
      pdf.roundedRect(margin, y, contentWidth, 15, 2, 2, "S")

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(8)
      pdf.setTextColor(15, 23, 42)
      pdf.text("Topics Covered", margin + 3, y + 5)

      const topics = (report.interview?.askedTopics || []).length > 0 
        ? (report.interview?.askedTopics || []).join(", ")
        : "Not captured"
      const topicLines = pdf.splitTextToSize(topics, contentWidth - 6)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(7)
      pdf.setTextColor(75, 85, 99)
      let topicY = y + 9
      topicLines.slice(0, 2).forEach(line => {
        pdf.text(line, margin + 3, topicY)
        topicY += 3
      })

      y += 19

      // TRANSCRIPT HIGHLIGHTS
      if (y > pageHeight - 50) {
        pdf.addPage()
        y = margin
      }

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(9)
      pdf.setTextColor(15, 23, 42)
      pdf.text("Transcript Highlights", margin, y)
      y += 6

      const transcript = report.interview?.transcript || []
      transcript.forEach((entry, idx) => {
        if (y > pageHeight - 40) {
          pdf.addPage()
          y = margin + 5
        }

        // Question box
        const qText = `Q${idx + 1}: ${entry.question}`
        const qLines = pdf.splitTextToSize(qText, contentWidth - 8)
        const qBoxHeight = Math.min(qLines.length * 3.5 + 4, 18)
        
        pdf.setFillColor(224, 242, 254)
        pdf.roundedRect(margin, y, contentWidth, qBoxHeight, 2, 2, "F")
        pdf.setDrawColor(186, 230, 253)
        pdf.setLineWidth(0.4)
        pdf.roundedRect(margin, y, contentWidth, qBoxHeight, 2, 2, "S")

        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(7)
        pdf.setTextColor(14, 165, 233)
        let qY = y + 4
        qLines.slice(0, 3).forEach(line => {
          pdf.text(line, margin + 3, qY)
          qY += 3.5
        })

        y += qBoxHeight + 5

        // Answer
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(7)
        pdf.setTextColor(31, 41, 55)
        const cleanAnswer = entry.answer.replace(/[^\x20-\x7E\n]/g, '')
        const ansLines = pdf.splitTextToSize(cleanAnswer, contentWidth - 6)
        ansLines.slice(0, 6).forEach(line => {
          if (y > pageHeight - 12) {
            pdf.addPage()
            y = margin + 5
          }
          pdf.text(line, margin + 3, y)
          y += 3
        })
        y += 6
      })

      // FOOTER
      if (y > pageHeight - 15) {
        pdf.addPage()
        y = margin
      }
      
      y = pageHeight - 10
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(7)
      pdf.setTextColor(107, 114, 128)
      pdf.text("AI²SARS • AI Interview Intelligence Report", pageWidth / 2, y, { align: "center" })

      pdf.save(`ai-interview-report-${Date.now()}.pdf`)
      addToast("PDF Report Downloaded", "success")
    } catch (err: any) {
      console.error("PDF export failed", err)
      addToast("Failed to generate PDF", "error")
    }
  }

  const startCamera = async () => {
    try {
      console.log("Starting camera...")
      
      // Check if we already have an active stream from setup
      if (mediaStreamRef.current) {
        console.log("Reusing existing stream:", mediaStreamRef.current)
        const tracks = mediaStreamRef.current.getTracks()
        const activeTrack = tracks.find(t => t.readyState === 'live')
        if (activeTrack) {
          console.log("Stream still active, attaching to video elements")
          if (videoRef.current) videoRef.current.srcObject = mediaStreamRef.current
          if (previewVideoRef.current) previewVideoRef.current.srcObject = mediaStreamRef.current
          setCameraOn(true)
          setCameraReady(true)
          return
        }
      }
      
      // Get fresh stream if none exists or previous one died
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: false 
      })
      console.log("Fresh camera stream obtained:", stream)
      
      // Save stream in persistent ref
      mediaStreamRef.current = stream
      
      // Attach to main video
      if (videoRef.current) {
        console.log("Setting main video source...")
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(e => console.log("Video play error:", e))
      }
      
      // Attach to preview video
      if (previewVideoRef.current) {
        console.log("Setting preview video source...")
        previewVideoRef.current.srcObject = stream
        await previewVideoRef.current.play().catch(e => console.log("Preview play error:", e))
      }
      
      setCameraOn(true)
      setCameraReady(true)
      lastVideoStart.current = Date.now()
      setCameraError(null)
      addToast("Camera enabled", "success")
    } catch (err: any) {
      console.error("❌ Camera error:", err)
      setCameraReady(false)
      setCameraError("Camera access denied or unavailable: " + err.message)
      addToast("Camera access is required", "error")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
    if (lastVideoStart.current) {
      const elapsed = Math.floor((Date.now() - lastVideoStart.current) / 1000)
      setVideoSeconds(prev => prev + elapsed)
      lastVideoStart.current = null
    }
    setCameraOn(false)
    setCameraReady(false)
  }

  // Speech recognition (no typing answers)
  useEffect(() => {
    const Recognition = typeof window !== "undefined" ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null
    if (!Recognition) {
      setListeningError("Speech recognition not supported in this browser. Use Chrome on desktop.")
      return
    }
    const recognition = new Recognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // GOOGLE MEET STYLE: Show words immediately as you speak
      let finalText = ""
      let interimText = ""
      
      // Process all results from event.resultIndex onwards
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        const isFinal = (event.results[i] as any).isFinal
        
        if (isFinal) {
          // Only process final results we haven't seen yet
          if (i > lastProcessedResultIndex.current) {
            finalText += transcript + " "
            lastProcessedResultIndex.current = i
          }
        } else {
          // Always show interim results (they change in real-time)
          interimText += transcript
        }
      }
      
      // ACCUMULATE final results (don't replace, append!)
      if (finalText.trim()) {
        setAnswerTranscript(prev => {
          const combined = prev ? `${prev} ${finalText.trim()}` : finalText.trim()
          return combined
        })
      }
      
      // Update interim display (real-time feedback like Google Meet)
      setInterimTranscript(interimText)
    }

    recognition.onerror = (event: any) => {
      // Extract error type for better diagnostics
      const errorType = event?.error || "unknown"
      
      // Ignore "aborted" errors - these are expected when we abort the recognition
      if (errorType === "aborted") {
        setIsListening(false)
        startingRef.current = false
        isRecognitionRunning.current = false
        return
      }
      
      // Don't log if it's just an empty/unknown event object (common with abort or browser quirks)
      // This includes cases where errorType is "unknown" and there's no real error info
      if (!event || (!event.error && !event.message) || (errorType === "unknown" && !event.message)) {
        // Silently handle - these are typically abort-related or browser quirks
        setIsListening(false)
        startingRef.current = false
        isRecognitionRunning.current = false
        return
      }
      
      // Only log real errors with actual error types
      console.error('Speech error:', { 
        type: errorType, 
        message: event?.message || "No details available"
      })
      
      // Only show user-facing error for serious issues
      if (errorType === "no-speech") {
        setListeningError("No speech detected. Please speak closer to the microphone.")
      } else if (errorType === "audio-capture") {
        setListeningError("Microphone error. Check permissions and try again.")
      } else if (errorType === "not-allowed") {
        setListeningError("Microphone permission denied. Enable in browser settings.")
      }
      
      setIsListening(false)
      startingRef.current = false
      isRecognitionRunning.current = false
    }

    recognition.onend = () => {
      console.log('Speech ended')
      setIsListening(false)
      startingRef.current = false
      isRecognitionRunning.current = false
    }

    recognition.onstart = () => {
      console.log('Speech started')
      setIsListening(true)
      startingRef.current = false
      isRecognitionRunning.current = true
    }

    recognitionRef.current = recognition

    return () => {
      try {
        recognition.abort()
        isRecognitionRunning.current = false
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }, [])

  const startListening = () => {
    if (!recognitionRef.current) return
    if (isSpeaking) {
      addToast("Wait for question to finish", "info")
      return
    }
    
    // Prevent double-clicks and check if already running
    if (startingRef.current || isRecognitionRunning.current) {
      console.log('⏳ Already starting or running, please wait')
      return
    }
    
    startingRef.current = true
    console.log('Start requested')
    
    // Clear previous data
    setAnswerTranscript("")
    setInterimTranscript("")
    setListeningError(null)
    setIsListening(false)
    lastProcessedResultIndex.current = -1 // Reset result tracking
    
    // Force stop with abort() - most aggressive method
    if (isRecognitionRunning.current) {
      try {
        recognitionRef.current.abort()
        isRecognitionRunning.current = false
        console.log('🛑 Forced abort (was running)')
      } catch (e) {
        console.log('Abort error (safe to ignore):', e)
      }
    }
    
    // Wait longer for browser to fully reset - abort is async in some browsers
    setTimeout(() => {
      // Double-check state before starting
      if (isRecognitionRunning.current) {
        console.log('⚠️ Still running after abort, skipping start')
        startingRef.current = false
        setIsListening(false)
        return
      }
      
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start()
          console.log('Start command sent')
        }
      } catch (error: any) {
        console.error('❌ Start failed:', error.message)
        setListeningError("Microphone error. Try again or refresh page.")
        startingRef.current = false
        isRecognitionRunning.current = false
        setIsListening(false)
      }
    }, 250)
  }

  const stopListening = () => {
    if (!recognitionRef.current) return
    
    console.log('🛑 Stop requested')
    setIsListening(false)
    setInterimTranscript("")
    startingRef.current = false
    lastProcessedResultIndex.current = -1 // Reset result tracking
    
    try {
      recognitionRef.current.abort()
      isRecognitionRunning.current = false
      console.log('Stopped (aborted)')
    } catch (error) {
      console.log('Stop error (safe to ignore):', error)
      isRecognitionRunning.current = false
    }
  }

  const stopAllMedia = () => {
    stopListening()
    stopCamera()
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      const synthetic = { target: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>
      await handleResumeUpload(synthetic)
    }
  }

  const codingMode = question?.type === "coding"

  const readiness = useMemo(() => {
    if (!aggregate) return null
    return Math.round(
      (aggregate.clarity + aggregate.technicalDepth + aggregate.problemSolving + aggregate.communication + aggregate.confidence + aggregate.bodyLanguage) / 6
    )
  }, [aggregate])

  // Lobby view (setup/config)
  if (!interviewStarted) {
    return (
      <div className="space-y-6">
        <Card className="border-emerald-100 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-300" />
                AI Interviewer Agent
              </CardTitle>
              <CardDescription className="text-emerald-100">
                Real-time live interview with voice and video. Questions asked by AI character.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-sm text-emerald-100">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-emerald-300" />
                Live video required
              </div>
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-emerald-300" />
                Voice required
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Interview Setup</CardTitle>
              <CardDescription>Configure role, rounds, and check your camera & mic.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Job Role</label>
                  <div className="flex flex-wrap gap-2">
                    {rolePresets.map(preset => (
                      <Button
                        key={preset}
                        type="button"
                        variant={currentRole === preset && !customRole ? "default" : "outline"}
                        onClick={() => { setRole(preset); setCustomRole("") }}
                        className="text-sm"
                      >
                        {preset}
                      </Button>
                    ))}
                  </div>
                  <Input
                    placeholder="Or type a custom role"
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Interview Types</label>
                  <div className="flex flex-wrap gap-2">
                    {interviewTypePresets.map(type => (
                      <Button
                        key={type}
                        variant={interviewTypes.includes(type) ? "default" : "outline"}
                        type="button"
                        onClick={() => toggleInterviewType(type)}
                        className="capitalize text-sm"
                      >
                        {type.replace("-", " ")}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Experience Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {experienceLevels.map(item => (
                      <Button
                        key={item.value}
                        variant={experienceLevel === item.value ? "default" : "outline"}
                        type="button"
                        onClick={() => setExperienceLevel(item.value)}
                        className="w-full"
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Resume (optional)</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`mb-2 transition-all ${isDragging ? "scale-105" : ""}`}
                  >
                    <label className="cursor-pointer block">
                      <div className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-colors ${
                        isDragging
                          ? "border-emerald-500 bg-emerald-50 scale-105"
                          : "border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"
                      }`}>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {isDragging ? "Drop file here" : "Click to upload or drag & drop"}
                          </div>
                          <div className="text-xs text-gray-600">PDF, DOCX, TXT</div>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept=".txt,.md,.pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadedResume && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{uploadedResume.fileName}</div>
                          <div className="text-xs text-gray-600">{(uploadedResume.fileSize / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setUploadedResume(null)}
                        className="p-1 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <select
                    className="rounded border border-gray-300 px-2 py-1 text-sm"
                    value={interviewDuration}
                    onChange={e => setInterviewDuration(Number(e.target.value))}
                  >
                    {[5, 10, 15, 20, 30, 45, 60].map(min => (
                      <option key={min} value={min}>{min} min</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={startSession} disabled={starting || !cameraReady || !audioReady || !currentRole.trim()} className="bg-emerald-600 hover:bg-emerald-700">
                    {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    <span className="ml-2">Start Interview</span>
                  </Button>
                  <p className="text-sm text-gray-600">Check camera & mic, then start.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-sky-50">
            <CardHeader className="pb-2">
              <CardTitle>Camera & Microphone</CardTitle>
              <CardDescription>Check your device quality.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative rounded-lg border bg-black/80 h-48 overflow-hidden">
                {/* Mirror the main video stream for preview */}
                <video ref={previewVideoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                {!cameraOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/60">
                    <Camera className="h-6 w-6 mb-2" />
                    <p className="text-sm">Enable camera</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {!cameraOn ? (
                  <Button onClick={startCamera} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Video className="h-4 w-4 mr-2" />Enable Camera
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="outline" className="w-full">
                    <CameraOff className="h-4 w-4 mr-2" />Disable Camera
                  </Button>
                )}
                <div className="flex items-center gap-2 text-sm">
                  {cameraReady ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Camera ready</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <X className="h-4 w-4" />
                      <span>Camera not ready</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-3">
                <Button onClick={testAudio} variant="outline" className="w-full mb-2">
                  <Mic className="h-4 w-4 mr-2" />
                  {audioTestInProgress ? "Stop Test" : "Test Audio"}
                </Button>
                <div className="flex items-center gap-2 text-sm">
                  {audioReady ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Audio ready</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <X className="h-4 w-4" />
                      <span>Audio not ready</span>
                    </div>
                  )}
                </div>
              </div>

              {cameraError && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{cameraError}</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Interview room (Google Meet/WhatsApp style - full screen camera with overlay controls)
  console.log("=== INTERVIEW ROOM RENDERING ===")
  console.log("interviewStarted:", interviewStarted)
  console.log("mediaStreamRef.current:", mediaStreamRef.current)
  console.log("videoRef.current?.srcObject:", videoRef.current?.srcObject)
  console.log("cameraOn:", cameraOn)
  
  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">
      {/* Main Video Area - Picture-in-Picture Layout */}
      <div className="flex-1 bg-black relative overflow-hidden">
        {/* MAIN VIEW - Camera (Large) */}
        {mainView === "camera" && (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onClick={() => setMainView("ai")}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "pointer"
              }}
              onCanPlayThrough={() => console.log("Video ready to play")}
              onLoadedMetadata={() => console.log("Metadata loaded")}
              onPlay={() => console.log("Video is playing")}
              onError={(e) => {
                console.error("❌ Video error:", e)
                addToast("Video playback error", "error")
              }}
            />

            {/* PICTURE-IN-PICTURE: AI Character (Small, Bottom-Right) */}
            <div
              onClick={() => setMainView("ai")}
              className="absolute bottom-28 right-4 w-40 h-56 bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-lg border-2 border-emerald-500/60 overflow-hidden cursor-pointer hover:border-emerald-400 transition-all z-30 shadow-lg hover:shadow-emerald-500/20"
            >
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-3">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-emerald-300">AI Interviewer</p>
                  <p className={`text-xs font-medium ${isSpeaking ? "text-red-400" : "text-gray-400"}`}>
                    {isSpeaking ? "Speaking" : "Listening"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MAIN VIEW - AI Character (Large) */}
        {mainView === "ai" && (
          <>
            <div
              onClick={() => setMainView("camera")}
              className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-slate-900/50 flex flex-col items-center justify-center cursor-pointer hover:from-emerald-800/40 hover:to-slate-800/60 transition-all z-10"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
              <p className="text-2xl font-bold text-emerald-300 mb-2">AI Interviewer</p>
              <p className={`text-lg font-semibold ${isSpeaking ? "text-red-400 animate-pulse" : "text-gray-300"}`}>
                {isSpeaking ? "Speaking..." : "Listening..."}
              </p>
              <p className="text-sm text-gray-400 mt-4">Click to see your camera</p>
            </div>

            {/* PICTURE-IN-PICTURE: Camera (Small, Bottom-Right) */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onClick={() => setMainView("camera")}
              onLoadedMetadata={() => console.log("PIP Video metadata loaded")}
              onPlay={() => console.log("PIP Video playing")}
              className="absolute bottom-28 right-4 w-40 h-56 rounded-lg border-2 border-emerald-500/60 object-cover cursor-pointer hover:border-emerald-400 transition-all z-30 shadow-lg hover:shadow-emerald-500/20"
            />
          </>
        )}

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none z-5" />

        {/* Top-Left: Recording Timer Badge */}
        {isListening && (
          <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2 z-20">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-semibold">{Math.floor(recordingSeconds)}s</span>
          </div>
        )}

        {/* Left: Interview Duration Timer - Aligned with question */}
        {remainingSeconds !== null && (
          <div className={`fixed top-16 left-4 ${remainingSeconds <= 60 ? "bg-red-600" : "bg-emerald-600"} backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 border-2 ${remainingSeconds <= 60 ? "border-red-300" : "border-emerald-300"} z-[9999] font-bold text-lg shadow-lg`}>
            <span className="text-white text-xl">Timer</span>
            <span className={remainingSeconds <= 60 ? "text-white animate-pulse" : "text-white"}>
              {Math.max(0, Math.floor(remainingSeconds / 60))}:{String(Math.max(0, remainingSeconds % 60)).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Fullscreen Exit Timer */}
        {fullscreenExitTimer !== null && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-[10000]">
            <div className="text-center space-y-6">
              <div className="text-6xl font-bold text-red-500 animate-pulse">{fullscreenExitTimer}</div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">Fullscreen Exited</p>
                <p className="text-lg text-gray-300">Interview will end automatically in {fullscreenExitTimer} second{fullscreenExitTimer !== 1 ? 's' : ''}</p>
                <p className="text-sm text-gray-400">Please return to fullscreen or the interview will be terminated.</p>
              </div>
              <Button
                onClick={() => {
                  const elem = document.documentElement
                  if (elem.requestFullscreen) {
                    elem.requestFullscreen().then(() => {
                      setFullscreenExitTimer(null)
                    }).catch(err => console.error("Fullscreen request failed:", err))
                  } else if ((elem as any).webkitRequestFullscreen) {
                    (elem as any).webkitRequestFullscreen().then(() => {
                      setFullscreenExitTimer(null)
                    }).catch((err: any) => console.error("Fullscreen request failed:", err))
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Return to Fullscreen
              </Button>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-24 right-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border border-emerald-500/30 z-20">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium">{currentRole} • Q{Math.ceil(transcript.length / 2) + 1}</span>
        </div>

        {/* Center-Top: Current Question Text (Large, Centered) */}
        {question && (
          <div className="absolute top-16 left-0 right-0 px-6 flex justify-center pointer-events-none z-15">
            <div className="bg-black/70 backdrop-blur-md rounded-xl px-6 py-4 max-w-2xl border border-emerald-500/30 text-center">
              <p className="text-lg font-semibold text-white leading-relaxed">{question.prompt}</p>
            </div>
          </div>
        )}

        {/* Live Captions - Your Speech as You Speak (Google Meet Style) */}
        {isListening && (answerTranscript || interimTranscript) && (
          <div className="absolute bottom-32 left-0 right-0 px-6 flex justify-center pointer-events-none z-20">
            <div className="bg-blue-900/50 backdrop-blur-md rounded-lg px-6 py-3 max-w-2xl border border-blue-500/40 text-center">
              <p className="text-xs text-blue-200 mb-1">You:</p>
              <p className="text-sm text-blue-300 leading-relaxed italic">
                {answerTranscript}
                {interimTranscript && (
                  <span className="opacity-60"> {interimTranscript}</span>
                )}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Control Bar (Google Meet Style - Clear Labels) */}
      <div className="bg-black/95 backdrop-blur-md border-t border-emerald-500/20 px-6 py-4 flex items-center justify-center gap-6 z-30">
        {/* Ready to Answer State */}
        {!isListening ? (
          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                console.log('🎤 Start Answer clicked')
                startListening()
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-14 w-14 p-0 flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95"
              disabled={report !== null || !question}
            >
              <Mic className="h-6 w-6" />
            </Button>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Start Answer</span>
              <span className="text-xs text-gray-400">
                {question ? "Click microphone to begin" : "Waiting for question..."}
              </span>
            </div>
          </div>
        ) : (
          // Recording State
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  console.log('🛑 Stop Microphone clicked')
                  stopListening()
                }}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full h-14 w-14 p-0 flex items-center justify-center animate-pulse transition-all duration-200 transform hover:scale-110 active:scale-95"
              >
                <MicOff className="h-6 w-6" />
              </Button>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-red-400">Stop Microphone</span>
                <span className="text-xs text-gray-300">Recording: {answerTranscript.length} chars</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-gray-600"></div>

            {/* Submit Answer */}
            <Button
              onClick={submitAnswer}
              disabled={!answerTranscript.trim()}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all duration-200 transform ${
                answerTranscript.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4" />
              <span>Submit Answer</span>
            </Button>

            {/* Status */}
            <div className="ml-auto text-xs text-gray-400">
              {(answerTranscript.length > 0 || interimTranscript.length > 0) ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>{answerTranscript.length + interimTranscript.length} chars</span>
                </div>
              ) : (
                <span>Listening...</span>
              )}
            </div>
          </div>
        )}

        {/* End Interview Button (Always visible when ready) */}
        {!isListening && (
          <Button
            onClick={() => endSession(false)}
            disabled={loading || !sessionId}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4" />
            <span>End Interview</span>
          </Button>
        )}
      </div>

      {/* Report Modal */}
      {report && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-gray-900 border-emerald-500/30 max-h-96 overflow-y-auto">
            <CardHeader className="border-b border-emerald-500/20">
              <CardTitle className="text-2xl text-white">Interview Complete</CardTitle>
              <CardDescription className="text-gray-400">{new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-900/30 rounded border border-emerald-500/30">
                  <div className="text-xs text-gray-400">Readiness</div>
                  <div className="text-2xl font-bold text-emerald-400">{report.interview?.interviewReadinessScore || 0}%</div>
                </div>
                <div className="p-3 bg-blue-900/30 rounded border border-blue-500/30">
                  <div className="text-xs text-gray-400">Suitability</div>
                  <div className="text-2xl font-bold text-blue-400">{report.interview?.roleSuitabilityScore || 0}%</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-emerald-400 mb-2">✓ Strengths</h3>
                <ul className="space-y-1">
                  {(report.interview?.strengths || []).map((s, i) => (
                    <li key={i} className="text-xs text-gray-300">{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-orange-400 mb-2">→ Improvements</h3>
                <ul className="space-y-1">
                  {(report.interview?.improvements || []).map((imp, i) => (
                    <li key={i} className="text-xs text-gray-300">{imp}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t border-emerald-500/20 flex gap-2 pt-4">
              <Button
                onClick={downloadReport}
                className="bg-emerald-600 hover:bg-emerald-700 flex-1 text-sm"
              >
                <Download className="h-3 w-3 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={() => {
                  setReport(null)
                  setInterviewStarted(false)
                  setSessionId(null)
                  setQuestion(null)
                  setTranscript([])
                  setAggregate(null)
                }}
                className="bg-gray-700 hover:bg-gray-600 flex-1 text-sm"
              >
                New Interview
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AIInterviewer
