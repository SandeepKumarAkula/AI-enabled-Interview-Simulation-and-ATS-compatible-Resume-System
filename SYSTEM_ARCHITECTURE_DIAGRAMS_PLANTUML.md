# AI²SARS — Professional PlantUML System Architecture Diagrams
## University-standard, presentation-ready architecture diagrams (curated & concise)

---

## SYSTEM ARCHITECTURE DIAGRAM 1: HIGH-LEVEL 3-TIER ARCHITECTURE

```plantuml
@startuml High_Level_3Tier_Architecture
!theme plain

package "CLIENT TIER (Browser)" {
    component [React 19 SPA] as React
    component [TypeScript] as TS
    component [TailwindCSS] as Tailwind
    component [WebRTC] as WebRTC_Client
}

package "API/APPLICATION TIER (Next.js)" {
    component [Next.js 16] as NextJS
    component [API Routes] as APIRoutes
    component [Middleware] as Middleware
    component [Authentication] as Auth
    component [Business Logic] as Logic
}

package "AI/ML TIER" {
    component [trainedInterviewAgent] as InterviewAgent
    component [customATSAgent] as ATSAgent1
    component [AIAgentEngine\n(rlATSAgent)] as ATSAgent2
    component [IntelligentATSAgent] as ATSAgent3
}

package "BACKGROUND PROCESSING" {
    component [BullMQ Queue] as Queue
    component [Worker Threads] as Workers
    component [VideoProcessor] as VideoWorker
    component [ReportGenerator] as ReportWorker
}

package "DATA TIER (PostgreSQL)" {
    component [Primary DB] as PrimaryDB
    component [Replicas] as Replicas
    component [Prisma ORM] as Prisma
}

package "CACHING LAYER (Redis)" {
    component [Session Cache] as SessionCache
    component [Rate Limiter] as RateLimiter
    component [Job Queue Backend] as QueueBackend
}

package "STORAGE" {
    component [AWS S3 Bucket] as S3
    component [Resume Files] as Resumes
    component [Video Files] as Videos
    component [Reports/PDFs] as Reports
}

package "EXTERNAL SERVICES" {
    component [Email Service] as EmailService
    component [Video Analysis API] as VideoAPI
}

React --> NextJS
TS --> React
Tailwind --> React
WebRTC_Client --> NextJS

NextJS --> APIRoutes
APIRoutes --> Middleware
Middleware --> Auth
Auth --> Logic

Logic --> InterviewAgent
Logic --> ATSAgent1
Logic --> ATSAgent2
Logic --> ATSAgent3

Logic --> Queue
Queue --> QueueBackend
Queue --> Workers

Workers --> VideoWorker
Workers --> ReportWorker

Logic --> Prisma
Prisma --> PrimaryDB
PrimaryDB --> Replicas

Auth --> SessionCache
Logic --> RateLimiter

Logic --> S3
S3 --> Resumes
S3 --> Videos
S3 --> Reports

Logic --> EmailService
VideoWorker --> VideoAPI

note right of React: Frontend stack — React, TypeScript, Tailwind, WebRTC end note

note right of NextJS: Backend stack — Next.js, Node.js, server-side API layer end note

note right of InterviewAgent: AI ensemble — interview agent and three ATS agents (NLP, RL, NN) end note

note right of PrimaryDB: PostgreSQL (primary + replicas), managed via Prisma; core schema models and backups end note

@enduml
```

---

## SYSTEM ARCHITECTURE DIAGRAM 2: DETAILED COMPONENT ARCHITECTURE

