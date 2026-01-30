# AI²SARS — Professional PlantUML Use Case Diagrams
## University-standard, presentation-ready use case diagrams (curated & concise)

---

## DIAGRAM 1: CANDIDATE/USER USE CASES

```plantuml
@startuml Candidate_Use_Cases
!define AWSPUML https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist

actor "Candidate/User" as User
actor "System" as Sys

package "User Management" {
    usecase "Register Account" as UC1
    usecase "Login" as UC2
    usecase "Logout" as UC3
    usecase "Reset Password" as UC4
    usecase "Update Profile" as UC5
}

package "Resume Management" {
    usecase "Upload Resume" as UC6
    usecase "Create Resume" as UC7
    usecase "View Resume History" as UC8
    usecase "Download Resume" as UC9
    usecase "Delete Resume" as UC10
}

package "Interview Simulation" {
    usecase "Start Interview" as UC11
    usecase "Answer Questions" as UC12
    usecase "Enable Camera/Mic" as UC13
    usecase "Submit Interview" as UC14
    usecase "View Interview Report" as UC15
    usecase "Download Report (PDF)" as UC16
}

package "ATS Analysis" {
    usecase "Analyze Resume (ATS)" as UC17
    usecase "View ATS Score" as UC18
    usecase "Get Optimization Tips" as UC19
}

package "Dashboard" {
    usecase "View Interviews" as UC20
    usecase "View Reports" as UC21
    usecase "Access Analytics" as UC22
}

User --> UC1
User --> UC2
User --> UC3
User --> UC4
User --> UC5
User --> UC6
User --> UC7
User --> UC8
User --> UC9
User --> UC10
User --> UC11
User --> UC12
User --> UC13
User --> UC14
User --> UC15
User --> UC16
User --> UC17
User --> UC18
User --> UC19
User --> UC20
User --> UC21
User --> UC22

UC1 ..> Sys: Email Verification
UC4 ..> Sys: Send Reset Link
UC6 ..> Sys: Upload to S3
UC7 ..> Sys: Generate Template
UC11 ..> Sys: Create Session
UC12 ..> Sys: Evaluate Answer
UC14 ..> Sys: Generate Report
UC17 ..> Sys: ATS Scoring

@enduml
```

---

## DIAGRAM 2: ADMIN USE CASES

```plantuml
@startuml Admin_Use_Cases

actor "Admin" as Admin
actor "System" as AdminSys

package "User Management" {
    usecase "View All Users" as AC1
    usecase "View User Details" as AC2
    usecase "Delete User Account" as AC3
    usecase "Reset User Password" as AC4
    usecase "Assign Roles" as AC5
}

package "Content Management" {
    usecase "View All Resumes" as AC6
    usecase "View All Interviews" as AC7
    usecase "View All Reports" as AC8
    usecase "View All Videos" as AC9
    usecase "Delete Content" as AC10
}

package "Data Export" {
    usecase "Export Users (JSON)" as AC11
    usecase "Export Users (CSV)" as AC12
    usecase "Export Interviews Data" as AC13
    usecase "Export Reports Data" as AC14
}

package "System Monitoring" {
    usecase "View System Logs" as AC15
    usecase "Monitor Performance" as AC16
    usecase "View Error Logs" as AC17
    usecase "Access Audit Trail" as AC18
}

package "Configuration" {
    usecase "Update System Settings" as AC19
    usecase "Manage AI Agent Config" as AC20
    usecase "Set Rate Limits" as AC21
}

Admin --> AC1
Admin --> AC2
Admin --> AC3
Admin --> AC4
Admin --> AC5
Admin --> AC6
Admin --> AC7
Admin --> AC8
Admin --> AC9
Admin --> AC10
Admin --> AC11
Admin --> AC12
Admin --> AC13
Admin --> AC14
Admin --> AC15
Admin --> AC16
Admin --> AC17
Admin --> AC18
Admin --> AC19
Admin --> AC20
Admin --> AC21

AC1 ..> AdminSys: Query Database
AC2 ..> AdminSys: Fetch Details
AC3 ..> AdminSys: Delete Records
AC6 ..> AdminSys: Retrieve Resumes
AC11 ..> AdminSys: Export JSON
AC12 ..> AdminSys: Export CSV
AC15 ..> AdminSys: Query Logs

@enduml
```

