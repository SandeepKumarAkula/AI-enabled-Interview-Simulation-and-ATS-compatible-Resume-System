# AI²SARS — Professional PlantUML Sequence Diagrams
## University-standard, presentation-ready sequence diagrams (curated & concise)

---

## SEQUENCE DIAGRAM 1: USER AUTHENTICATION FLOW

```plantuml
@startuml Authentication_Sequence
!theme plain
participant User
participant "Frontend\n(React)" as FE
participant "API Layer\n(Next.js)" as API
participant "Auth Service" as Auth
participant "Database\n(PostgreSQL)" as DB
participant "Email Service\n(SMTP)" as Email

autonumber
User -> FE: 1. Click "Register"
FE -> FE: 2. Validate Input\n(email, password)
FE -> API: 3. POST /auth/register\n{email, password}

API -> Auth: 4. hashPassword()\nbcrypt(100k iterations)
Auth -> DB: 5. Check Email Exists
DB --> Auth: 6. Not Found ✓

Auth -> DB: 7. CREATE User\n{email, hashedPwd, role}
DB --> Auth: 8. User Created\n{id, email, role}

Auth -> Email: 9. Send Verification Email
Email --> User: 10. Verification Link

User -> FE: 11. Click Verification Link
FE -> API: 12. GET /auth/verify\n{token}

API -> Auth: 13. verifyToken()
Auth -> DB: 14. UPDATE User\n{verified: true}
DB --> Auth: 15. Updated ✓

Auth --> API: 16. OK
API --> FE: 17. Redirect to Login
FE --> User: 18. Registration Complete ✓

note over User,Email: Security — TLS, secure hashing, and time-limited tokens end note

@enduml
```

---

## SEQUENCE DIAGRAM 2: LOGIN & SESSION CREATION

```plantuml
@startuml Login_Session_Sequence
!theme plain
participant User
participant "Frontend\n(React)" as FE
participant "API Layer\n(Next.js)" as API
participant "Auth Service" as Auth
participant "Database" as DB

autonumber
User -> FE: 1. Enter Credentials\n(email, password)
FE -> FE: 2. Validate Email Format
FE -> API: 3. POST /auth/login\n{email, password}

API -> Auth: 4. Retrieve User\nfrom DB
Auth -> DB: 5. SELECT User\nWHERE email = ?
DB --> Auth: 6. User Found\n{id, hashedPwd, role}

Auth -> Auth: 7. comparePassword()\ninput vs stored

alt Password Match
    Auth -> Auth: 8. generateJWT()\n{userId, role, exp: 30d}
    Auth -> DB: 9. CREATE Session\n{userId, token, expiresAt}
    DB --> Auth: 10. Session Created
    Auth --> API: 11. JWT + SessionID
    API --> FE: 12. Set HttpOnly Cookie\n{secure, sameSite}
    FE -> FE: 13. Store JWT in Memory
    FE --> User: 14. ✅ Login Successful\nRedirect Dashboard
else Password Mismatch
    Auth -> Auth: 8. Log Failed Attempt
    Auth --> API: 9. 401 Unauthorized
    API --> FE: 10. Show Error
    FE --> User: 11. ❌ Invalid Credentials
end

note over API,DB: Session management — JWT + secure HttpOnly cookie, rate limiting end note

@enduml
```

---

## SEQUENCE DIAGRAM 3: RESUME UPLOAD & S3 STORAGE

