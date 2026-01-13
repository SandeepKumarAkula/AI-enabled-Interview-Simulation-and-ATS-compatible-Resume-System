// /lib/templates.ts
// Template definitions for the Resume Gallery
// Each template includes metadata and display preferences.

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  layout:
    | "classic"
    | "modern"
    | "minimal"
    | "ats-friendly"
    | "two-column"
    | "academic"
    | "elegant"
    | "corporate"
    | "creative";
  /**
   * Optional rendering hint for gallery:
   * - 'contain' keeps the full image visible (best for tall resume designs)
   * - 'cover' fills the container (for wide artistic layouts)
   */
  fit?: "cover" | "contain";
  /**
   * High-quality rendering for crisp SVG/PNG previews
   * Default = 100
   */
  quality?: number;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional resume with a clean, professional layout.",
    preview: "/templates/classic.svg",
    layout: "classic",
    fit: "contain",
    quality: 100,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with bold typography and visual balance.",
    preview: "/templates/modern.svg",
    layout: "modern",
    fit: "contain",
    quality: 100,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Minimalist design focusing on clarity and simplicity.",
    preview: "/templates/minimal.svg",
    layout: "minimal",
    fit: "contain",
    quality: 100,
  },
  {
    id: "ats-friendly",
    name: "ATS-Friendly",
    description: "Optimized for Applicant Tracking Systems (ATS) to ensure 100% parsing accuracy.",
    preview: "/templates/ats-friendly.svg",
    layout: "ats-friendly",
    fit: "contain",
    quality: 100,
  },
  {
    id: "two-column",
    name: "Two-Column",
    description: "Split layout with a dedicated sidebar for skills and quick highlights.",
    preview: "/templates/two-column.svg",
    layout: "two-column",
    fit: "contain",
    quality: 100,
  },
  {
    id: "academic",
    name: "Academic",
    description: "Overleaf-inspired resume design ideal for research or higher education profiles.",
    preview: "/templates/academic.svg",
    layout: "academic",
    fit: "contain",
    quality: 100,
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated design with balanced spacing and subtle gold accents.",
    preview: "/templates/elegant.svg",
    layout: "elegant",
    fit: "contain",
    quality: 100,
  },
  
];