---

## DIAGRAM 3: AI AGENT - INTERVIEW SYSTEM USE CASES

```plantuml
@startuml Interview_Agent_Use_Cases
skinparam backgroundColor #FEFEFE
skinparam actor {
    BackgroundColor #FFCCBC
    BorderColor #D84315
}
skinparam usecase {
    BackgroundColor #E0F2F1
    BorderColor #00796B
}

actor "Candidate" as Cand
actor "Interview Agent\n(trainedInterviewAgent)" as Agent1
actor "System" as IntSys

package "Interview Session Management" {
    usecase "Initiate Interview" as IA1
    usecase "Extract Resume Data" as IA2
    usecase "Build Candidate Profile" as IA3
    usecase "Create Session State" as IA4
}

package "Question Generation" {
    usecase "Quantize State\n(87,846 states)" as IA5
    usecase "Look Up Q-Values" as IA6
    usecase "Apply ε-Greedy Policy\n(75% exploit, 25% explore)" as IA7
    usecase "Generate Question" as IA8
    usecase "Select Question Type\n(Technical, Behavioral, etc)" as IA9
}

package "Answer Evaluation" {
    usecase "Receive Answer" as IA10
    usecase "Analyze Audio/Video" as IA11
    usecase "Score Answer\n(6 dimensions)" as IA12
    usecase "Update Candidate Profile" as IA13
    usecase "Store Transcript" as IA14
}

package "Adaptive Learning" {
    usecase "Adjust Difficulty" as IA15
    usecase "Select Next Topic" as IA16
    usecase "Avoid Repetition" as IA17
    usecase "Generate Follow-up" as IA18
}

package "Interview Completion" {
    usecase "Calculate Final Scores" as IA19
    usecase "Generate Report" as IA20
    usecase "Store Interview Data" as IA21
}

Cand --> IA1
Agent1 --> IA2
Agent1 --> IA3
Agent1 --> IA4
Agent1 --> IA5
Agent1 --> IA6
Agent1 --> IA7
Agent1 --> IA8
Agent1 --> IA9
Cand --> IA10
Agent1 --> IA11
Agent1 --> IA12
Agent1 --> IA13
Agent1 --> IA14
Agent1 --> IA15
Agent1 --> IA16
Agent1 --> IA17
Agent1 --> IA18
Agent1 --> IA19
Agent1 --> IA20
IntSys --> IA21

IA1 ..> IA2: Extract
IA2 ..> IA3: Build Profile
IA3 ..> IA4: Create State
IA4 ..> IA5: Start Q-Learning
IA5 ..> IA6: State Lookup
IA6 ..> IA7: Apply Policy
IA7 ..> IA8: Generate
IA8 ..> IA9: Select Type
IA10 ..> IA11: Analyze
IA11 ..> IA12: Score
IA12 ..> IA13: Update
IA13 ..> IA15: Adapt
IA15 ..> IA16: Next Topic
IA19 ..> IA20: Report
IA20 ..> IA21: Store

@enduml
```

---

## DIAGRAM 4: AI AGENTS - ATS SYSTEM USE CASES (3 AGENTS)

