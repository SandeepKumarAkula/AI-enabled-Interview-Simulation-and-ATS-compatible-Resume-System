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
      {/* ================= HEADER ================= */}
      <div style={{ marginBottom: "16px", textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "8px" }}>
        <h1 style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "0.5px", margin: "0 0 4px 0" }}>
          {data.fullName}
        </h1>

        <div style={{ fontSize: "11px", marginTop: "4px", letterSpacing: "0.5px" }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span> • {data.phone}</span>}
          {data.location && <span> • {data.location}</span>}
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      {data.summary && (
        <div style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.6", color: "#333" }}>
          <p style={{ margin: "0", fontSize: "10px", whiteSpace: "pre-wrap" }}>{data.summary}</p>
        </div>
      )}

      {/* ================= EXPERIENCE ================= */}
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

                {(exp.startDate || exp.endDate || exp.currentlyWorking) && (
                  <span style={{ color: "#555", fontSize: "9px" }}>
                    {exp.startDate}
                    {exp.startDate && (exp.endDate || exp.currentlyWorking) && " – "}
                    {exp.currentlyWorking ? "Present" : exp.endDate}
                  </span>
                )}
              </div>

              <div style={{ color: "#555" }}>{exp.company}</div>

              {exp.description && (
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    marginTop: "2px",
                    textAlign: "justify",
                    fontSize: "9px",
                  }}
                >
                  {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= EDUCATION (UPDATED) ================= */}
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

          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "8px", fontSize: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{edu.degree}</span>

                {(edu.startDate || edu.endDate) && (
                  <span style={{ color: "#555", fontSize: "9px" }}>
                    {edu.startDate}
                    {edu.startDate && edu.endDate && " – "}
                    {edu.endDate}
                  </span>
                )}
              </div>

              <div style={{ color: "#555" }}>{edu.school}</div>

              {edu.field && <div style={{ color: "#333", fontSize: "9px" }}>{edu.field}</div>}

              {edu.grade && edu.gradeType !== "none" && (
                <div style={{ color: "#444", fontSize: "9px", marginTop: "2px" }}>
                  <strong>{edu.gradeType === "cgpa" ? "CGPA" : "Percentage"}:</strong> {edu.grade}
                </div>
              )}

              {edu.description && (
                <div
                  style={{
                    color: "#333",
                    fontSize: "9px",
                    whiteSpace: "pre-wrap",
                    marginTop: "3px",
                  }}
                >
                  {edu.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= SKILLS ================= */}
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

          <div style={{ fontSize: "10px" }}>
            {data.skills.map((skill, idx) => (
              <span key={skill.id}>
                {skill.name}
                {idx < data.skills.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ================= CUSTOM FIELDS ================= */}
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

              <div
                style={{
                  fontSize: "10px",
                  color: "#333",
                  whiteSpace: "pre-wrap",
                  textAlign: "justify",
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
