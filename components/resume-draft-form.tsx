"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus } from "lucide-react"
import type { ResumeData, Experience, Education, Skill, CustomField } from "@/lib/types"

interface ResumeDraftFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export default function ResumeDraftForm({ data, onChange }: ResumeDraftFormProps) {
  const [expandedSections, setExpandedSections] = useState({
    experience: true,
    education: true,
    skills: true,
  })

  const handleBasicChange = (
    field: keyof Omit<ResumeData, "experience" | "education" | "skills" | "customFields">,
    value: string,
  ) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  // Experience handlers
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    }
    onChange({
      ...data,
      experience: [...data.experience, newExperience],
    })
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    })
  }

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    })
  }

  // Education handlers
  const addEducation = () => {
  const newEducation: Education = {
    id: Date.now().toString(),
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    grade: "",
    gradeType: "cgpa",
    description: "",
  }
  onChange({
    ...data,
    education: [...data.education, newEducation],
  })
}


  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    })
  }

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    })
  }

  // Skills handlers
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "intermediate",
    }
    onChange({
      ...data,
      skills: [...data.skills, newSkill],
    })
  }

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    onChange({
      ...data,
      skills: data.skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill)),
    })
  }

  const removeSkill = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((skill) => skill.id !== id),
    })
  }

  const addCustomField = () => {
    const newCustomField: CustomField = {
      id: Date.now().toString(),
      heading: "",
      content: "",
    }
    onChange({
      ...data,
      customFields: [...data.customFields, newCustomField],
    })
  }

  const updateCustomField = (id: string, field: keyof CustomField, value: string) => {
    onChange({
      ...data,
      customFields: data.customFields.map((custom) => (custom.id === id ? { ...custom, [field]: value } : custom)),
    })
  }

  const removeCustomField = (id: string) => {
    onChange({
      ...data,
      customFields: data.customFields.filter((custom) => custom.id !== id),
    })
  }

  return (
    <div className="space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto pr-4">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Full Name"
            value={data.fullName}
            onChange={(e) => handleBasicChange("fullName", e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={data.email}
            onChange={(e) => handleBasicChange("email", e.target.value)}
          />
          <Input
            placeholder="Phone Number"
            value={data.phone}
            onChange={(e) => handleBasicChange("phone", e.target.value)}
          />
          <Input
            placeholder="Location"
            value={data.location}
            onChange={(e) => handleBasicChange("location", e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Brief overview of your professional background and goals"
            value={data.summary}
            onChange={(e) => handleBasicChange("summary", e.target.value)}
            className="min-h-24"
          />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="border border-border rounded-md p-4 space-y-3">
              <div className="flex justify-between items-start">
                <Input
                  placeholder="Job Title"
                  value={exp.jobTitle}
                  onChange={(e) => updateExperience(exp.id, "jobTitle", e.target.value)}
                  className="font-semibold"
                />
                <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
              />

              <Input
                placeholder="Location"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Start Date"
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                />
                <Input
                  placeholder="End Date"
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                  disabled={exp.currentlyWorking}
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={exp.currentlyWorking}
                  onChange={(e) => updateExperience(exp.id, "currentlyWorking", e.target.checked)}
                  className="rounded"
                />
                Currently working here
              </label>

              <Textarea
                placeholder="Job description and responsibilities"
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                className="min-h-20"
              />
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent" onClick={addExperience}>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </CardContent>
      </Card>

      {/* Education */}
      {/* Education */}
<Card>
  <CardHeader>
    <CardTitle className="text-lg">Education</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {data.education.map((edu) => (
      <div key={edu.id} className="border border-border rounded-md p-4 space-y-3">
        <div className="flex justify-between items-start">
          <Input
            placeholder="School/University"
            value={edu.school}
            onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
            className="font-semibold"
          />
          <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
          />
          <Input
            placeholder="Field of Study"
            value={edu.field}
            onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
  <Input
    placeholder="Start Date"
    type="month"
    value={edu.startDate}
    onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
  />

  <Input
    placeholder="End Date"
    type="month"
    value={edu.endDate}
    onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
  />
</div>

<div className="flex gap-2">
  <select
    value={edu.gradeType}
    onChange={(e) => updateEducation(edu.id, "gradeType", e.target.value as "cgpa" | "percentage" | "none")}
    className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  >
    <option value="cgpa">CGPA</option>
    <option value="percentage">Percentage</option>
    <option value="none">None</option>
  </select>
  
  {edu.gradeType !== "none" && (
    <Input
      placeholder={edu.gradeType === "cgpa" ? "e.g., 3.8/4.0" : "e.g., 85%"}
      value={edu.grade}
      onChange={(e) => updateEducation(edu.id, "grade", e.target.value)}
    />
  )}
</div>

        <Textarea
          placeholder="Additional details"
          value={edu.description}
          onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
          className="min-h-16"
        />
      </div>
    ))}

    <Button variant="outline" className="w-full bg-transparent" onClick={addEducation}>
      <Plus className="h-4 w-4 mr-2" />
      Add Education
    </Button>
  </CardContent>
</Card>


      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.skills.map((skill) => (
            <div key={skill.id} className="flex gap-2 items-end">
              <Input
                placeholder="Skill name"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                className="flex-1"
              />
              <select
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, "level", e.target.value)}
                className="px-3 py-2 border border-input rounded-md text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <Button variant="ghost" size="sm" onClick={() => removeSkill(skill.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent" onClick={addSkill}>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Custom Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add any custom section with a heading of your choice (e.g., Publications, Certifications, Languages, etc.)
          </p>
          {data.customFields.map((custom) => (
            <div key={custom.id} className="border border-border rounded-md p-4 space-y-3">
              <div className="flex justify-between items-start">
                <Input
                  placeholder="Section Heading (e.g., Publications, Certifications)"
                  value={custom.heading}
                  onChange={(e) => updateCustomField(custom.id, "heading", e.target.value)}
                  className="font-semibold flex-1"
                />
                <Button variant="ghost" size="sm" onClick={() => removeCustomField(custom.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <Textarea
                placeholder="Content (supports LaTeX: use $equation$ for inline or $$equation$$ for display)"
                value={custom.content}
                onChange={(e) => updateCustomField(custom.id, "content", e.target.value)}
                className="min-h-24 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use $...$ for inline math or $$...$$ for display equations
              </p>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent" onClick={addCustomField}>
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Section
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
