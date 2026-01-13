"use client"

import type { ResumeData } from "@/lib/types"

interface ModernTemplateProps {
  data: ResumeData
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
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
      <div style={{ borderLeft: "4px solid #2563eb", paddingLeft: "16px", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#2563eb", margin: "0 0 8px 0" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#4b5563", marginTop: "8px" }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>•</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #d1d5db" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#2563eb",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            About
          </h2>
          <p style={{ fontSize: "12px", color: "#374151", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #d1d5db" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#2563eb",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Experience
          </h2>

          {data.experience.map((exp) => (
            <div key={exp.id} style={{ fontSize: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: "bold", color: "#111827" }}>{exp.jobTitle}</div>
                  <div style={{ color: "#2563eb", fontWeight: "600" }}>{exp.company}</div>
                </div>

                <div style={{ color: "#4b5563", textAlign: "right" }}>
                  {(exp.startDate || exp.endDate || exp.currentlyWorking) && (
                    <div>
                      {exp.startDate && formatDate(exp.startDate)}
                      {exp.startDate && (exp.endDate || exp.currentlyWorking) && " – "}
                      {exp.currentlyWorking ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                    </div>
                  )}

                  {exp.location && <div>{exp.location}</div>}
                </div>
              </div>

              {exp.description && (
                <p style={{ marginTop: "4px", color: "#374151", whiteSpace: "pre-wrap", margin: "4px 0 0 0" }}>
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education (UPDATED) */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #d1d5db" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#2563eb",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Education
          </h2>

          {data.education.map((edu) => (
            <div key={edu.id} style={{ fontSize: "12px", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: "bold", color: "#111827" }}>{edu.school}</div>
                  <div style={{ color: "#374151" }}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>

                  {/* Grade (CGPA or Percentage) */}
                  {edu.grade && edu.gradeType !== "none" && (
                    <div style={{ color: "#1e3a8a", fontSize: "11px", marginTop: "4px" }}>
                      <strong>{edu.gradeType === "cgpa" ? "CGPA" : "Percentage"}:</strong> {edu.grade}
                    </div>
                  )}
                </div>

                {(edu.startDate || edu.endDate) && (
                  <div style={{ color: "#4b5563" }}>
                    {edu.startDate && formatDate(edu.startDate)}
                    {edu.startDate && edu.endDate && " – "}
                    {edu.endDate && formatDate(edu.endDate)}
                  </div>
                )}
              </div>

              {edu.description && (
                <p style={{ marginTop: "4px", color: "#374151", whiteSpace: "pre-wrap" }}>
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#2563eb",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Skills
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  backgroundColor: "#dbeafe",
                  color: "#1e40af",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Fields */}
      {data.customFields.map((field) => (
        <div key={field.id} style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #d1d5db" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#2563eb",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            {field.heading}
          </h2>

          <p style={{ fontSize: "12px", color: "#374151", margin: 0, whiteSpace: "pre-wrap" }}>
            {field.content}
          </p>
        </div>
      ))}
    </div>
  )
}