```plantuml
@startuml Resume_Upload_Sequence
!theme plain
participant User
participant "Frontend\n(React)" as FE
participant "API Layer" as API
participant "Business Logic" as BL
participant "S3 Service" as S3
participant "Database" as DB

autonumber
User -> FE: 1. Upload Resume\n(PDF/DOCX file)
FE -> FE: 2. Validate File\n(type, size < 10MB)

FE -> API: 3. POST /api/resumes/upload\n{userId, fileName}
API -> BL: 4. requestS3Upload()

BL -> S3: 5. generatePresignedURL()\n{bucket, key, ttl: 15min}
S3 --> BL: 6. Presigned URL\n(upload endpoint)

BL --> API: 7. Return URL
API --> FE: 8. Send URL to Client

FE -> S3: 9. PUT /presigned-url\n{file bytes}
S3 --> FE: 10. 200 OK\nFile Stored

FE -> API: 11. POST /api/resumes/finalize\n{fileKey, s3Url}

API -> BL: 12. parseResume()\n(extract text, structure)
BL -> BL: 13. NLP Processing\n(skills, experience, gaps)
BL -> BL: 14. generateFeatures()\n(6 dimensions)

API -> DB: 15. CREATE Resume\n{userId, s3Url, fileKey}
DB --> API: 16. resumeId, metadata

API -> DB: 17. CREATE ResumeVersion\n{resumeId, v1}
DB --> API: 18. versionId

API --> FE: 19. ✅ Success\n{resumeId, score}
FE --> User: 20. Resume Uploaded\nAnalyzing...

@enduml
```

---

## SEQUENCE DIAGRAM 4: INTERVIEW SESSION - QUESTION GENERATION

```plantuml
@startuml Interview_Question_Generation
!theme plain
participant Candidate
participant "Frontend\n(React)" as FE
participant "API Layer" as API
participant "Interview Agent\n(trainedInterviewAgent)" as Agent
participant "Database" as DB

autonumber
Candidate -> FE: 1. Start Interview
FE -> FE: 2. Enable Camera/Mic\nRequest Permissions

FE -> API: 3. POST /api/ai-interview\n{action: "start-session",\nrole, experienceLevel}

API -> API: 4. extractResumeInsights()\nfrom candidate resume

API -> API: 5. buildCandidateProfile()

API -> Agent: 6. quantizeState()

Agent -> Agent: 7. computeStateKey()



Agent -> Agent: 8. Select next question using trained policy

Agent -> Agent: 12. Filter Question Pool\n{role="software",\ntype="technical",\ndifficulty="intro",\navoided_topics=[]}

Agent -> Agent: 13. Return Question:\n{id, prompt, type,\ndifficulty, focuses}

Agent --> API: 14. Question Object

API -> DB: 15. CREATE Session\n{candidateId, role,\nquestionQueue, state}

API --> FE: 16. Return Question\n{prompt, difficulty}

FE -> FE: 17. Render Question UI\nStart Recording

FE --> Candidate: 18. "What is the difference\nbetween async/await\nand promises?"

note over Agent,DB: Agent state quantization (Q-Learning) — high-level overview only end note

@enduml
```

---

## SEQUENCE DIAGRAM 5: INTERVIEW SESSION - ANSWER EVALUATION

```plantuml
@startuml Interview_Answer_Evaluation
!theme plain
participant Candidate
participant "Frontend\n(React)" as FE
participant "API Layer" as API
participant "AI Evaluator" as Eval
participant "Video Analysis" as Video
participant "Database" as DB

autonumber
Candidate -> FE: 1. Record Answer\n(video + audio)
FE -> FE: 2. Capture Video\nCapture Audio\nExtract Text (STT)

Candidate -> FE: 3. Click "Submit Answer"
FE -> FE: 4. Stop Recording\nCompress Video

FE -> API: 5. POST /api/ai-interview/submit\n{sessionId, answer,\nvideo_blob, transcript}

API -> Video: 6. Analyze Video\n(MediaPipe)\nFace detection, expressions

Video --> API: 7. {confidence: 0.8,\nengagement: 0.7,\nbodyLanguage: 0.75}

API -> Video: 8. Transcribe Audio\n(HuggingFace)

Video --> API: 9. {transcript,\nsentiment, clarity}

API -> Eval: 10. scoreAnswer()\n{question, answer,\nvideo_analysis, audio_analysis}

Eval -> Eval: 11. Evaluate 6 Dimensions:\n- Clarity: 8/10\n- Technical Depth: 7/10\n- Problem Solving: 8/10\n- Communication: 7/10\n- Confidence: 8/10\n- Body Language: 7/10

Eval -> Eval: 12. Calculate Score\naverage = (8+7+8+7+8+7)/6 = 7.5

Eval -> API: 13. Return Score Card\n{scores, transcript, video_url}

API -> DB: 14. UPDATE candidateProfile:\n- technicalScore: 68 → 72\n- communicationScore: 45 → 52\n- confidenceScore: 50 → 58

API -> Agent: 15. Update Q-Learning State\nnew_state = quantize(updatedProfile)
Agent -> Agent: 16. Q-Update:\nQ(old_state, action) ←\nQ(old_state, action) +\nα[reward + γ*max(Q(new_state))]

Agent --> API: 17. Next Question Ready

API -> DB: 18. APPEND Transcript\n{questionId, answer, scores,\ntimestamp}

API --> FE: 19. Return Next Question\n+ Scores

FE -> FE: 20. Display Feedback\nShow Scores

FE --> Candidate: 21. Next Question:\n"Tell me about a time\nyou handled..."

note over Eval,DB: Multi-modal evaluation (video, audio, text) — consolidated scoring end note

@enduml
```

