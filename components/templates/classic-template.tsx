"use client"

import type { ResumeData } from "@/lib/types"

interface ClassicTemplateProps {
  data: ResumeData
}

export default function ClassicTemplate({ data }: ClassicTemplateProps) {
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
        fontFamily: "Georgia, serif",
        fontSize: "12px",
        lineHeight: "1.6",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          borderBottom: "2px solid #000000",
          paddingBottom: "16px",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            letterSpacing: "0.5px",
            margin: "0 0 8px 0",
          }}
        >
          {data.fullName || "Your Name"}
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            fontSize: "12px",
            marginTop: "8px",
            color: "#333",
          }}
        >
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>|</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>|</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: "1px solid #666",
              paddingBottom: "4px",
              marginBottom: "8px",
            }}
          >
            Professional Summary
          </h2>
          <p
            style={{
              fontSize: "12px",
              lineHeight: "1.6",
              color: "#333",
              margin: "0",
              whiteSpace: "pre-wrap",
            }}
          >
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: "1px solid #666",
              paddingBottom: "4px",
              marginBottom: "8px",
            }}
          >
            Experience
          </h2>

          {data.experience.map((exp) => (
            <div key={exp.id} style={{ fontSize: "12px", marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "2px",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{exp.jobTitle}</span>

                {(exp.startDate || exp.endDate || exp.currentlyWorking) && (
                  <span style={{ color: "#555" }}>
                    {exp.startDate && formatDate(exp.startDate)}
                    {exp.startDate && (exp.endDate || exp.currentlyWorking) && " – "}
                    {exp.currentlyWorking ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </span>
                )}
              </div>

              <div style={{ color: "#555", fontStyle: "italic" }}>{exp.company}</div>
              {exp.location && <div style={{ color: "#666", fontSize: "11px" }}>{exp.location}</div>}

              {exp.description && (
                <p
                  style={{
                    marginTop: "4px",
                    color: "#333",
                    whiteSpace: "pre-wrap",
                    fontSize: "11px",
                  }}
                >
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education (UPDATED) */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: "1px solid #666",
              paddingBottom: "4px",
              marginBottom: "8px",
            }}
          >
            Education
          </h2>

          {data.education.map((edu) => (
            <div key={edu.id} style={{ fontSize: "12px", marginBottom: "12px" }}>
              {/* School + Dates */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{edu.school}</span>

                {(edu.startDate || edu.endDate) && (
                  <span style={{ color: "#555", fontSize: "11px" }}>
                    {edu.startDate && formatDate(edu.startDate)}
                    {edu.startDate && edu.endDate && " – "}
                    {edu.endDate && formatDate(edu.endDate)}
                  </span>
                )}
              </div>

              {/* Degree & Field */}
              <div style={{ color: "#555" }}>
                {edu.degree} {edu.field && `in ${edu.field}`}
              </div>

              {/* Grade (CGPA or Percentage) */}
              {edu.grade && edu.gradeType !== "none" && (
                <div style={{ marginTop: "2px", color: "#444", fontSize: "11px" }}>
                  <strong>{edu.gradeType === "cgpa" ? "CGPA" : "Percentage"}:</strong> {edu.grade}
                </div>
              )}

              {/* Description */}
              {edu.description && (
                <p
                  style={{
                    marginTop: "4px",
                    color: "#333",
                    whiteSpace: "pre-wrap",
                    fontSize: "11px",
                  }}
                >
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: "1px solid #666",
              paddingBottom: "4px",
              marginBottom: "8px",
            }}
          >
            Skills
          </h2>

          <p style={{ fontSize: "12px", color: "#333", margin: "0" }}>
            {data.skills.map((s) => s.name).join(" • ")}
          </p>
        </div>
      )}

      {/* Custom Fields */}
      {data.customFields.map((field) => (
        <div key={field.id} style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: "1px solid #666",
              paddingBottom: "4px",
              marginBottom: "8px",
            }}
          >
            {field.heading}
          </h2>

          <p style={{ fontSize: "12px", whiteSpace: "pre-wrap", margin: "0" }}>{field.content}</p>
        </div>
      ))}
    </div>
  )
}