```plantuml
@startuml Detailed_Component_Architecture
!theme plain
skinparam packageBackgroundColor #F3E5F5
skinparam packageBorderColor #512DA8
skinparam componentBackgroundColor #E1BEE7
skinparam componentBorderColor #4A148C
skinparam arrowColor #512DA8

package "PRESENTATION LAYER" {
    package "Pages" {
        component [auth/page] as AuthPage
        component [dashboard/page] as DashPage
        component [ai-interview/page] as InterviewPage
        component [ats/page] as ATSPage
        component [admin/page] as AdminPage
    }
    
    package "Components" {
        component [AIInterviewer] as AIIntComp
        component [ResumeBuilder] as ResBuilder
        component [ATSAnalyzer] as ATSAnalyzer
        component [AdminDashboard] as AdminDash
        component [Header/Footer] as NavComp
    }
    
    package "UI Library" {
        component [shadcn/ui] as ShadCN
        component [Custom Styles] as CustomStyle
    }
}

package "API LAYER" {
    package "Auth Routes" {
        component [/api/auth/register] as Register
        component [/api/auth/login] as Login
        component [/api/auth/logout] as Logout
    }
    
    package "Resume Routes" {
        component [/api/resume/upload] as Upload
        component [/api/resume/list] as ResumeList
        component [/api/resume/analyze] as ResumeAnalyze
    }
    
    package "Interview Routes" {
        component [/api/ai-interview/start] as IntStart
        component [/api/ai-interview/question] as GetQuestion
        component [/api/ai-interview/answer] as SubmitAnswer
    }
    
    package "ATS Routes" {
        component [/api/intelligent-agent] as ATSDecide
        component [/api/ats/analysis] as ATSAnalysis
    }
    
    package "Admin Routes" {
        component [/api/admin/users] as AdminUsers
        component [/api/admin/export] as AdminExport
    }
}

package "BUSINESS LOGIC LAYER" {
    package "Services" {
        component [AuthService] as AuthSvc
        component [ResumeService] as ResumeSvc
        component [InterviewService] as InterviewSvc
        component [ATSService] as ATSSvc
        component [S3Service] as S3Svc
        component [EmailService] as EmailSvc
    }
    
    package "AI Agents" {
        component [TrainedInterviewAgent] as TIA
        component [CustomATSAgent] as CAA
        component [AIAgentEngine] as AAE
        component [IntelligentATSAgent] as IAA
    }
    
    package "Utilities" {
        component [InputValidator] as Validator
        component [Encryptor] as Encrypt
        component [RateLimiter] as RateLimit
        component [AuditLogger] as AuditLog
    }
}

package "DATA ACCESS LAYER" {
    package "Repositories" {
        component [UserRepository] as UserRepo
        component [ResumeRepository] as ResumeRepo
        component [InterviewRepository] as IntRepo
        component [AtsAnalysisRepository] as ATSRepo
    }
    
    package "ORM" {
        component [Prisma Client] as PrismaClient
    }
}

package "DATABASE LAYER" {
    package "PostgreSQL" {
        component [User Model] as UserModel
        component [Resume Model] as ResumeModel
        component [Interview Model] as IntModel
        component [AtsAnalysis Model] as ATSModel
    }
}

AuthPage --> AuthSvc
DashPage --> InterviewSvc
InterviewPage --> AIIntComp
ATSPage --> ATSAnalyzer

AIIntComp --> GetQuestion
AIIntComp --> SubmitAnswer
ResBuilder --> Upload
ATSAnalyzer --> ATSAnalyze
AdminDash --> AdminExport

Register --> AuthSvc
Login --> AuthSvc
Upload --> ResumeSvc
ResumeAnalyze --> ATSSvc
IntStart --> InterviewSvc
GetQuestion --> TIA
SubmitAnswer --> InterviewSvc
ATSDecide --> ATSSvc

AuthSvc --> Validator
AuthSvc --> Encrypt
AuthSvc --> UserRepo
ResumeSvc --> S3Svc
ResumeSvc --> CAA
ResumeSvc --> ResumeRepo
InterviewSvc --> TIA
InterviewSvc --> IntRepo
ATSSvc --> CAA
ATSSvc --> AAE
ATSSvc --> IAA
ATSSvc --> ATSRepo

UserRepo --> PrismaClient
ResumeRepo --> PrismaClient
IntRepo --> PrismaClient
ATSRepo --> PrismaClient

PrismaClient --> UserModel
PrismaClient --> ResumeModel
PrismaClient --> IntModel
PrismaClient --> ATSModel

note right of AuthPage
Presentation Layer:
- React pages
- Components
- UI library
- State management
end note

note right of Register
API Layer:
- 20+ endpoints
- Request validation
- Response formatting
- Error handling
end note

note right of AuthSvc
Business Logic:
- Services
- AI agents
- Utilities
- Algorithms
end note

note right of UserRepo
Data Access:
- Repositories
- Prisma ORM
- Query building
- Transactions
end note

@enduml
```

---

## SYSTEM ARCHITECTURE DIAGRAM 3: DEPLOYMENT ARCHITECTURE