```plantuml
@startuml ATS_Agents_Use_Cases
skinparam backgroundColor #FEFEFE
skinparam actor {
    BackgroundColor #F8BBD0
    BorderColor #C2185B
}
skinparam usecase {
    BackgroundColor #FCE4EC
    BorderColor #880E4F
}

actor "Resume" as Resume
actor "Agent 1: customATSAgent\n(NLP Analyzer)" as AtsAgent1
actor "Agent 2: AIAgentEngine\n(rlATSAgent - Q-Learning)" as AtsAgent2
actor "Agent 3: IntelligentATSAgent\n(Neural Network)" as AtsAgent3
actor "System" as AtsSys

package "Agent 1: Resume Analysis" {
    usecase "Extract Text" as AA1
    usecase "Parse Sections" as AA2
    usecase "Extract Skills\n(1000+ terms)" as AA3
    usecase "Calculate Experience" as AA4
    usecase "Assess Education" as AA5
    usecase "Evaluate Communication" as AA6
    usecase "Build 6D Feature Vector" as AA7
}

package "Agent 2: Q-Learning Decision" {
    usecase "Quantize Features\n(1.7M states)" as AA8
    usecase "Look Up Q-Table" as AA9
    usecase "Compute Action Scores" as AA10
    usecase "Select Decision\n(HIRE/REJECT/CONSIDER)" as AA11
    usecase "Calculate Confidence" as AA12
}

package "Agent 3: Neural Network Validation" {
    usecase "Forward Pass" as AA13
    usecase "Validate Decision" as AA14
    usecase "Generate Reasoning" as AA15
    usecase "Store Learning" as AA16
}

package "ATS Output" {
    usecase "Create ATS Report" as AA17
    usecase "Generate Score" as AA18
    usecase "Provide Feedback" as AA19
}

Resume --> AA1
AtsAgent1 --> AA1
AtsAgent1 --> AA2
AtsAgent1 --> AA3
AtsAgent1 --> AA4
AtsAgent1 --> AA5
AtsAgent1 --> AA6
AtsAgent1 --> AA7
AtsAgent2 --> AA8
AtsAgent2 --> AA9
AtsAgent2 --> AA10
AtsAgent2 --> AA11
AtsAgent2 --> AA12
AtsAgent3 --> AA13
AtsAgent3 --> AA14
AtsAgent3 --> AA15
AtsAgent3 --> AA16
AtsSys --> AA17
AtsSys --> AA18
AtsSys --> AA19

AA1 ..> AA2: Parse
AA2 ..> AA3: Extract Skills
AA3 ..> AA4: Quantify
AA4 ..> AA5: Evaluate
AA5 ..> AA6: Assess
AA6 ..> AA7: Feature Vector
AA7 ..> AA8: To Agent 2
AA8 ..> AA9: Q-Lookup
AA9 ..> AA10: Score Actions
AA10 ..> AA11: Decide
AA11 ..> AA12: Confidence
AA12 ..> AA13: To Agent 3
AA13 ..> AA14: Validate
AA14 ..> AA15: Reasoning
AA15 ..> AA16: Learn
AA16 ..> AA17: Report
AA17 ..> AA18: Score
AA18 ..> AA19: Feedback

@enduml
```

---

## DIAGRAM 5: SYSTEM INTEGRATION USE CASES