---

## SEQUENCE DIAGRAM 6: ATS ANALYSIS - 3 AGENTS COLLABORATION

```plantuml
@startuml ATS_Three_Agents_Sequence
!theme plain
participant Admin
participant "Frontend\n(React)" as FE
participant "API Layer" as API
participant "Agent 1:\ncustomATSAgent\n(Resume NLP)" as Agent1
participant "Agent 2:\nAIAgentEngine\n(rlATSAgent)" as Agent2
participant "Agent 3:\nIntelligentATSAgent\n(Neural Network)" as Agent3
participant "Database" as DB

autonumber
Admin -> FE: 1. Submit Resume\nfor ATS Analysis

FE -> API: 2. POST /api/ats-analysis\n{resumeId, jobDescription}

API -> DB: 3. Fetch Resume\nContent

DB --> API: 4. Resume Text\n(parsed PDF/DOCX)

API -> Agent1: 5. analyze(resumeText)\n→ Extract Features

Agent1 -> Agent1: 6. Parse Resume:\n- Extract Skills: [Java, Python, SQL,\n  React, AWS, Docker, ...]\n- Experience: 5 years\n- Education: BS Computer Science\n- Communication Assessment\n- Culture Fit Analysis

Agent1 -> Agent1: 7. Generate 6D Vector:\n{technical: 8,\nexperience: 5,\neducation: 5,\ncommunication: 7,\nleadership: 6,\ncultureFit: 8}

Agent1 --> API: 8. Feature Vector

API -> Agent2: 9. makeDecision(featureVector)\n→ Q-Learning Decision

Agent2 -> Agent2: 10. Quantize Features\nto 1.7M state space

Agent2 -> Agent2: 11. Look Up Q-Values\nin Q-Table

Agent2 -> Agent2: 12. Compute Action Scores:\n- HIRE: 0.78\n- CONSIDER: 0.18\n- REJECT: 0.04

Agent2 -> Agent2: 13. Select Best Action\n(argmax) = HIRE\nwith confidence: 0.78

Agent2 -> Agent2: 14. Generate Reasoning:\n"Strong technical skills,\ngood experience level,\nmatches job requirements"

Agent2 --> API: 15. Decision:\n{action: HIRE,\nconfidence: 0.78,\nreasoning: "..."}

API -> Agent3: 16. validate(featureVector,\nagent2Decision)\n→ Neural Network Validation

Agent3 -> Agent3: 17. Forward Pass:\nInput Layer (6 dims)\n  ↓\nHidden Layer 1 (16 neurons)\n  ↓\nHidden Layer 2 (8 neurons)\n  ↓\nOutput Layer (3: HIRE/REJECT/CONSIDER)

Agent3 -> Agent3: 18. Output:\nHIRE: 0.82\nREJECT: 0.12\nCONSIDER: 0.06

Agent3 -> Agent3: 19. Confidence Validation\n(Agent2: 0.78, Agent3: 0.82)\nAverage: 0.80 ✓ High confidence

Agent3 -> Agent3: 20. Generate Explainable\nReasoning:\n"Neural network confirms\nQ-Learning decision.\nTop matching factors:\n1. Technical skills\n2. Experience alignment\n3. Culture fit"

Agent3 --> API: 21. Validation:\n{decision: HIRE,\nconfidence: 0.80,\nexplanation: "..."}

API -> DB: 22. CREATE ATSAnalysis:\n{resumeId, agent1Features,\nagent2Decision,\nagent3Validation,\nfinalDecision: HIRE,\nfinalConfidence: 0.80}

DB --> API: 23. atsAnalysisId

API -> DB: 24. CREATE Report:\n{atsAnalysisId,\ncandidate_assessment,\nstrengths,\nareas_to_improve}

DB --> API: 25. reportId

API --> FE: 26. Return Full ATS Report:\n{decision, confidence,\nagent_scores, reasoning}

FE --> Admin: 27. Display Report:\n✅ HIRE (80% confidence)\nReasons & Detailed Analysis

note over Agent1,Agent3: 3-agent ATS ensemble (NLP, RL, NN) — produces final decision end note

@enduml
```