```plantuml
@startuml Deployment_Architecture
!theme plain
skinparam nodeBackgroundColor #E8F5E9
skinparam nodeBorderColor #1B5E20
skinparam arrowColor #1B5E20

node "Development Environment" {
    node "Developer Machine" {
        component [Local Next.js Dev Server] as LocalNextDev
        component [Local React Dev] as LocalReactDev
        component [Local PostgreSQL] as LocalPG
        component [Local Redis] as LocalRedis
    }
}

node "Staging Environment" {
    node "Staging Server (Linux)" {
        component [Staging Next.js] as StagingNext
        component [Staging API] as StagingAPI
        component [Node.js Runtime] as StagingNode
    }
    
    node "Staging Database" {
        component [PostgreSQL Staging] as StagingDB
        component [Backups] as StagingBackup
    }
    
    node "Staging Cache" {
        component [Redis Staging] as StagingCache
    }
}

node "Production Environment" {
    node "Load Balancer" {
        component [HTTPS/TLS 1.2+] as LoadBalancer
        component [SSL Certificates] as SSL
    }
    
    node "Application Servers (Multi-instance)" {
        component [API Server 1] as AppServer1
        component [API Server 2] as AppServer2
        component [API Server 3] as AppServer3
        component [... n instances] as AppServerN
    }
    
    node "Worker Pool" {
        component [Video Processing Worker 1] as Worker1
        component [Video Processing Worker 2] as Worker2
        component [Report Generator Worker] as ReportWorker
        component [... n workers] as WorkerN
    }
    
    node "Database Cluster" {
        node "Primary DB" {
            component [PostgreSQL Primary] as ProdDBPrimary
            component [Connection Pool] as ConnPool
        }
        
        node "Replica Servers" {
            component [Read Replica 1] as Replica1
            component [Read Replica 2] as Replica2
        }
    }
    
    node "Cache Cluster (Redis)" {
        component [Master Node] as RedisMaster
        component [Slave Node 1] as RedisSlave1
        component [Slave Node 2] as RedisSlave2
    }
}

node "Storage Layer" {
    node "AWS S3 Bucket" {
        component [Production Bucket] as S3Prod
        component [Resumes] as S3Resumes
        component [Videos] as S3Videos
        component [Reports] as S3Reports
        component [Backups (Daily)] as S3Backups
    }
}

node "Monitoring & Logging" {
    node "Monitoring Stack" {
        component [Prometheus] as Prometheus
        component [Grafana Dashboards] as Grafana
        component [AlertManager] as AlertMgr
    }
    
    node "Logging Stack" {
        component [Structured Logging] as Logger
        component [Log Aggregation] as LogAgg
        component [ELK Stack] as ELK
    }
}

node "CDN & Distribution" {
    component [CloudFlare] as CDN
    component [Static Assets] as StaticAssets
}

LocalNextDev --> StagingNext
LocalReactDev --> StagingAPI
LocalPG --> StagingDB
LocalRedis --> StagingCache

StagingNext --> LoadBalancer
StagingAPI --> LoadBalancer

LoadBalancer --> AppServer1
LoadBalancer --> AppServer2
LoadBalancer --> AppServer3
LoadBalancer --> AppServerN

AppServer1 --> ProdDBPrimary
AppServer2 --> ProdDBPrimary
AppServer3 --> Replica1
AppServerN --> Replica2

AppServer1 --> RedisMaster
AppServer2 --> RedisMaster
Worker1 --> RedisSlave1
Worker2 --> RedisSlave2

Worker1 --> S3Prod
Worker2 --> S3Prod
ReportWorker --> S3Prod

AppServer1 --> Logger
Worker1 --> Logger
Logger --> LogAgg
LogAgg --> ELK

AppServer1 --> Prometheus
Worker1 --> Prometheus
Prometheus --> Grafana
AlertMgr --> Grafana

CDN --> StaticAssets

note right of LocalNextDev
Development:
- Local dev servers
- Hot reload enabled
- Mock databases
- Debug mode
end note

note right of StagingNext
Staging:
- Pre-production setup
- Real databases (non-prod)
- Full feature testing
- Performance testing
end note

note right of LoadBalancer
Production:
- Multi-instance deployment
- Load balancing
- Auto-scaling
- SSL/TLS encryption
end note

note right of ProdDBPrimary
Database:
- Primary with replicas
- Read/write separation
- Connection pooling
- Automated backups
end note

note right of RedisMaster
Caching:
- Distributed cache
- Master-slave setup
- Session storage
- Rate limit tracking
end note

@enduml
```

---

## SYSTEM ARCHITECTURE DIAGRAM 4: DATA FLOW ARCHITECTURE