```plantuml
@startuml System_Integration_Use_Cases
skinparam backgroundColor #FEFEFE
skinparam actor {
    BackgroundColor #B3E5FC
    BorderColor #0277BD
}
skinparam usecase {
    BackgroundColor #E8F5E9
    BorderColor #1B5E20
}

actor "User/Admin" as UA
actor "Frontend\n(React 19)" as Frontend
actor "API Layer\n(Next.js 16)" as API
actor "Business Logic\nLayer" as BL
actor "Database\n(PostgreSQL)" as DB
actor "Storage\n(AWS S3)" as S3
actor "Email Service\n(SMTP)" as Email
actor "Background Worker\n(BullMQ)" as Worker

package "Authentication Flow" {
    usecase "Login Request" as SYS1
    usecase "Validate Credentials" as SYS2
    usecase "Generate JWT" as SYS3
    usecase "Set Secure Cookie" as SYS4
}

package "Resume Processing" {
    usecase "Upload Resume" as SYS5
    usecase "Validate File" as SYS6
    usecase "Upload to S3" as SYS7
    usecase "Store Metadata" as SYS8
    usecase "Create Version" as SYS9
}

package "Interview Processing" {
    usecase "Start Session" as SYS10
    usecase "Stream Video" as SYS11
    usecase "Process Answers" as SYS12
    usecase "Generate Report" as SYS13
}

package "Data Management" {
    usecase "Persist Data" as SYS14
    usecase "Query Data" as SYS15
    usecase "Manage Versions" as SYS16
    usecase "Export Data" as SYS17
}

package "Security & Monitoring" {
    usecase "Rate Limiting" as SYS18
    usecase "Input Validation" as SYS19
    usecase "Audit Logging" as SYS20
    usecase "Error Handling" as SYS21
}

UA --> SYS1
Frontend --> SYS1
Frontend --> SYS5
Frontend --> SYS10
API --> SYS2
API --> SYS6
API --> SYS12
API --> SYS15
API --> SYS18
BL --> SYS3
BL --> SYS13
BL --> SYS14
DB --> SYS8
DB --> SYS14
DB --> SYS15
S3 --> SYS7
Worker --> SYS12
Worker --> SYS13
Email --> SYS4

SYS1 ..> SYS2: Validate
SYS2 ..> SYS3: Generate
SYS3 ..> SYS4: Secure
SYS5 ..> SYS6: Check
SYS6 ..> SYS7: Upload
SYS7 ..> SYS8: Store
SYS8 ..> SYS9: Version
SYS10 ..> SYS11: Video
SYS11 ..> SYS12: Process
SYS12 ..> SYS13: Report
SYS14 ..> SYS15: Persist

@enduml
```

---

## DIAGRAM 6: COMPLETE SYSTEM ECOSYSTEM

```plantuml
@startuml System_Ecosystem
skinparam backgroundColor #FEFEFE
skinparam actor {
    BackgroundColor #E1BEE7
    BorderColor #6A1B9A
}
skinparam usecase {
    BackgroundColor #F1F8E9
    BorderColor #33691E
}

actor "Candidate\n(User)" as Candidate
actor "Admin\nRecruiter" as Admin
actor "External\nSystems" as External

package "Frontend Application" {
    usecase "Interview\nInterface" as ECO1
    usecase "Resume\nBuilder" as ECO2
    usecase "ATS\nAnalyzer" as ECO3
    usecase "Dashboard\n& Reports" as ECO4
    usecase "Admin\nPanel" as ECO5
}

package "Core Agents" {
    usecase "Interview Agent\n(87,846 states)" as ECO6
    usecase "Resume Agent\n(NLP)" as ECO7
    usecase "RL Agent\n(1.7M states)" as ECO8
    usecase "Neural Agent\n(Learning)" as ECO9
}

package "Infrastructure" {
    usecase "API Routes\n(20+ endpoints)" as ECO10
    usecase "Database\n(11 models)" as ECO11
    usecase "File Storage\n(S3)" as ECO12
    usecase "Background\nJobs (BullMQ)" as ECO13
}

package "Security & Features" {
    usecase "Authentication\n& Authorization" as ECO14
    usecase "Rate Limiting\n& CSRF" as ECO15
    usecase "Audit Logging\n& Monitoring" as ECO16
    usecase "Email\nNotifications" as ECO17
}

Candidate --> ECO1
Candidate --> ECO2
Candidate --> ECO3
Candidate --> ECO4
Admin --> ECO5
Admin --> ECO4

ECO1 --> ECO6
ECO2 --> ECO7
ECO3 --> ECO7
ECO3 --> ECO8
ECO3 --> ECO9
ECO6 --> ECO10
ECO7 --> ECO10
ECO8 --> ECO10
ECO9 --> ECO10

ECO10 --> ECO11
ECO10 --> ECO12
ECO10 --> ECO13
ECO10 --> ECO14
ECO10 --> ECO15
ECO10 --> ECO16
ECO10 --> ECO17

External --> ECO12
External --> ECO16

@enduml
```

---

## DIAGRAM 7: DATA FLOW - COMPLETE JOURNEY