---

## SEQUENCE DIAGRAM 7: BACKGROUND JOB - VIDEO PROCESSING

```plantuml
@startuml Background_Job_Processing
!theme plain
participant "Interview Session\n(Frontend)" as Session
participant "API Layer\n(Next.js)" as API
participant "Job Queue\n(BullMQ + Redis)" as Queue
participant "Background Worker" as Worker
participant "Video Processing\nService" as VideoProc
participant "Database" as DB
participant "Email Service" as Email

autonumber
Session -> API: 1. Interview Completed\nPOST /api/interviews/complete\n{interviewId, videoFile}

API -> API: 2. Validate Session\nCheck Permissions

API -> Queue: 3. enqueue Job\n{type: 'process_interview',\ninterviewId, videoUrl}

Queue --> API: 4. Job Queued\nJobId: job_12345

API -> DB: 5. UPDATE Interview\n{status: 'processing'}

API --> Session: 6. 200 OK\n"Processing started,\nyou'll receive email\nwhen complete"

par Background Processing
    Queue -> Worker: 7. Pick Job from Queue\njob_12345
    
    Worker -> Worker: 8. Extract Video Frames\n@ 1 fps
    
    Worker -> VideoProc: 9. Analyze Video\n(engagement, expression,\nbody language)
    
    VideoProc -> VideoProc: 10. MediaPipe:\n- Detect face landmarks\n- Calculate confidence scores\n- Assess facial expressions\n- Evaluate body language
    
    VideoProc --> Worker: 11. Return Analysis\n{engagement: 0.78,\nconfidence: 0.82,\nBodyLanguage: 0.75}
    
    Worker -> Worker: 12. Generate Video\nThumbnail for Preview
    
    Worker -> Worker: 13. Compress Video\n(H.264, 720p)\n
    Worker -> DB: 14. CREATE Video Record\n{interviewId,\noriginal_url,\ncompressed_url,\nthumbnail_url,\nanalysis_data}
    
    Worker -> Worker: 15. Calculate Report Scores\nCombine all evaluations
    
    Worker -> DB: 16. UPDATE Report\n{interview_analysis,\nvideo_analysis,\nfinal_scores,\ngenerated_at}
    
    Worker -> DB: 17. UPDATE Interview\n{status: 'completed',\nreport_ready: true}
    
    Worker -> Email: 18. Send Email to Candidate\n"Your interview report\nis ready"\n+ Report URL
    
    Email --> Worker: 19. Email Sent ✓
    
    Worker -> Queue: 20. Mark Job Complete\n✅ Success
end

alt Job Success
    Queue -> Worker: 21. Remove from Queue
    Worker -> DB: 22. Log Job Success
else Job Failure (Retry)
    Queue -> Queue: 21. Retry Logic:\n(attempt < 3)\nwait exponential backoff
    Queue -> Worker: 22. Retry: Pick Job Again
end

par User Receives Notification
    Email --> Session: 23. Candidate Receives Email
    Session -> Session: 24. Click Email Link
    Session -> API: 25. GET /dashboard/interviews\n/{interviewId}
    API -> DB: 26. Fetch Report Data
    DB --> API: 27. Return Report
    API --> Session: 28. Display Report\n+ Video Preview
end

note over Queue,Email: Background job processing — async workers, retries, dead-letter handling, report generation end note

@enduml
```