```plantuml
@startuml Data_Flow_Architecture
!theme plain
skinparam packageBackgroundColor #FFF3E0
skinparam packageBorderColor #E65100
skinparam componentBackgroundColor #FFE0B2
skinparam componentBorderColor #BF360C
skinparam arrowColor #E65100

package "INPUT SOURCES" {
    component [Candidate Registration] as RegInput
    component [Resume Upload] as ResumeInput
    component [Interview Video/Audio] as VideoInput
}

package "INTAKE PROCESSING" {
    component [Input Validation] as InputVal
    component [File Upload Handler] as FileHandler
    component [Virus Scan] as VirusScan
}

package "STORAGE LAYER 1: Immediate" {
    component [PostgreSQL] as DBImmediate
    component [Redis Cache] as CacheImmediate
    component [AWS S3] as S3Immediate
}

package "AI PROCESSING LAYER" {
    component [Resume Parser] as ResParser
    component [Text Extraction] as TextExt
    component [Question Generator\n(TrainedInterviewAgent)] as QGen
    component [Answer Evaluator] as AnswerEval
    component [Video Analyzer\n(MediaPipe)] as VideoAnalyzer
    component [ATS Pipeline\n(3-Agents)] as ATSPipeline
}

package "INTERMEDIATE PROCESSING" {
    component [NLP Processing] as NLP
    component [Feature Extraction] as FeatureExt
    component [Scoring Calculation] as Scoring
    component [Report Building] as ReportBuild
}

package "BACKGROUND JOBS" {
    component [Video Compression] as VidCompress
    component [PDF Generation] as PDFGen
    component [Email Notification] as EmailNotif
    component [Data Archival] as Archive
}

package "STORAGE LAYER 2: Results" {
    component [Interview Reports] as Reports
    component [ATS Analysis Records] as ATSResults
    component [Video Analysis Results] as VideoResults
    component [Transcripts] as Transcripts
}

package "OUTPUT DESTINATIONS" {
    component [Candidate Dashboard] as CandidateDash
    component [Admin Dashboard] as AdminDashOut
    component [Email Notifications] as EmailOut
    component [Data Export] as DataExport
}

package "LONG-TERM STORAGE" {
    component [Data Warehouse] as DataWH
    component [Archive Storage] as ArchiveStore
    component [Backup S3] as BackupS3
}

RegInput --> InputVal
ResumeInput --> InputVal
VideoInput --> InputVal

InputVal --> FileHandler
FileHandler --> VirusScan
VirusScan --> DBImmediate
VirusScan --> S3Immediate
VirusScan --> CacheImmediate

DBImmediate --> ResParser
S3Immediate --> TextExt
ResParser --> FeatureExt
TextExt --> FeatureExt

FeatureExt --> ATSPipeline
FeatureExt --> QGen

QGen --> DBImmediate
VideoInput --> VideoAnalyzer
VideoAnalyzer --> AnswerEval

AnswerEval --> Scoring
ATSPipeline --> Scoring
VideoResults -.-> AnswerEval

Scoring --> ReportBuild
ReportBuild --> VidCompress
ReportBuild --> PDFGen
PDFGen --> Reports
VidCompress --> Reports

Reports --> EmailNotif
ATSResults --> EmailNotif
Transcripts --> EmailNotif

EmailNotif --> EmailOut
CandidateDash --> EmailOut

Reports --> CandidateDash
ATSResults --> AdminDashOut
VideoResults --> AdminDashOut

CandidateDash --> DataExport
AdminDashOut --> DataExport

DataExport --> DataWH
Reports --> ArchiveStore
VideoResults --> BackupS3

note right of RegInput
Input Sources:
1. User registration
2. Resume upload
3. Video/audio recording
end note

note right of InputVal
Input Processing:
- Validation
- Format checking
- Security scan
- Rate limiting
end note

note right of ATSPipeline
AI Pipeline:
1. customATSAgent (NLP)
2. AIAgentEngine (Q-Learning)
3. IntelligentATSAgent (NN)
end note

note right of ReportBuild
Report Generation:
- Compile results
- Format data
- Generate PDF
- Create summary
end note

note right of DataWH
Analytics & BI:
- Historical data
- Trend analysis
- Performance metrics
- Reporting
end note

@enduml
```

---

## SYSTEM ARCHITECTURE DIAGRAM 5: TECHNOLOGY STACK

