"use client"

import type { ResumeData } from "@/lib/types"

interface TemplateProps {
  data: ResumeData
}

export default function ElegantTemplate({ data }: TemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "32px",
        color: "#111827",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "11px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: "4px solid #b45309" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "300",
            letterSpacing: "1px",
            color: "#111827",
            margin: "0 0 4px 0",
          }}
        >
          {data.fullName}
        </h1>

        <div
          style={{
            fontSize: "10px",
            marginTop: "8px",
            color: "#666",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {[data.email, data.phone, data.location].filter(Boolean).join(" • ")}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div
          style={{
            marginBottom: "16px",
            textAlign: "justify",
            lineHeight: "1.6",
            color: "#333",
            fontSize: "10px",
            whiteSpace: "pre-wrap",
          }}
        >
          {data.summary}
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "300",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#b45309",
              marginBottom: "12px",
            }}
          >
            Experience
          </h2>

          {data.experience.map((exp) => (
            <div
              key={exp.id}
              style={{
                marginBottom: "12px",
                paddingBottom: "12px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontWeight: "600", color: "#111827", fontSize: "11px" }}>
                  {exp.jobTitle}
                </span>

                {(exp.startDate || exp.endDate || exp.currentlyWorking) && (
                  <span style={{ color: "#666", fontSize: "9px" }}>
                    {exp.startDate && formatDate(exp.startDate)}
                    {exp.startDate && (exp.endDate || exp.currentlyWorking) && " – "}
                    {exp.currentlyWorking ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </span>
                )}
              </div>

              <div style={{ color: "#555", fontWeight: "300", fontSize: "10px" }}>{exp.company}</div>

              {exp.description && (
                <div
                  style={{
                    color: "#333",
                    marginTop: "4px",
                    fontSize: "10px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education (UPDATED COMPLETELY) */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "300",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#b45309",
              marginBottom: "12px",
            }}
          >
            Education
          </h2>

          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "12px" }}>
              {/* University + Dates */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontWeight: "600", color: "#111827", fontSize: "11px" }}>{edu.school}</span>

                {(edu.startDate || edu.endDate) && (
                  <span style={{ color: "#666", fontSize: "9px" }}>
                    {edu.startDate && formatDate(edu.startDate)}
                    {edu.startDate && edu.endDate && " – "}
                    {edu.endDate && formatDate(edu.endDate)}
                  </span>
                )}
              </div>

              {/* Degree + Field */}
              <div style={{ color: "#555", fontWeight: "300", fontSize: "10px" }}>
                {edu.degree} {edu.field && `in ${edu.field}`}
              </div>

              {/* Grade (CGPA or Percentage) */}
              {edu.grade && edu.gradeType !== "none" && (
                <div style={{ color: "#444", fontSize: "10px", marginTop: "2px" }}>
                  <strong>{edu.gradeType === "cgpa" ? "CGPA" : "Percentage"}:</strong> {edu.grade}
                </div>
              )}

              {/* Description */}
              {edu.description && (
                <div
                  style={{
                    color: "#333",
                    marginTop: "4px",
                    fontSize: "10px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {edu.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "300",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#b45309",
              marginBottom: "12px",
            }}
          >
            Skills
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#fef3c7",
                  color: "#78350f",
                  borderRadius: "3px",
                  fontSize: "9px",
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Fields */}
      {data.customFields.map(
        (field) =>
          field.heading && (
            <div key={field.id} style={{ marginBottom: "16px" }}>
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: "300",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#b45309",
                  marginBottom: "12px",
                }}
              >
                {field.heading}
              </h2>

              <div
                style={{
                  color: "#333",
                  textAlign: "justify",
                  fontSize: "10px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {field.content}
              </div>
            </div>
          )
      )}
    </div>
  )
}