---

## SEQUENCE DIAGRAM 8: ADMIN OPERATIONS - DATA EXPORT

```plantuml
@startuml Admin_Export_Sequence
!theme plain
participant Admin
participant "Admin Dashboard\n(React)" as AdminUI
participant "API Layer" as API
participant "Export Service" as Exporter
participant "Database" as DB
participant "File Storage\n(S3)" as S3
participant "Email Service" as Email

autonumber
Admin -> AdminUI: 1. Click "Export Users"\nData as CSV

AdminUI -> AdminUI: 2. Show Export Options:\n- Format: CSV/JSON\n- Date Range: All\n- Filters: (optional)

Admin -> AdminUI: 3. Select CSV Format\nClick Export

AdminUI -> API: 4. POST /api/admin/export\n{type: 'users',\nformat: 'csv',\nfilters: {...}}

API -> API: 5. Verify Admin Role\nCheck Permissions ✓

API -> DB: 6. Query Users\nSELECT * FROM users\nWHERE (filters)

DB --> API: 7. Return 2,543 User Records

API -> Exporter: 8. convertToCSV(users)\n→ Format Data

Exporter -> Exporter: 9. Build CSV:\nId,Email,Role,CreatedAt\n1,john@example.com,USER,2024-01-15\n2,jane@example.com,USER,2024-01-16\n3,admin@example.com,ADMIN,2024-01-01\n...(2543 rows)

Exporter -> Exporter: 10. Compress File\n(.zip)\nSize: 2.3 MB

Exporter --> API: 11. Return File Buffer

API -> S3: 12. generatePresignedURL()\n{bucket, key, ttl: 1hour}

S3 --> API: 13. Presigned Download URL

API -> DB: 14. LOG Export:\n{adminId, type, format,\nrecord_count, timestamp}

DB --> API: 15. Logged ✓

API --> AdminUI: 16. Return Download URL\n+ Metadata

AdminUI -> AdminUI: 17. Trigger Download\n(browser downloads file)

AdminUI --> Admin: 18. ✅ Download Started\nusers_export_20250128.csv.zip

alt Admin Wants Email
    Admin -> AdminUI: 19. Request Email Copy
    AdminUI -> API: 20. POST /api/admin/email-export\n{exportId}
    API -> Email: 21. Send Email\nwith S3 Download Link
    Email --> Admin: 22. Email Received\nwith Download Link
    Admin -> Email: 23. Click Link\nDownload File
end

note over AdminUI,Email: Admin export — secure presigned URLs, formats (CSV/JSON), audit logging end note

@enduml
```

---

## SEQUENCE DIAGRAM 9: ERROR HANDLING & RECOVERY

