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
      {/* LEFT SIDEBAR */}
      <div
        style={{ backgroundColor: "#1f2937", color: "#ffffff", width: "33.33%", padding: "24px", overflowY: "auto" }}
      >
        {/* Name + Contact */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 8px 0" }}>
            {data.fullName || "Your Name"}
          </h1>

          <div style={{ color: "#d1d5db", fontSize: "11px", marginTop: "8px" }}>
            {data.email && <div>📧 {data.email}</div>}
            {data.phone && <div>📞 {data.phone}</div>}
            {data.location && <div>📍 {data.location}</div>}
          </div>
        </div>

        {/* Skills */}
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

            {data.skills.map((skill) => (
              <div key={skill.id} style={{ marginBottom: "4px", color: "#d1d5db" }}>
                <span style={{ fontWeight: "600" }}>{skill.name}</span>
                <span style={{ color: "#999", fontSize: "10px" }}> — {skill.level}</span>
              </div>
            ))}
          </div>
        )}

        {/* Sidebar Summary */}
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

            <p style={{ fontSize: "11px", color: "#b0b8c1", lineHeight: "1.6", margin: 0 }}>{data.summary}</p>
          </div>
        )}
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
        {/* Experience */}
        {data.experience.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "12px",
                borderBottom: "2px solid #e5e7eb",
                paddingBottom: "4px",
              }}
            >
              Experience
            </h2>

            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: "bold" }}>{exp.jobTitle}</div>

                <div style={{ fontWeight: "600", color: "#374151" }}>{exp.company}</div>

                <div style={{ color: "#666", fontSize: "10px" }}>
                  {formatDate(exp.startDate)} – {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                </div>

                {exp.location && (
                  <div style={{ color: "#666", fontSize: "10px" }}>{exp.location}</div>
                )}

                {exp.description && (
                  <p style={{ color: "#374151", marginTop: "4px", whiteSpace: "pre-wrap", fontSize: "10px" }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education (UPDATED) */}
        {data.education.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "12px",
                borderBottom: "2px solid #e5e7eb",
                paddingBottom: "4px",
              }}
            >
              Education
            </h2>

            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "2px" }}>{edu.school}</div>

                <div style={{ color: "#374151", marginBottom: "2px" }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </div>

                {(edu.startDate || edu.endDate) && (
                  <div style={{ color: "#666", fontSize: "10px" }}>
                    {edu.startDate && formatDate(edu.startDate)}
                    {edu.startDate && edu.endDate && " – "}
                    {edu.endDate && formatDate(edu.endDate)}
                  </div>
                )}

                {/* Grade (CGPA or Percentage) */}
                {edu.grade && edu.gradeType !== "none" && (
                  <div style={{ marginTop: "2px", fontSize: "10px", color: "#1e3a8a" }}>
                    <strong>{edu.gradeType === "cgpa" ? "CGPA" : "Percentage"}:</strong> {edu.grade}
                  </div>
                )}

                {edu.description && (
                  <p style={{ fontSize: "10px", color: "#374151", marginTop: "4px" }}>
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Custom Sections */}
        {data.customFields.map((field) => (
          <div key={field.id} style={{ marginTop: "20px" }}>
            <h2
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "12px",
                borderBottom: "2px solid #e5e7eb",
                paddingBottom: "4px",
              }}
            >
              {field.heading}
            </h2>

            <p style={{ fontSize: "11px", color: "#374151", margin: 0, whiteSpace: "pre-wrap" }}>
              {field.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
