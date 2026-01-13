"use client"

import type { ResumeData } from "@/lib/types"

interface MinimalTemplateProps {
  data: ResumeData
}

export default function MinimalTemplate({ data }: MinimalTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: "32px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "12px",
        lineHeight: "1.6",
      }}
    >
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "18px", fontWeight: "300", letterSpacing: "0.5px", margin: "0 0 8px 0" }}>
          {data.fullName || "Your Name"}
        </h1>

        <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "#4b5563", marginTop: "4px" }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>—</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>—</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "12px", color: "#374151", whiteSpace: "pre-wrap" }}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#666",
              marginBottom: "12px",
            }}
          >
            Experience
          </div>

          {data.experience.map((exp) => (
            <div key={exp.id} style={{ fontSize: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontWeight: "600" }}>
                  {exp.jobTitle} at {exp.company}
                </span>

                {(exp.startDate || exp.endDate || exp.currentlyWorking) && (
                  <span style={{ color: "#6b7280", fontSize: "11px" }}>
                    {exp.startDate && formatDate(exp.startDate)}
                    {exp.startDate && (exp.endDate || exp.currentlyWorking) && " – "}
                    {exp.currentlyWorking ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </span>
                )}
              </div>

              {exp.location && (
                <div style={{ color: "#666", fontSize: "11px", marginBottom: "4px" }}>{exp.location}</div>
              )}

              {exp.description && (
                <p style={{ color: "#374151", fontSize: "11px", whiteSpace: "pre-wrap", marginTop: "4px" }}>
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education (UPDATED) */}
      {data.education.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#666",
              marginBottom: "12px",
            }}
          >
            Education
          </div>

          {data.education.map((edu) => (
            <div key={edu.id} style={{ fontSize: "12px", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontWeight: "600" }}>
                  {edu.degree} in {edu.field} — {edu.school}
                </span>

                {(edu.startDate || edu.endDate) && (
                  <span style={{ color: "#6b7280", fontSize: "11px" }}>
                    {edu.startDate && formatDate(edu.startDate)}
                    {edu.startDate && edu.endDate && " – "}
                    {edu.endDate && formatDate(edu.endDate)}
                  </span>
                )}
              </div>

              {/* Grade (CGPA or Percentage) */}
              {edu.grade && edu.gradeType !== "none" && (
                <div style={{ color: "#374151", fontSize: "11px" }}>
                  <strong>{edu.gradeType === "cgpa" ? "CGPA" : "Percentage"}:</strong> {edu.grade}
                </div>
              )}

              {/* Description */}
              {edu.description && (
                <p style={{ color: "#374151", fontSize: "11px", whiteSpace: "pre-wrap", marginTop: "4px" }}>
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#666",
              marginBottom: "8px",
            }}
          >
            Skills
          </div>

          <p style={{ fontSize: "12px", color: "#374151", margin: "0" }}>
            {data.skills.map((s) => s.name).join(" • ")}
          </p>
        </div>
      )}

      {/* Custom Sections */}
      {data.customFields.map((field) => (
        <div key={field.id} style={{ marginTop: "20px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#666",
              marginBottom: "8px",
            }}
          >
            {field.heading}
          </div>

          <p style={{ fontSize: "12px", color: "#374151", whiteSpace: "pre-wrap", margin: "0" }}>
            {field.content}
          </p>
        </div>
      ))}
    </div>
  )
}