```plantuml
@startuml Error_Handling_Sequence
!theme plain
participant "Frontend\n(React)" as FE
participant "API Layer" as API
participant "Error Handler\nMiddleware" as ErrorH
participant "Logger Service" as Logger
participant "Database" as DB
participant "Admin\nAlert System" as Alert

autonumber
FE -> API: 1. Make API Request

API -> API: 2. Process Request

alt Normal Success
    API --> FE: 3. 200 OK\nReturn Data
else Validation Error
    API -> ErrorH: 4. ValidationError\n("Invalid email format")
    ErrorH -> Logger: 5. Log Warning\n{timestamp, error, userId}
    ErrorH --> API: 6. 400 Bad Request
    API --> FE: 7. {error: "Invalid email",\ncode: "VALIDATION_ERROR"}
    FE -> FE: 8. Display Error\nto User
    FE --> FE: 9. User Sees:\n"Please enter valid email"
else Authentication Error
    API -> ErrorH: 10. AuthenticationError\n("JWT Expired")
    ErrorH -> Logger: 11. Log Auth Failure\n{userId, timestamp}
    ErrorH --> API: 12. 401 Unauthorized
    API --> FE: 13. {error: "Session expired",\ncode: "AUTH_EXPIRED"}
    FE -> FE: 14. Clear Cookies\nRedirect to Login
    FE --> FE: 15. User Sees:\n"Please login again"
else Database Error
    API -> DB: 16. Query Request
    DB --> API: 17. ❌ Connection Pool Exhausted
    API -> ErrorH: 18. DatabaseError\n("Connection timeout")
    ErrorH -> Logger: 19. Log Critical\n{error, retry_attempt: 1}
    ErrorH -> Alert: 20. Send Admin Alert\n"Database connection issue"
    ErrorH -> ErrorH: 21. Retry Logic:\nWait 1 second\nRetry attempt 2
    ErrorH -> DB: 22. Retry Connection
    DB --> ErrorH: 23. ✓ Connection OK
    ErrorH --> API: 24. Query Success
    API --> FE: 25. 200 OK\nReturn Data
    FE --> FE: 26. Display to User
else Unhandled Error
    API -> ErrorH: 27. UnhandledError\n("Unexpected null reference")
    ErrorH -> Logger: 28. Log Error with Stack Trace
    ErrorH -> Alert: 29. Send CRITICAL Alert\n"Unhandled exception"
    ErrorH -> DB: 30. CREATE ErrorLog\n{timestamp, stack, env}
    ErrorH --> API: 31. 500 Internal Server Error
    API --> FE: 32. {error: "Internal error",\ncode: "SERVER_ERROR"}
    FE --> FE: 33. Display Generic Message\nto User
    FE --> FE: 34. User Sees:\n"Something went wrong.\nOur team is notified."
end

note over ErrorH,Alert: Error handling — validation, auth, DB. Log server-side; do not expose internals to clients end note

@enduml
```

---

## SEQUENCE DIAGRAM 10: COMPLETE INTERVIEW TO HIRING DECISION