```plantuml
@startuml Technology_Stack
!theme plain
skinparam packageBackgroundColor #E0F2F1
skinparam packageBorderColor #00695C
skinparam componentBackgroundColor #B2DFDB
skinparam componentBorderColor #004D40
skinparam arrowColor #00695C

package "FRONTEND TECHNOLOGIES" {
    component [React 19] as React19
    component [TypeScript 5.3] as TS
    component [TailwindCSS 3.4] as Tailwind
    component [Next.js Pages] as NextPages
    component [React Context API] as ContextAPI
    component [WebRTC API] as WebRTC
    component [MediaRecorder API] as MediaRec
}

package "BACKEND TECHNOLOGIES" {
    component [Node.js 18+] as NodeJS
    component [Next.js 16 (API Routes)] as NextAPI
    component [Express.js (Optional)] as Express
    component [TypeScript 5.3] as BackendTS
}

package "DATABASE TECHNOLOGIES" {
    component [PostgreSQL 15] as PG
    component [Prisma ORM 5.12.0] as Prisma
    component [SQL] as SQL
}

package "CACHING & QUEUE" {
    component [Redis 7.0] as Redis
    component [BullMQ] as BullMQ
}

package "AI/ML TECHNOLOGIES" {
    component [Q-Learning Algorithm] as QLearning
    component [Neural Networks (Custom)] as NN
    component [NLP (HuggingFace)] as HF
    component [MediaPipe] as MediaPipe
}

package "STORAGE TECHNOLOGIES" {
    component [AWS S3] as S3
    component [Presigned URLs] as PresignedURL
}

package "SECURITY TECHNOLOGIES" {
    component [TLS 1.2+] as TLS
    component [PBKDF2] as PBKDF2
    component [JWT (HS256)] as JWT
    component [OWASP Security] as OWASP
    component [bcrypt] as Bcrypt
    component [Zod Validation] as Zod
}

package "EMAIL TECHNOLOGIES" {
    component [SMTP Server] as SMTP
    component [Email Templates] as EmailTemplate
}

package "TESTING TECHNOLOGIES" {
    component [Jest] as Jest
    component [React Testing Library] as RTL
    component [Cypress (E2E)] as Cypress
    component [Vitest] as Vitest
}

package "DEPLOYMENT & DEVOPS" {
    component [Docker] as Docker
    component [Docker Compose] as DockerCompose
    component [GitHub Actions] as GHActions
    component [Linux (Ubuntu)] as Linux
    component [SSL Certificates] as SslCert
}

package "MONITORING & LOGGING" {
    component [Prometheus] as Prom
    component [Grafana] as Grafan
    component [ELK Stack] as ELK
    component [Structured Logging] as StructLog
}

package "VERSION CONTROL" {
    component [Git] as Git
    component [GitHub] as GitHub
}

React19 --> NextPages
TS --> React19
Tailwind --> React19
WebRTC --> MediaRec

NodeJS --> NextAPI
BackendTS --> NextAPI
NextAPI --> Express

NextAPI --> Prisma
PG --> Prisma

Redis --> BullMQ
NextAPI --> Redis

NextAPI --> QLearning
NextAPI --> NN
NextAPI --> HF
NextAPI --> MediaPipe

NextAPI --> S3
S3 --> PresignedURL

NextAPI --> TLS
NextAPI --> Bcrypt
NextAPI --> JWT
NextAPI --> Zod
NextAPI --> PBKDF2

NextAPI --> SMTP
SMTP --> EmailTemplate

NextAPI --> Prom
Prom --> Grafan
NextAPI --> ELK
ELK --> StructLog

Git --> GitHub
GHActions --> Docker
Docker --> DockerCompose
Linux --> DockerCompose

note right of React19
Frontend Stack:
- React 19 latest
- TypeScript for type safety
- TailwindCSS for styling
- WebRTC for video/audio
- Context API for state
end note

note right of NodeJS
Backend Stack:
- Node.js 18+
- Next.js 16
- TypeScript
- REST APIs
- Server-side rendering
end note

note right of PG
Data Stack:
- PostgreSQL 15
- Prisma ORM
- 11 models
- Transactions
- Replication
end note

note right of QLearning
AI Stack:
- Q-Learning (87K & 1.7M states)
- Neural Networks (custom)
- HuggingFace models
- MediaPipe for video
end note

note right of TLS
Security Stack:
- TLS/HTTPS
- PBKDF2 hashing (100K)
- JWT tokens
- bcrypt for passwords
- Zod for validation
- OWASP compliance
end note

@enduml
```

---

## SYSTEM ARCHITECTURE DIAGRAM 6: INFRASTRUCTURE TOPOLOGY

