-- CreateTable
CREATE TABLE "AtsAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "resumeId" TEXT,
    "resumeVersionId" TEXT,
    "jobDescription" TEXT,
    "resumeText" TEXT,
    "score" INTEGER NOT NULL,
    "analysis" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AtsAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AtsAnalysis_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AtsAnalysis_resumeVersionId_fkey" FOREIGN KEY ("resumeVersionId") REFERENCES "ResumeVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AtsAnalysis_userId_createdAt_idx" ON "AtsAnalysis"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AtsAnalysis_resumeId_idx" ON "AtsAnalysis"("resumeId");

-- CreateIndex
CREATE INDEX "AtsAnalysis_resumeVersionId_idx" ON "AtsAnalysis"("resumeVersionId");
