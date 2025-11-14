"use client"

import type { ResumeData } from "@/lib/types"

interface ATSFriendlyTemplateProps {
  data: ResumeData
}

export default function ATSFriendlyTemplate({ data }: ATSFriendlyTemplateProps) {
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
        color: "#000000",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
      }}
    >
      {/* Header - ATS optimized */}
      <div style={{ marginBottom: "16px" }}>
        <h1 style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 8px 0" }}>{data.fullName || "Your Name"}</h1>
        <div style={{ fontSize: "11px", color: "#333" }}>
          {data.email && <span>{data.email} | </span>}
          {data.phone && <span>{data.phone} | </span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: "#333", lineHeight: "1.5", margin: "0", whiteSpace: "pre-wrap" }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
            Experience
          </div>
          <div>
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ fontSize: "11px", marginBottom: "12px" }}>
                <div style={{ fontWeight: "bold" }}>{exp.jobTitle}</div>
                <div>
                  {exp.company}, {exp.location}
                </div>
                <div style={{ color: "#555" }}>
                  {formatDate(exp.startDate)} to {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                </div>
                {exp.description && (
                  <p style={{ marginTop: "4px", color: "#333", whiteSpace: "pre-wrap", margin: "4px 0 0 0" }}>
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
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
            Education
          </div>
          <div>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ fontSize: "11px", marginBottom: "8px" }}>
                <div style={{ fontWeight: "bold" }}>{edu.degree}</div>
                <div>
                  {edu.school}, {edu.field}
                </div>
                <div style={{ color: "#555" }}>Graduated: {formatDate(edu.graduationDate)}</div>
                {edu.description && (
                  <p style={{ marginTop: "4px", color: "#333", margin: "4px 0 0 0" }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills - ATS friendly format */}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
            Skills
          </div>
          <div style={{ fontSize: "11px", color: "#333" }}>
            {data.skills.map((skill, idx) => (
              <div key={skill.id}>
                {skill.name} ({skill.level})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Fields */}
      {data.customFields.map((field) => (
        <div key={field.id} style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
            {field.heading}
          </div>
          <p style={{ fontSize: "11px", color: "#333", margin: "0", whiteSpace: "pre-wrap" }}>{field.content}</p>
        </div>
      ))}
    </div>
  )
}