```plantuml
@startuml Infrastructure_Topology
!theme plain
skinparam nodeBackgroundColor #F1F8E9
skinparam nodeBorderColor #33691E
skinparam arrowColor #33691E

node "INTERNET" {
}

node "CDN Layer" {
    component [CloudFlare] as CF
}

node "Load Balancing" {
    component [AWS ALB / NGINX] as LB
    component [SSL/TLS Termination] as SSLTerm
}

node "Web Servers" {
    node "Region 1 (Primary)" {
        node "Zone A" {
            component [Web Server 1] as WS1
            component [Web Server 2] as WS2
        }
        node "Zone B" {
            component [Web Server 3] as WS3
            component [Web Server 4] as WS4
        }
    }
    
    node "Region 2 (Backup)" {
        component [Web Server 5] as WS5
        component [Web Server 6] as WS6
    }
}

node "Cache Layer" {
    node "Redis Cluster" {
        component [Redis Master] as RMaster
        component [Redis Slave 1] as RS1
        component [Redis Slave 2] as RS2
    }
}

node "Database Layer" {
    node "Primary Database" {
        component [PostgreSQL Primary] as DBPRI
        component [Connection Pool (pgBouncer)] as ConnPool
    }
    
    node "Standby/Replicas" {
        component [PostgreSQL Standby] as DBStandby
        component [Read Replica 1] as DBReplica1
        component [Read Replica 2] as DBReplica2
    }
}

node "Storage Layer" {
    node "AWS S3" {
        component [Standard Bucket] as S3Standard
        component [Versioning Enabled] as S3Version
        component [Lifecycle Rules] as S3Lifecycle
    }
    
    node "Backups" {
        component [Daily Snapshots] as Snapshots
        component [Cross-Region Copy] as CrossRegion
    }
}

node "Job Processing" {
    node "Worker Nodes" {
        component [Worker 1] as Job1
        component [Worker 2] as Job2
        component [Worker 3] as Job3
        component [Worker N] as JobN
    }
}

node "Monitoring & Security" {
    component [Prometheus] as Mon
    component [WAF (Web Application Firewall)] as WAF
    component [DDoS Protection] as DDoS
    component [IDS/IPS] as IDS
}

node "Logging & Analytics" {
    component [Structured Logging] as StructLog
    component [Log Storage] as LogStore
    component [Analytics Dashboard] as Analytics
}

INTERNET --> CF
CF --> LB
WAF --> LB
DDoS --> WAF
IDS --> LB

LB --> SSLTerm
SSLTerm --> WS1
SSLTerm --> WS2
SSLTerm --> WS3
SSLTerm --> WS4
SSLTerm --> WS5
SSLTerm --> WS6

WS1 --> RMaster
WS2 --> RMaster
WS3 --> RMaster
WS4 --> RS1
WS5 --> RS2

WS1 --> DBPRI
WS2 --> DBPRI
WS3 --> DBReplica1
WS4 --> DBReplica2
WS5 --> DBStandby

DBPRI --> DBStandby
DBPRI --> Snapshots
Snapshots --> CrossRegion

WS1 --> S3Standard
S3Standard --> S3Version
S3Version --> S3Lifecycle

WS1 --> Job1
WS2 --> Job2
WS3 --> Job3
Job1 --> JobN

WS1 --> Mon
Job1 --> Mon
Mon --> Analytics

WS1 --> StructLog
StructLog --> LogStore

note right of CF
CDN:
- Global distribution
- Static asset caching
- DDoS mitigation
- SSL/TLS
end note

note right of LB
Load Balancing:
- Layer 7 load balancing
- Health checks
- Auto-scaling groups
- Multi-AZ deployment
end note

note right of WS1
Web Servers:
- Multi-region
- Multi-zone
- Auto-scaling
- Health checks
- Graceful shutdown
end note

note right of RMaster
Caching:
- Redis cluster
- Master-slave
- Persistence
- Sentinel monitoring
end note

note right of DBPRI
Database:
- Primary standby
- Read replicas
- Connection pooling
- Automated backups
- Point-in-time recovery
end note

note right of Job1
Workers:
- Async processing
- Video analysis
- Report generation
- Scalable pool
- Retry logic
end note

@enduml
```

---

## SYSTEM ARCHITECTURE DIAGRAM 7: SERVICE INTERACTIONS & API GATEWAY

