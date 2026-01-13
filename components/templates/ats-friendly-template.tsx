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
      {/* HEADER */}
      <div style={{ marginBottom: "16px" }}>
        <h1 style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 8px 0" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div style={{ fontSize: "11px", color: "#333" }}>
          {data.email && <span>{data.email} | </span>}
          {data.phone && <span>{data.phone} | </span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      {data.summary && (
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: "#333", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* EXPERIENCE */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
            Experience
          </div>

          {data.experience.map((exp) => (
            <div key={exp.id} style={{ fontSize: "11px", marginBottom: "12px" }}>
              <div style={{ fontWeight: "bold" }}>{exp.jobTitle}</div>

              <div>
                {exp.company}, {exp.location}
              </div>

              {(exp.startDate || exp.endDate || exp.currentlyWorking) && (
                <div style={{ color: "#555" }}>
                  {exp.startDate && formatDate(exp.startDate)}
                  {exp.startDate && (exp.endDate || exp.currentlyWorking) && " to "}
                  {exp.currentlyWorking ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                </div>
              )}

              {exp.description && (
                <p style={{ color: "#333", whiteSpace: "pre-wrap", marginTop: "4px" }}>
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION (UPDATED) */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
            Education
          </div>

          {data.education.map((edu) => (
            <div key={edu.id} style={{ fontSize: "11px", marginBottom: "12px" }}>
              {/* Degree */}
              <div style={{ fontWeight: "bold" }}>{edu.degree}</div>

              {/* School + Field */}
              <div>
                {edu.school}
                {edu.field ? `, ${edu.field}` : ""}
              </div>

              {/* Start–End Dates */}
              {(edu.startDate || edu.endDate) && (
                <div style={{ color: "#555" }}>
                  {edu.startDate && formatDate(edu.startDate)}
                  {edu.startDate && edu.endDate && " – "}
                  {edu.endDate && formatDate(edu.endDate)}
                </div>
              )}

              {/* Grade (CGPA or Percentage) */}
              {edu.grade && edu.gradeType !== "none" && (
                <div style={{ marginTop: "2px", color: "#444" }}>
                  <strong>{edu.gradeType === "cgpa" ? "CGPA" : "Percentage"}:</strong> {edu.grade}
                </div>
              )}

              {/* Description */}
              {edu.description && (
                <p style={{ marginTop: "4px", color: "#333", whiteSpace: "pre-wrap" }}>
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
            Skills
          </div>

          <div style={{ fontSize: "11px", color: "#333" }}>
            {data.skills.map((skill) => (
              <div key={skill.id}>
                {skill.name} ({skill.level})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CUSTOM FIELDS */}
      {data.customFields.map((field) => (
        <div key={field.id} style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
            {field.heading}
          </div>

          <p style={{ fontSize: "11px", color: "#333", whiteSpace: "pre-wrap" }}>
            {field.content}
          </p>
        </div>
      ))}
    </div>
  )
}
