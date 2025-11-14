"use client"

import type { ResumeData } from "@/lib/types"

interface CreativeTemplateProps {
  data: ResumeData
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const [year, month] = dateString.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div
      style={{
        backgroundColor: "#f0f4ff",
        color: "#1a1a1a",
        padding: "32px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "12px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "2px solid #5b7ee3" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            background: "linear-gradient(to right, #2563eb, #4f46e5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 8px 0",
          }}
        >
          {data.fullName || "Your Name"}
        </h1>
        <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#555", marginTop: "12px" }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>• 📞 {data.phone}</span>}
          {data.location && <span>• 📍 {data.location}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div
          style={{ marginBottom: "24px", paddingBottom: "16px", borderLeft: "4px solid #5b7ee3", paddingLeft: "16px" }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#374151",
              lineHeight: "1.6",
              fontStyle: "italic",
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
        <div style={{ marginBottom: "24px", paddingBottom: "16px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#2563eb",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#2563eb",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            ></span>
            Experience
          </h2>
          <div>
            {data.experience.map((exp) => (
              <div
                key={exp.id}
                style={{ fontSize: "12px", marginBottom: "16px", paddingLeft: "16px", borderLeft: "2px solid #a5b4fc" }}
              >
                <div style={{ fontWeight: "bold", fontSize: "13px", color: "#1a1a1a", marginBottom: "2px" }}>
                  {exp.jobTitle}
                </div>
                <div style={{ color: "#2563eb", fontWeight: "600", marginBottom: "2px" }}>{exp.company}</div>
                <div style={{ color: "#666", fontSize: "11px", marginBottom: "4px" }}>
                  {formatDate(exp.startDate)} – {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                  {exp.location && ` • ${exp.location}`}
                </div>
                {exp.description && (
                  <p style={{ color: "#374151", margin: "4px 0 0 0", fontSize: "11px", whiteSpace: "pre-wrap" }}>
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
        <div style={{ marginBottom: "24px", paddingBottom: "16px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#2563eb",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#2563eb",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            ></span>
            Education
          </h2>
          <div>
            {data.education.map((edu) => (
              <div
                key={edu.id}
                style={{ fontSize: "12px", marginBottom: "12px", paddingLeft: "16px", borderLeft: "2px solid #a5b4fc" }}
              >
                <div style={{ fontWeight: "bold", color: "#1a1a1a", marginBottom: "2px" }}>{edu.school}</div>
                <div style={{ color: "#374151", marginBottom: "2px" }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </div>
                <div style={{ color: "#666", fontSize: "11px" }}>{formatDate(edu.graduationDate)}</div>
                {edu.description && (
                  <p style={{ color: "#374151", margin: "4px 0 0 0", fontSize: "11px" }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#2563eb",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#2563eb",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            ></span>
            Skills
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "600",
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
        <div key={field.id} style={{ marginBottom: "24px", paddingBottom: "16px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#2563eb",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#2563eb",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            ></span>
            {field.heading}
          </h2>
          <p style={{ fontSize: "12px", color: "#374151", margin: "0", whiteSpace: "pre-wrap" }}>{field.content}</p>
        </div>
      ))}
    </div>
  )
}