```plantuml
@startuml Data_Flow_Journey
skinparam backgroundColor #FEFEFE
skinparam actor {
    BackgroundColor #FFE0B2
    BorderColor #E65100
}
skinparam usecase {
    BackgroundColor #FCCDD7
    BorderColor #880E4F
}

actor "Candidate Starts" as Start

package "Resume Upload Phase" {
    usecase "1. Upload Resume\n(PDF/DOCX)" as DF1
    usecase "2. Parse & Extract\n(NLP Processing)" as DF2
    usecase "3. Generate Features\n(6 Dimensions)" as DF3
    usecase "4. Calculate ATS Score\n(3 Agents)" as DF4
    usecase "5. Store in S3\n& Database" as DF5
}

package "Interview Phase" {
    usecase "6. Start Interview\nSession" as DF6
    usecase "7. Generate Questions\n(trainedInterviewAgent)" as DF7
    usecase "8. Record Answer\n(Video/Audio)" as DF8
    usecase "9. Evaluate Answer\n(Multi-modal)" as DF9
    usecase "10. Update Profile\n& Generate Next Q" as DF10
}

package "Reporting Phase" {
    usecase "11. Complete Interview\nSession" as DF11
    usecase "12. Calculate Scores\n(All dimensions)" as DF12
    usecase "13. Generate Report\n(PDF + JSON)" as DF13
    usecase "14. Store Results\n& Artifacts" as DF14
}

package "Follow-up Phase" {
    usecase "15. Send Notifications\n(Email)" as DF15
    usecase "16. User Reviews\nReport" as DF16
    usecase "17. Admin Reviews\nCandidate" as DF17
    usecase "18. Make Hiring\nDecision" as DF18
}

Start --> DF1
DF1 --> DF2
DF2 --> DF3
DF3 --> DF4
DF4 --> DF5
DF5 --> DF6
DF6 --> DF7
DF7 --> DF8
DF8 --> DF9
DF9 --> DF10
DF10 --> DF7: Next Question
DF10 --> DF11: Session End
DF11 --> DF12
DF12 --> DF13
DF13 --> DF14
DF14 --> DF15
DF15 --> DF16
DF16 --> DF17
DF17 --> DF18

@enduml
```

---

## HOW TO USE THESE DIAGRAMS

1. **Copy any PlantUML code above**
2. **Go to**: https://www.plantuml.com/plantuml/uml/
3. **Paste the code** in the editor
4. **Click Generate** to see the diagram
5. **Export as PNG/SVG** for presentation

### For Best Results:

**In PowerPoint:**
- Diagram 1, 2, 6, 7 → Full slides (high detail)
- Diagram 3, 4, 5 → Can be split into 2 slides each if needed

**Recommended Slide Order:**
1. System Ecosystem (Diagram 6) - Overview
2. Data Flow Journey (Diagram 7) - Complete flow
3. Candidate Use Cases (Diagram 1) - User perspective
4. Admin Use Cases (Diagram 2) - Admin perspective
5. Interview Agent (Diagram 3) - AI deep dive
6. ATS Agents (Diagram 4) - AI deep dive
7. System Integration (Diagram 5) - Technical architecture

---

## PowerPoint export tips

- Quick PlantUML snippet to make diagrams slide-friendly (add immediately after `@startuml`):

```text
scale 0.8
skinparam wrapWidth 60
skinparam dpi 150
skinparam defaultFontSize 12
```

- Recommended workflow:
    1. Copy a single diagram block into the PlantUML web editor or into a `.puml` file.
    2. Insert the four lines above right after `@startuml`.
    3. Export as **SVG** (preferred) or **PNG**; SVG scales crisply in PowerPoint.

- Local CLI export example (requires plantuml.jar):

```bash
java -jar plantuml.jar -tsvg diagram.puml
```

- If a diagram is still too dense for one slide, I can split it into 2–3 focused diagrams optimized for slides.


**All diagrams include:**
✅ Complete system coverage
✅ All 4 AI agents
✅ All data flows
✅ All user journeys
✅ Security & infrastructure
✅ Database & storage interactions
✅ Background processing
✅ Admin operations

