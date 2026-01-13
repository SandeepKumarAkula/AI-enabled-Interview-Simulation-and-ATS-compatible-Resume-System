/**
 * Real Computer Vision Analysis for Interview Assessment
 * Uses MediaPipe Face Landmarker for actual facial/body language detection
 */

import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export interface RealVideoMetrics {
  // Eye Contact & Gaze
  eyeContactScore: number // 0-100: percentage of time maintaining eye contact
  gazeDirection: 'center' | 'left' | 'right' | 'up' | 'down' | 'away'
  gazeStability: number // 0-100: how steady the gaze is
  blinkRate: number // blinks per minute (normal: 15-20)
  
  // Facial Expressions & Confidence
  smileFrequency: number // 0-100: natural smiling
  expressionVariety: number // 0-100: appropriate facial expressions
  nervousnessIndicators: number // 0-100: lip biting, excessive blinking, etc.
  confidenceScore: number // 0-100: overall facial confidence
  
  // Head Movement & Posture
  headPoseStability: number // 0-100: steady head position
  nodFrequency: number // appropriate nodding (engagement)
  headTiltAngle: number // degrees from vertical (excessive = uncertainty)
  postureLean: 'forward' | 'backward' | 'neutral' // engagement level
  
  // Overall Presence
  cameraPresence: number // 0-100: overall on-camera presence
  professionalism: number // 0-100: professional demeanor
  engagement: number // 0-100: visual engagement indicators
  
  // Raw Data
  framesAnalyzed: number
  analysisQuality: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface FrameAnalysis {
  timestamp: number
  eyeContact: boolean
  gazeAngle: { x: number; y: number }
  headPose: { pitch: number; yaw: number; roll: number }
  eyeOpenness: { left: number; right: number }
  mouthOpenness: number
  smile: number
}

export class RealVideoAnalyzer {
  private faceLandmarker: FaceLandmarker | null = null
  private initialized = false
  private frameHistory: FrameAnalysis[] = []
  private lastBlinkTime = 0
  private blinkCount = 0
  private analysisStartTime = 0
  
  async initialize(): Promise<boolean> {
    try {
      console.log('🎥 Initializing MediaPipe Face Landmarker...')
      
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      )
      
      this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
      })
      
      this.initialized = true
      this.analysisStartTime = Date.now()
      console.log('✅ MediaPipe initialized successfully')
      return true
    } catch (error) {
      console.error('❌ MediaPipe initialization failed:', error)
      return false
    }
  }
  
  analyzeFrame(videoElement: HTMLVideoElement, timestamp: number): FrameAnalysis | null {
    if (!this.initialized || !this.faceLandmarker || !videoElement) {
      return null
    }
    
    try {
      const results = this.faceLandmarker.detectForVideo(videoElement, timestamp)
      
      if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
        return null
      }
      
      const landmarks = results.faceLandmarks[0]
      const blendshapes = results.faceBlendshapes?.[0]?.categories || []
      
      // Eye landmarks (MediaPipe uses 468 face landmarks)
      const leftEye = landmarks[159] // Left eye center
      const rightEye = landmarks[386] // Right eye center
      const noseTip = landmarks[1] // Nose tip for gaze direction
      const faceCenter = landmarks[168] // Face center point
      
      // Calculate gaze direction (simplified - comparing eye to nose position)
      const gazeX = (leftEye.x + rightEye.x) / 2 - faceCenter.x
      const gazeY = (leftEye.y + rightEye.y) / 2 - faceCenter.y
      
      // Determine if looking at camera (center of screen)
      const eyeContact = Math.abs(gazeX) < 0.15 && Math.abs(gazeY) < 0.15
      
      // Extract blendshape scores
      const getBlendshape = (name: string) => {
        const shape = blendshapes.find(s => s.categoryName === name)
        return shape ? shape.score : 0
      }
      
      const leftEyeOpen = 1 - getBlendshape('eyeBlinkLeft')
      const rightEyeOpen = 1 - getBlendshape('eyeBlinkRight')
      const mouthOpen = getBlendshape('jawOpen')
      const smileValue = (getBlendshape('mouthSmileLeft') + getBlendshape('mouthSmileRight')) / 2
      
      // Detect blinks
      if (leftEyeOpen < 0.2 && rightEyeOpen < 0.2) {
        const timeSinceLastBlink = timestamp - this.lastBlinkTime
        if (timeSinceLastBlink > 200) { // Minimum 200ms between blinks
          this.blinkCount++
          this.lastBlinkTime = timestamp
        }
      }
      
      // Calculate head pose from landmarks
      const headPose = this.calculateHeadPose(landmarks)
      
      const frame: FrameAnalysis = {
        timestamp,
        eyeContact,
        gazeAngle: { x: gazeX, y: gazeY },
        headPose,
        eyeOpenness: { left: leftEyeOpen, right: rightEyeOpen },
        mouthOpenness: mouthOpen,
        smile: smileValue,
      }
      
      this.frameHistory.push(frame)
      
      // Keep only last 10 seconds of frames (at ~10fps = 100 frames)
      if (this.frameHistory.length > 100) {
        this.frameHistory.shift()
      }
      
      return frame
    } catch (error) {
      console.error('Frame analysis error:', error)
      return null
    }
  }
  
  private calculateHeadPose(landmarks: any[]): { pitch: number; yaw: number; roll: number } {
    // Using key facial landmarks to estimate head rotation
    const noseTip = landmarks[1]
    const chin = landmarks[152]
    const leftEye = landmarks[33]
    const rightEye = landmarks[263]
    const leftMouth = landmarks[61]
    const rightMouth = landmarks[291]
    
    // Yaw (left-right rotation): based on nose position relative to face center
    const yaw = (noseTip.x - 0.5) * 60 // -30 to +30 degrees approximately
    
    // Pitch (up-down tilt): based on nose-chin distance
    const pitch = (noseTip.y - chin.y) * 40 // degrees
    
    // Roll (head tilt): based on eye level
    const eyeDiff = rightEye.y - leftEye.y
    const roll = Math.atan2(eyeDiff, rightEye.x - leftEye.x) * (180 / Math.PI)
    
    return { pitch, yaw, roll }
  }
  
  generateMetrics(): RealVideoMetrics {
    if (this.frameHistory.length === 0) {
      return this.getDefaultMetrics()
    }
    
    const frames = this.frameHistory
    const totalFrames = frames.length
    
    // Eye Contact Analysis
    const eyeContactFrames = frames.filter(f => f.eyeContact).length
    const eyeContactScore = Math.round((eyeContactFrames / totalFrames) * 100)
    
    // Gaze Stability (lower variance = more stable)
    const gazeVariance = this.calculateGazeVariance(frames)
    const gazeStability = Math.max(0, Math.min(100, 100 - gazeVariance * 500))
    
    // Determine current gaze direction from recent frames
    const recentFrames = frames.slice(-5)
    const avgGazeX = recentFrames.reduce((sum, f) => sum + f.gazeAngle.x, 0) / recentFrames.length
    const avgGazeY = recentFrames.reduce((sum, f) => sum + f.gazeAngle.y, 0) / recentFrames.length
    
    let gazeDirection: RealVideoMetrics['gazeDirection'] = 'center'
    if (Math.abs(avgGazeX) > 0.2) gazeDirection = avgGazeX > 0 ? 'right' : 'left'
    else if (Math.abs(avgGazeY) > 0.2) gazeDirection = avgGazeY > 0 ? 'down' : 'up'
    else if (eyeContactScore < 30) gazeDirection = 'away'
    
    // Blink Rate (normal is 15-20 per minute)
    const timeElapsedMin = (Date.now() - this.analysisStartTime) / 60000
    const blinkRate = timeElapsedMin > 0 ? this.blinkCount / timeElapsedMin : 15
    const blinkScore = Math.abs(blinkRate - 17.5) < 10 ? 100 : Math.max(0, 100 - Math.abs(blinkRate - 17.5) * 5)
    
    // Facial Expressions
    const avgSmile = frames.reduce((sum, f) => sum + f.smile, 0) / totalFrames
    const smileFrequency = Math.round(avgSmile * 100)
    
    const smileVariety = this.calculateExpressionVariety(frames)
    const expressionVariety = Math.round(smileVariety * 100)
    
    // Nervousness (excessive blinking, mouth tension)
    const excessiveBlinks = blinkRate > 30 ? ((blinkRate - 30) / 30) * 50 : 0
    const mouthTension = frames.filter(f => f.mouthOpenness > 0.3 && f.smile < 0.1).length / totalFrames * 100
    const nervousnessIndicators = Math.round(Math.min(100, excessiveBlinks + mouthTension))
    
    // Confidence (combination of eye contact, stable gaze, appropriate expressions)
    const confidenceScore = Math.round(
      eyeContactScore * 0.4 +
      gazeStability * 0.3 +
      (100 - nervousnessIndicators) * 0.2 +
      expressionVariety * 0.1
    )
    
    // Head Pose Analysis
    const avgHeadPose = frames.reduce((acc, f) => ({
      pitch: acc.pitch + Math.abs(f.headPose.pitch),
      yaw: acc.yaw + Math.abs(f.headPose.yaw),
      roll: acc.roll + Math.abs(f.headPose.roll),
    }), { pitch: 0, yaw: 0, roll: 0 })
    
    avgHeadPose.pitch /= totalFrames
    avgHeadPose.yaw /= totalFrames
    avgHeadPose.roll /= totalFrames
    
    const headPoseStability = Math.round(Math.max(0, 100 - (avgHeadPose.pitch + avgHeadPose.yaw + avgHeadPose.roll) * 2))
    
    // Nodding (small pitch changes indicate engagement)
    const nodFrequency = this.detectNods(frames)
    
    // Posture lean
    const avgPitch = frames.reduce((sum, f) => sum + f.headPose.pitch, 0) / totalFrames
    const postureLean: RealVideoMetrics['postureLean'] = 
      avgPitch > 10 ? 'forward' : avgPitch < -10 ? 'backward' : 'neutral'
    
    // Overall metrics
    const cameraPresence = Math.round(
      eyeContactScore * 0.35 +
      confidenceScore * 0.25 +
      headPoseStability * 0.2 +
      gazeStability * 0.2
    )
    
    const professionalism = Math.round(
      headPoseStability * 0.3 +
      (100 - nervousnessIndicators) * 0.3 +
      eyeContactScore * 0.25 +
      expressionVariety * 0.15
    )
    
    const engagement = Math.round(
      eyeContactScore * 0.35 +
      nodFrequency * 0.25 +
      expressionVariety * 0.2 +
      (postureLean === 'forward' ? 20 : postureLean === 'neutral' ? 10 : 0)
    )
    
    const analysisQuality: RealVideoMetrics['analysisQuality'] = 
      totalFrames > 80 ? 'excellent' :
      totalFrames > 50 ? 'good' :
      totalFrames > 20 ? 'fair' : 'poor'
    
    return {
      eyeContactScore,
      gazeDirection,
      gazeStability: Math.round(gazeStability),
      blinkRate: Math.round(blinkRate),
      smileFrequency,
      expressionVariety,
      nervousnessIndicators,
      confidenceScore,
      headPoseStability,
      nodFrequency,
      headTiltAngle: Math.round(avgHeadPose.roll),
      postureLean,
      cameraPresence,
      professionalism,
      engagement,
      framesAnalyzed: totalFrames,
      analysisQuality,
    }
  }
  
  private calculateGazeVariance(frames: FrameAnalysis[]): number {
    if (frames.length < 2) return 0
    
    const avgX = frames.reduce((sum, f) => sum + f.gazeAngle.x, 0) / frames.length
    const avgY = frames.reduce((sum, f) => sum + f.gazeAngle.y, 0) / frames.length
    
    const variance = frames.reduce((sum, f) => {
      const dx = f.gazeAngle.x - avgX
      const dy = f.gazeAngle.y - avgY
      return sum + (dx * dx + dy * dy)
    }, 0) / frames.length
    
    return Math.sqrt(variance)
  }
  
  private calculateExpressionVariety(frames: FrameAnalysis[]): number {
    // Calculate variety in expressions (but not too much - natural variation)
    const smileValues = frames.map(f => f.smile)
    const smileStdDev = this.standardDeviation(smileValues)
    
    // Optimal variety is moderate (0.1-0.3 range)
    if (smileStdDev > 0.1 && smileStdDev < 0.3) return 1.0
    if (smileStdDev > 0.05 && smileStdDev < 0.4) return 0.8
    if (smileStdDev < 0.05) return 0.5 // Too static
    return 0.6 // Too varied
  }
  
  private detectNods(frames: FrameAnalysis[]): number {
    let nodCount = 0
    for (let i = 1; i < frames.length - 1; i++) {
      const prev = frames[i - 1].headPose.pitch
      const curr = frames[i].headPose.pitch
      const next = frames[i + 1].headPose.pitch
      
      // Detect pitch change indicating a nod (down then up)
      if (curr > prev && curr > next && Math.abs(curr - prev) > 3) {
        nodCount++
      }
    }
    
    // Normalize to 0-100 (healthy nodding is 5-15 per minute)
    const nodsPer100Frames = (nodCount / frames.length) * 100
    return Math.min(100, nodsPer100Frames * 10)
  }
  
  private standardDeviation(values: number[]): number {
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length
    const variance = values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length
    return Math.sqrt(variance)
  }
  
  private getDefaultMetrics(): RealVideoMetrics {
    return {
      eyeContactScore: 0,
      gazeDirection: 'away',
      gazeStability: 0,
      blinkRate: 0,
      smileFrequency: 0,
      expressionVariety: 0,
      nervousnessIndicators: 0,
      confidenceScore: 0,
      headPoseStability: 0,
      nodFrequency: 0,
      headTiltAngle: 0,
      postureLean: 'neutral',
      cameraPresence: 0,
      professionalism: 0,
      engagement: 0,
      framesAnalyzed: 0,
      analysisQuality: 'poor',
    }
  }
  
  reset() {
    this.frameHistory = []
    this.blinkCount = 0
    this.lastBlinkTime = 0
    this.analysisStartTime = Date.now()
  }
  
  isInitialized(): boolean {
    return this.initialized
  }
}

// Singleton instance
let analyzerInstance: RealVideoAnalyzer | null = null

export function getRealVideoAnalyzer(): RealVideoAnalyzer {
  if (!analyzerInstance) {
    analyzerInstance = new RealVideoAnalyzer()
  }
  return analyzerInstance
}
