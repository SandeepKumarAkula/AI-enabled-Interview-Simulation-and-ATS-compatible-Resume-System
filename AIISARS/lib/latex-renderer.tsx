export function renderLatex(text: string): string {
  if (!text) return text

  // Simple LaTeX detection and conversion for common math expressions
  // Converts $..$ to HTML entity representation
  return text
    .replace(/\$\$([^$]+)\$\$/g, '<span class="latex-display">$$1</span>')
    .replace(/\$([^$]+)\$/g, '<span class="latex-inline">$1</span>')
}

export function hasLatex(text: string): boolean {
  return /\$[^$]+\$/.test(text)
}

// Component to render LaTeX content with KaTeX support
export function LatexContent({ content }: { content: string }) {
  // Check if content has LaTeX expressions
  if (!hasLatex(content)) {
    return <span>{content}</span>
  }

  // Split content by LaTeX expressions and render
  const parts = content.split(/(\$[^$]+\$)/g)

  return (
    <span>
      {parts.map((part, idx) => {
        if (part.match(/^\$[^$]+\$/)) {
          return (
            <span key={idx} className="inline-block mx-1 px-1 bg-blue-50 rounded text-blue-600 font-mono text-sm">
              {part}
            </span>
          )
        }
        return <span key={idx}>{part}</span>
      })}
    </span>
  )
}
