"use client"

import type { ResumeData } from "@/lib/types"

interface TemplateProps {
  data: ResumeData
}

export default function AcademicTemplate({ data }: TemplateProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "32px",
        color: "#111827",
        minHeight: "100vh",
        fontFamily: "Georgia, serif",
        fontSize: "11px",
        lineHeight: "1.4",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "16px", textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "8px" }}>
        <h1 style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "0.5px", margin: "0 0 4px 0" }}>
          {data.fullName}
        </h1>
        <div style={{ fontSize: "11px", marginTop: "4px", letterSpacing: "0.5px" }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span> • </span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span> • </span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.6", color: "#333" }}>
          <p style={{ margin: "0", fontSize: "10px", whiteSpace: "pre-wrap" }}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <h3
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "1px solid #666",
              marginBottom: "8px",
              paddingBottom: "2px",
            }}
          >
            Experience
          </h3>
          <div style={{ lineHeight: "1.4" }}>
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "8px", fontSize: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{exp.jobTitle}</span>
                  {exp.startDate && (
                    <span style={{ color: "#555", fontSize: "9px" }}>
                      {exp.startDate}
                      {exp.endDate && !exp.currentlyWorking && ` – ${exp.endDate}`}
                      {exp.currentlyWorking && " – Present"}
                    </span>
                  )}
                </div>
                <div style={{ color: "#555" }}>{exp.company}</div>
                {exp.description && (
                  <div
                    style={{
                      color: "#333",
                      textAlign: "justify",
                      margin: "2px 0 0 0",
                      whiteSpace: "pre-wrap",
                      fontSize: "9px",
                    }}
                  >
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <h3
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "1px solid #666",
              marginBottom: "8px",
              paddingBottom: "2px",
            }}
          >
            Education
          </h3>
          <div style={{ lineHeight: "1.4" }}>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "8px", fontSize: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{edu.degree}</span>
                  {edu.graduationDate && <span style={{ color: "#555", fontSize: "9px" }}>{edu.graduationDate}</span>}
                </div>
                <div style={{ color: "#555" }}>{edu.school}</div>
                {edu.field && <div style={{ color: "#333", fontSize: "9px" }}>{edu.field}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <h3
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "1px solid #666",
              marginBottom: "8px",
              paddingBottom: "2px",
            }}
          >
            Skills
          </h3>
          <div style={{ textAlign: "justify", fontSize: "10px" }}>
            {data.skills.map((skill, idx) => (
              <span key={skill.id}>
                {skill.name}
                {idx < data.skills.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Fields */}
      {data.customFields.map(
        (field) =>
          field.heading && (
            <div key={field.id} style={{ marginBottom: "12px" }}>
              <h3
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #666",
                  marginBottom: "8px",
                  paddingBottom: "2px",
                }}
              >
                {field.heading}
              </h3>
              <div style={{ textAlign: "justify", color: "#333", fontSize: "10px", whiteSpace: "pre-wrap" }}>
                {field.content}
              </div>
            </div>
          ),
      )}
    </div>
  )
}
