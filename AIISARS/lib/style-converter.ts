"use client"

// Tailwind color class to hex mapping
const colorMap: { [key: string]: string } = {
  // Blues
  "text-blue-600": "#2563eb",
  "text-blue-800": "#1e40af",
  "bg-blue-50": "#eff6ff",
  "bg-blue-100": "#dbeafe",
  "bg-blue-600": "#2563eb",
  // Grays
  "text-gray-700": "#374151",
  "text-gray-800": "#1f2937",
  "text-gray-900": "#111827",
  "bg-gray-100": "#f3f4f6",
  "bg-gray-50": "#f9fafb",
  "text-gray-600": "#4b5563",
  // Slates
  "text-slate-700": "#334155",
  "text-slate-800": "#1e293b",
  "text-slate-900": "#0f172a",
  "bg-slate-50": "#f8fafc",
  // White/Black
  "text-white": "#ffffff",
  "text-black": "#000000",
  "bg-white": "#ffffff",
  "bg-black": "#000000",
  // Accent
  "text-indigo-600": "#4f46e5",
  "bg-indigo-50": "#eef2ff",
  // Additional colors
  "text-amber-600": "#d97706",
  "bg-amber-50": "#fffbeb",
}

const spacingMap: { [key: string]: string } = {
  "p-0": "padding: 0",
  "p-1": "padding: 0.25rem",
  "p-2": "padding: 0.5rem",
  "p-3": "padding: 0.75rem",
  "p-4": "padding: 1rem",
  "p-6": "padding: 1.5rem",
  "p-8": "padding: 2rem",
  "px-2": "padding-left: 0.5rem; padding-right: 0.5rem",
  "px-3": "padding-left: 0.75rem; padding-right: 0.75rem",
  "px-4": "padding-left: 1rem; padding-right: 1rem",
  "py-1": "padding-top: 0.25rem; padding-bottom: 0.25rem",
  "py-2": "padding-top: 0.5rem; padding-bottom: 0.5rem",
  "py-4": "padding-top: 1rem; padding-bottom: 1rem",
  "m-0": "margin: 0",
  "m-1": "margin: 0.25rem",
  "m-2": "margin: 0.5rem",
  "m-4": "margin: 1rem",
  "mb-1": "margin-bottom: 0.25rem",
  "mb-2": "margin-bottom: 0.5rem",
  "mb-3": "margin-bottom: 0.75rem",
  "mb-4": "margin-bottom: 1rem",
  "mb-6": "margin-bottom: 1.5rem",
  "mt-2": "margin-top: 0.5rem",
  "mt-4": "margin-top: 1rem",
  "gap-2": "gap: 0.5rem",
  "gap-4": "gap: 1rem",
}

const fontMap: { [key: string]: string } = {
  "text-xs": "font-size: 0.75rem",
  "text-sm": "font-size: 0.875rem",
  "text-base": "font-size: 1rem",
  "text-lg": "font-size: 1.125rem",
  "text-xl": "font-size: 1.25rem",
  "text-2xl": "font-size: 1.5rem",
  "text-3xl": "font-size: 1.875rem",
  "font-light": "font-weight: 300",
  "font-normal": "font-weight: 400",
  "font-semibold": "font-weight: 600",
  "font-bold": "font-weight: 700",
  "leading-tight": "line-height: 1.25",
  "leading-snug": "line-height: 1.375",
  "leading-relaxed": "line-height: 1.625",
}

export function convertTailwindToInline(html: string): string {
  let result = html

  // Replace color classes with style attributes
  Object.entries(colorMap).forEach(([className, hexColor]) => {
    const regex = new RegExp(`class="([^"]*)(\\b${className}\\b)([^"]*)?"`, "g")
    result = result.replace(regex, (match, before, classToReplace, after) => {
      const style = className.startsWith("text-") ? `color: ${hexColor}` : `background-color: ${hexColor}`
      return `class="${before}${after}" style="${style}"`
    })
  })

  // Replace spacing classes
  Object.entries(spacingMap).forEach(([className, styleRule]) => {
    const regex = new RegExp(`\\b${className}\\b`, "g")
    result = result.replace(regex, "")
  })

  return result
}

export function cleanHtmlForPDF(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement

  // Walk through all elements and convert classes to inline styles
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT, null)
  let node = walker.currentNode as HTMLElement

  while (node) {
    const classes = node.className.split(" ").filter((c) => c.length > 0)
    let inlineStyle = node.getAttribute("style") || ""

    classes.forEach((className) => {
      // Text colors
      if (className.startsWith("text-")) {
        const color = colorMap[className]
        if (color) {
          inlineStyle = `color: ${color}; ${inlineStyle}`
        }
      }
      // Background colors
      if (className.startsWith("bg-")) {
        const color = colorMap[className]
        if (color) {
          inlineStyle = `background-color: ${color}; ${inlineStyle}`
        }
      }
      // Font sizes
      if (className.startsWith("text-")) {
        const fontSize = fontMap[className]
        if (fontSize && !inlineStyle.includes("font-size")) {
          inlineStyle = `${fontSize}; ${inlineStyle}`
        }
      }
      // Font weights
      if (className.startsWith("font-")) {
        const fontWeight = fontMap[className]
        if (fontWeight && !inlineStyle.includes("font-weight")) {
          inlineStyle = `${fontWeight}; ${inlineStyle}`
        }
      }
      // Line heights
      if (className.startsWith("leading-")) {
        const lineHeight = fontMap[className]
        if (lineHeight && !inlineStyle.includes("line-height")) {
          inlineStyle = `${lineHeight}; ${inlineStyle}`
        }
      }
    })

    if (inlineStyle) {
      node.setAttribute("style", inlineStyle)
    }
    // Remove classes to prevent any remaining Tailwind issues
    node.removeAttribute("class")

    node = walker.nextNode() as HTMLElement
  }

  return clone
}