```plantuml
@startuml Complete_Interview_to_Hiring
!theme plain
participant Candidate
participant "Frontend\n(React)" as FE
participant "API Layer" as API
participant "Interview Agent" as IntAgent
participant "ATS Agents" as ATSAgents
participant "Database" as DB
participant "Admin" as Admin
participant "Email" as Email

autonumber 1
Candidate -> FE: 1. Upload Resume\n& Start Interview

FE -> API: 2. POST /api/ai-interview/start
API -> IntAgent: 3. Generate Opening Question\n(87,846 states)
IntAgent --> API: 4. Question 1
API --> FE: 5. Display Question
FE --> Candidate: 6. "What is your experience..."

Candidate -> FE: 7. Record Answer\n(video + audio)

FE -> API: 8. POST /api/ai-interview/submit
API -> API: 9. Evaluate Answer\n(6 dimensions)
API -> IntAgent: 10. Update Profile\nGenerate Q2
IntAgent --> API: 11. Question 2
API --> FE: 12. Next Question

par Interview Session Loop
    Candidate -> Candidate: 13. Repeat Steps 6-12\nFor Questions 2-5
    note right of Candidate: Question sequence — Technical → Behavioral → Coding → Follow-up end note
end

Candidate -> FE: 14. Complete Interview
FE -> API: 15. POST /api/ai-interview/complete

API -> API: 16. Calculate Final Scores\n{technical: 72,\ncommunication: 58,\nconfidence: 65,\naverage: 65}

API -> DB: 17. Store Interview Record\n{interviewId, scores,\nvideo_urls, transcript}

API -> Email: 18. Send to Candidate:\n"Interview Complete.\nReport coming soon..."

API --> FE: 19. ✅ Interview Done

FE --> Candidate: 20. Show Summary\nWait for Report

par Background Processing
    API -> API: 21. Queue Job:\nprocess_interview
    API --> API: 22. Return Immediately
end

par Meanwhile: Admin Dashboard
    Admin -> FE: 23. Login to Admin\nGo to Interviews
    FE -> API: 24. GET /api/admin/interviews
    API -> DB: 25. Fetch Interview Data
    DB --> API: 26. Return Interviews
    API --> FE: 27. Display List
    FE --> Admin: 28. See Interview\n"John Doe - In Progress"
    Admin -> FE: 29. Click Interview
    FE -> API: 30. GET /api/interviews/{id}
    API -> DB: 31. Fetch Full Data
    DB --> API: 32. Return Data
    API --> FE: 33. Display Interview Details
    FE --> Admin: 34. See Scores, Video, etc.
end

par Background Job Complete
    API -> API: 35. Video Analysis Complete\n(via background worker)
    API -> DB: 36. UPDATE Interview:\nstatus: 'completed'
end

par ATS Analysis
    Admin -> FE: 37. Click "Analyze Resume"\n(or automatic trigger)
    FE -> API: 38. POST /api/ats-analysis\n{resumeId}
    
    API -> ATSAgents: 39. Run 3-Agent Analysis
    ATSAgents -> ATSAgents: 40. Agent 1: Extract Features
    ATSAgents -> ATSAgents: 41. Agent 2: Q-Learning Decision
    ATSAgents -> ATSAgents: 42. Agent 3: Validate & Learn
    ATSAgents --> API: 43. Decision: HIRE (80% confidence)
    
    API -> DB: 44. Store ATS Analysis\n{decision, confidence,\nreasoning}
    
    API --> FE: 45. Return ATS Report
    FE --> Admin: 46. Display Report:\n✅ HIRE (80%)\nReasons
end

par Making Final Decision
    Admin -> Admin: 47. Review:\n- Interview scores: 65%\n- ATS decision: HIRE (80%)\n- Video impression\n- Resume fit
    
    Admin -> FE: 48. Click "Make Offer"
    FE -> API: 49. POST /api/hiring/offer\n{interviewId,\ndecision: 'HIRE'}
    
    API -> DB: 50. UPDATE Interview:\n{hiring_decision: 'HIRE',\ndecided_at: timestamp,\ndecided_by: adminId}
    
    API -> Email: 51. Send Offer Email\nto Candidate
    Email --> Candidate: 52. "Congratulations!\nYou've been selected!"
    
    API -> Email: 53. Send Notification\nto All Admins
    Email --> Admin: 54. "New hire: John Doe"
end

Candidate -> Email: 55. Accept Offer\nvia Email Link

API -> DB: 56. UPDATE Candidate:\n{status: 'hired',\njoined_date: date}

API -> Email: 57. Send Welcome Email\nOnboarding Details

Email --> Candidate: 58. Welcome Package

note over Candidate,Email: Hiring journey — interview → processing → ATS analysis → decision → onboarding end note

@enduml
```

---

## HOW TO USE THESE SEQUENCE DIAGRAMS

1. **Copy any PlantUML code above**
2. **Go to**: https://www.plantuml.com/plantuml/uml/
3. **Paste the code** in the editor
4. **Click Generate** to see the diagram
5. **Export as PNG/SVG** for presentation

### Recommended Presentation Order:

1. **Complete Interview to Hiring** (Diagram 10) - Overview
2. **Login & Session** (Diagram 2) - Security foundation
3. **Resume Upload** (Diagram 3) - Data management
4. **Question Generation** (Diagram 4) - Interview Agent details
5. **Answer Evaluation** (Diagram 5) - Interview evaluation
6. **ATS 3-Agents** (Diagram 6) - ATS system deep dive
7. **Background Job** (Diagram 7) - Processing architecture
8. **Error Handling** (Diagram 9) - Reliability & robustness
9. **Admin Export** (Diagram 8) - Admin operations

### Key Features Highlighted:

✅ **All 4 AI Agents** (1 Interview + 3 ATS agents)
✅ **Complete workflows** (end-to-end processes)
✅ **Security measures** (JWT, HTTPS, rate limiting)
✅ **Multi-modal evaluation** (video + audio + text)
✅ **3-Agent collaboration** (ATS system)
✅ **Background processing** (async jobs)
✅ **Error handling** (retry logic, monitoring)
✅ **Database interactions** (all operations)
✅ **User notifications** (email, dashboard)
✅ **Admin operations** (monitoring, export)