```plantuml
@startuml Service_Interactions
!theme plain
skinparam packageBackgroundColor #FCE4EC
skinparam packageBorderColor #880E4F
skinparam componentBackgroundColor #F8BBD0
skinparam componentBorderColor #880E4F
skinparam arrowColor #880E4F

package "API Gateway" {
    component [Request Router] as Router
    component [Authentication] as APISec
    component [Rate Limiter] as APIRateLimit
}

package "Auth Service" {
    component [Register Handler] as RegisterH
    component [Login Handler] as LoginH
    component [Token Manager] as TokenMgr
    component [Password Reset] as PwdReset
}

package "Resume Service" {
    component [Upload Handler] as UploadH
    component [Parser] as Parser
    component [Analyzer] as Analyzer
    component [Version Manager] as VersionMgr
}

package "Interview Service" {
    component [Session Manager] as SessionMgr
    component [Question Engine] as QuestionEngine
    component [Answer Evaluator] as AnswerEvalH
    component [Report Generator] as ReportGenH
}

package "ATS Service" {
    component [Feature Extractor] as FeatureExt
    component [Agent Orchestrator] as AgentOrch
    component [Decision Maker] as DecisionMaker
    component [Validator] as Validator
}

package "Job Service" {
    component [Queue Manager] as QueueMgr
    component [Video Processor] as VideoProcH
    component [Email Sender] as EmailSenderH
    component [Archiver] as ArchiveH
}

package "Admin Service" {
    component [User Manager] as UserMgrH
    component [Data Exporter] as DataExpH
    component [Analytics] as AnalyticsH
}

package "Storage Service" {
    component [S3 Manager] as S3Mgr
    component [File Validator] as FileVal
    component [Presigned URL Gen] as PresignedGen
}

package "Database Service" {
    component [Query Builder] as QueryBuild
    component [Transaction Manager] as TransMgr
    component [Connection Pool] as ConnPoolMgr
}

package "Cache Service" {
    component [Session Cache] as SessionCacheSvc
    component [Rate Limit Cache] as RateLimitCache
    component [Query Cache] as QueryCacheSvc
}

Router --> APISec
APISec --> APIRateLimit

APIRateLimit --> RegisterH
APIRateLimit --> LoginH
APIRateLimit --> UploadH
APIRateLimit --> Parser
APIRateLimit --> QuestionEngine
APIRateLimit --> AnswerEvalH
APIRateLimit --> AgentOrch
APIRateLimit --> DataExpH

RegisterH --> TokenMgr
LoginH --> TokenMgr
PwdReset --> TokenMgr

TokenMgr --> SessionCacheSvc
UploadH --> FileVal
Parser --> Analyzer
Analyzer --> S3Mgr
Analyzer --> FeatureExt

QuestionEngine --> SessionMgr
QuestionEngine --> AnswerEvalH
AnswerEvalH --> ReportGenH

FeatureExt --> AgentOrch
AgentOrch --> DecisionMaker
DecisionMaker --> Validator

ReportGenH --> QueueMgr
AnswerEvalH --> QueueMgr
QueueMgr --> VideoProcH
QueueMgr --> EmailSenderH
QueueMgr --> ArchiveH

RegisterH --> QueryBuild
LoginH --> QueryBuild
UploadH --> QueryBuild
SessionMgr --> QueryBuild
AgentOrch --> QueryBuild

QueryBuild --> TransMgr
QueryBuild --> ConnPoolMgr
QueryBuild --> QueryCacheSvc

S3Mgr --> PresignedGen
FileVal --> PresignedGen

UserMgrH --> QueryBuild
DataExpH --> QueryBuild
AnalyticsH --> QueryCacheSvc

note right of Router
API Gateway:
- Route matching
- Request validation
- Authentication
- Rate limiting
- Request logging
end note

note right of RegisterH
Auth Service:
- Registration
- Login
- Token management
- Password reset
- Session handling
end note

note right of UploadH
Resume Service:
- File upload
- Resume parsing
- NLP analysis
- Version tracking
- S3 storage
end note

note right of QuestionEngine
Interview Service:
- Session management
- Question generation
- Answer evaluation
- Report creation
- Feedback generation
end note

note right of AgentOrch
ATS Service:
- 3-agent pipeline
- Feature extraction
- Decision making
- Validation
- Confidence scoring
end note

note right of VideoProcH
Job Service:
- Video processing
- Email sending
- Data archival
- Report compression
- Async execution
end note

@enduml
```

---

## SYSTEM ARCHITECTURE DIAGRAM 8: DATABASE SCHEMA ARCHITECTURE

