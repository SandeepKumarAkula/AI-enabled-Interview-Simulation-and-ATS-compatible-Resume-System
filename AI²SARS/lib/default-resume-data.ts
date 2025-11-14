import type { ResumeData } from "./types"

export const DEFAULT_RESUME_DATA: ResumeData = {
  fullName: "John Alexander Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  summary:
    "Experienced software engineer with 6+ years of expertise in full-stack development and cloud technologies. Passionate about building scalable applications and leading technical teams. Strong background in React, Node.js, and AWS.",
  experience: [
    {
      id: "exp1",
      jobTitle: "Senior Software Engineer",
      company: "Tech Innovation Inc.",
      startDate: "Jan 2022",
      endDate: "Present",
      description:
        "Lead development of microservices architecture serving 2M+ users. Mentored junior developers and improved code quality by 40%.",
    },
    {
      id: "exp2",
      jobTitle: "Full Stack Developer",
      company: "Digital Solutions Ltd.",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      description:
        "Developed and maintained React applications with Node.js backends. Implemented CI/CD pipelines reducing deployment time by 60%.",
    },
    {
      id: "exp3",
      jobTitle: "Junior Developer",
      company: "StartUp Labs",
      startDate: "Jan 2018",
      endDate: "May 2019",
      description:
        "Built responsive web applications using React. Collaborated with design team to implement pixel-perfect UI components.",
    },
  ],
  education: [
    {
      id: "edu1",
      school: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      graduationDate: "May 2017",
    },
    {
      id: "edu2",
      school: "Online Learning Platform",
      degree: "Certification",
      fieldOfStudy: "AWS Solutions Architect",
      graduationDate: "Dec 2021",
    },
  ],
  skills: [
    { id: "skill1", name: "JavaScript", proficiency: "Expert" },
    { id: "skill2", name: "React", proficiency: "Expert" },
    { id: "skill3", name: "TypeScript", proficiency: "Expert" },
    { id: "skill4", name: "Node.js", proficiency: "Advanced" },
    { id: "skill5", name: "AWS", proficiency: "Advanced" },
    { id: "skill6", name: "Docker", proficiency: "Intermediate" },
    { id: "skill7", name: "PostgreSQL", proficiency: "Advanced" },
    { id: "skill8", name: "System Design", proficiency: "Expert" },
  ],
  customFields: [
    {
      id: "custom1",
      heading: "Achievements",
      content: "Led migration of legacy system to microservices, resulting in 50% performance improvement",
    },
  ],
}
