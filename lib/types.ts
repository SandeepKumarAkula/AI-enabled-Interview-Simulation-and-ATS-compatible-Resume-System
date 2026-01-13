export interface Experience {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  description: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  grade: string
  gradeType: "cgpa" | "percentage" | "none"
  description: string
}



export interface Skill {
  id: string
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
}

export interface CustomField {
  id: string
  heading: string
  content: string
}

export interface ResumeData {
  fullName: string
  email: string
  phone: string
  location: string
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  customFields: CustomField[]
}