```plantuml
@startuml Database_Schema_Architecture
!theme plain
skinparam packageBackgroundColor #E1F5FE
skinparam packageBorderColor #01579B
skinparam componentBackgroundColor #B3E5FC
skinparam componentBorderColor #0277BD
skinparam arrowColor #01579B

package "AUTHENTICATION MODELS" {
    component [User] as UserModel
    component [Account] as AccountModel
    component [Session] as SessionModel
    component [VerificationToken] as VerifToken
    component [PasswordResetToken] as PwdResetToken
}

package "RESUME MODELS" {
    component [Resume] as ResumeM
    component [ResumeVersion] as ResumeVersionM
}

package "INTERVIEW MODELS" {
    component [Interview] as InterviewM
    component [Video] as VideoM
}

package "ANALYSIS MODELS" {
    component [Report] as ReportM
    component [AtsAnalysis] as AtsAnalysisM
}

package "RELATIONSHIPS" {
    component [User → Resume] as R1
    component [Resume → AtsAnalysis] as R2
    component [Interview → Video] as R3
    component [Interview → Report] as R4
    component [User → Interview] as R5
    component [User → Session] as R6
}

package "INDEXES" {
    component [userId (FK)] as IDX1
    component [email (UNIQUE)] as IDX2
    component [resumeId (FK)] as IDX3
    component [interviewId (FK)] as IDX4
    component [createdAt (Sortable)] as IDX5
    component [status (Filterable)] as IDX6
}

package "DATA INTEGRITY" {
    component [Cascading Deletes] as CascDelete
    component [Foreign Key Constraints] as FKConstraint
    component [Check Constraints] as CheckConstraint
    component [Unique Constraints] as UniqueConstraint
}

package "PERSISTENCE" {
    component [Connection Pooling] as ConnPool
    component [Transaction Support] as TransSupport
    component [ACID Compliance] as ACID
    component [Backup Strategy] as BackupStrat
}

UserModel --> AccountModel
UserModel --> SessionModel
UserModel --> VerifToken
UserModel --> ResumeM
UserModel --> InterviewM

VerifToken -.-> UserModel
PwdResetToken -.-> UserModel

ResumeM --> ResumeVersionM
ResumeM --> AtsAnalysisM

InterviewM --> VideoM
InterviewM --> ReportM

R1 -.-> UserModel
R1 -.-> ResumeM
R2 -.-> ResumeM
R2 -.-> AtsAnalysisM
R3 -.-> InterviewM
R3 -.-> VideoM
R4 -.-> InterviewM
R4 -.-> ReportM
R5 -.-> UserModel
R5 -.-> InterviewM
R6 -.-> UserModel
R6 -.-> SessionModel

UserModel -.-> IDX2
ResumeM -.-> IDX3
InterviewM -.-> IDX4
ResumeM -.-> IDX5

CascDelete --> FKConstraint
CascDelete --> CheckConstraint
FKConstraint --> UniqueConstraint

ConnPool --> TransSupport
TransSupport --> ACID
ACID --> BackupStrat

note right of UserModel
User Table:
- id (PK)
- email (UNIQUE)
- hashedPassword
- role
- timestamps
end note

note right of ResumeM
Resume Table:
- id (PK)
- userId (FK)
- s3Url
- fileKey
- fileName
- timestamps
end note

note right of InterviewM
Interview Table:
- id (PK)
- userId (FK)
- resumeId (FK)
- role
- status
- scores (JSON)
- transcript
- timestamps
end note

note right of AtsAnalysisM
AtsAnalysis Table:
- id (PK)
- resumeId (FK)
- features (JSON)
- decision (ENUM)
- confidence (Float)
- agent scores (Float[])
- timestamps
end note

note right of CascDelete
Data Integrity:
✓ Cascading deletes
✓ Foreign keys
✓ Check constraints
✓ Unique constraints
✓ NOT NULL checks
end note

@enduml
```

---

## HOW TO USE THESE SYSTEM ARCHITECTURE DIAGRAMS

1. **Copy any PlantUML code above**
2. **Go to**: https://www.plantuml.com/plantuml/uml/
3. **Paste the code** in the editor
4. **Click Generate** to see the diagram
5. **Export as PNG/SVG** for presentation

### Recommended Presentation Order:

1. **High-Level 3-Tier Architecture** (Diagram 1) - Overall system structure
2. **Technology Stack** (Diagram 5) - All technologies used
3. **Detailed Component Architecture** (Diagram 2) - Layered components
4. **Service Interactions** (Diagram 7) - Service communication
5. **Data Flow Architecture** (Diagram 4) - Data processing pipeline
6. **Database Schema Architecture** (Diagram 8) - Data models & relationships
7. **Deployment Architecture** (Diagram 3) - Dev/Staging/Production
8. **Infrastructure Topology** (Diagram 6) - Physical deployment

### Key Coverage:

✅ **3-Tier Architecture** (Presentation, API, AI/Data)
✅ **Complete Component Layer** (Pages, Components, Services, Repositories)
✅ **All 4 AI Agents** (trainedInterviewAgent, customATSAgent, AIAgentEngine, IntelligentATSAgent)
✅ **Deployment Environments** (Development, Staging, Production)
✅ **Data Flow** (Input → Processing → Storage → Output)
✅ **Technology Stack** (React, TypeScript, Next.js, Node.js, PostgreSQL, Redis, S3)
✅ **Infrastructure** (Load balancing, caching, database replication, workers)
✅ **Service Interactions** (API Gateway, Auth, Resume, Interview, ATS, Job, Admin)
✅ **Database Schema** (11 models, relationships, indexes, integrity)
✅ **Security Features** (TLS, JWT, Rate Limiting, Input Validation)

**Architecture Principles Applied:**
- Separation of concerns (3-tier)
- Scalability (load balancing, caching, workers)
- Reliability (replication, backups, failover)
- Security (encryption, validation, rate limiting)
- Performance (caching, async processing, indexing)
- Maintainability (microservice patterns, clear interfaces)

