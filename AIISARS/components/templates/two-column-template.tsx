"use client"

import type { ResumeData } from "@/lib/types"

interface TwoColumnTemplateProps {
  data: ResumeData
}

export default function TwoColumnTemplate({ data }: TwoColumnTemplateProps) {
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
        padding: "0",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "11px",
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Left Column - Sidebar */}
      <div
        style={{ backgroundColor: "#1f2937", color: "#ffffff", width: "33.33%", padding: "24px", overflowY: "auto" }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 8px 0" }}>{data.fullName || "Your Name"}</h1>
          <div style={{ color: "#d1d5db", fontSize: "11px", space: "1px", marginTop: "8px" }}>
            {data.email && <div style={{ marginBottom: "2px" }}>📧 {data.email}</div>}
            {data.phone && <div style={{ marginBottom: "2px" }}>📞 {data.phone}</div>}
            {data.location && <div style={{ marginBottom: "2px" }}>📍 {data.location}</div>}
          </div>
        </div>

        {/* Skills in sidebar */}
        {data.skills.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "8px",
                borderTop: "1px solid #4b5563",
                paddingTop: "12px",
              }}
            >
              Skills
            </h2>
            <div>
              {data.skills.map((skill) => (
                <div key={skill.id} style={{ fontSize: "11px", color: "#d1d5db", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "600" }}>{skill.name}</span>
                  <span style={{ color: "#999", fontSize: "10px" }}> - {skill.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary in sidebar */}
        {data.summary && (
          <div>
            <h2
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "8px",
                borderTop: "1px solid #4b5563",
                paddingTop: "12px",
              }}
            >
              About
            </h2>
            <p style={{ fontSize: "11px", color: "#b0b8c1", lineHeight: "1.6", margin: "0" }}>{data.summary}</p>
          </div>
        )}
      </div>

      {/* Right Column - Main Content */}
      <div style={{ flex: "1", padding: "24px", overflowY: "auto" }}>
        {/* Experience */}
        {data.experience.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "12px",
                borderBottom: "2px solid #e5e7eb",
                paddingBottom: "4px",
              }}
            >
              Experience
            </h2>
            <div>
              {data.experience.map((exp) => (
                <div key={exp.id} style={{ fontSize: "11px", marginBottom: "12px" }}>
                  <div style={{ fontWeight: "bold", color: "#1a1a1a", marginBottom: "2px" }}>{exp.jobTitle}</div>
                  <div style={{ color: "#374151", fontWeight: "600", marginBottom: "2px" }}>{exp.company}</div>
                  <div style={{ color: "#666", fontSize: "10px", marginBottom: "2px" }}>
                    {formatDate(exp.startDate)} – {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                  </div>
                  {exp.location && (
                    <div style={{ color: "#666", fontSize: "10px", marginBottom: "4px" }}>{exp.location}</div>
                  )}
                  {exp.description && (
                    <p style={{ color: "#374151", margin: "4px 0 0 0", fontSize: "10px", whiteSpace: "pre-wrap" }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "12px",
                borderBottom: "2px solid #e5e7eb",
                paddingBottom: "4px",
              }}
            >
              Education
            </h2>
            <div>
              {data.education.map((edu) => (
                <div key={edu.id} style={{ fontSize: "11px", marginBottom: "12px" }}>
                  <div style={{ fontWeight: "bold", color: "#1a1a1a", marginBottom: "2px" }}>{edu.school}</div>
                  <div style={{ color: "#374151", marginBottom: "2px" }}>
                    {edu.degree} in {edu.field}
                  </div>
                  <div style={{ color: "#666", fontSize: "10px" }}>{formatDate(edu.graduationDate)}</div>
                  {edu.description && (
                    <p style={{ color: "#374151", margin: "4px 0 0 0", fontSize: "10px" }}>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Fields */}
        {data.customFields.map((field) => (
          <div key={field.id} style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "12px",
                borderBottom: "2px solid #e5e7eb",
                paddingBottom: "4px",
              }}
            >
              {field.heading}
            </h2>
            <p style={{ fontSize: "11px", color: "#374151", margin: "0", whiteSpace: "pre-wrap" }}>{field.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
