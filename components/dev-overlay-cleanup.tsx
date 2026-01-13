"use client"

import { useEffect } from "react"

export default function DevOverlayCleanup() {
  useEffect(() => {
    try {
      // Only run in development to avoid touching production DOM
      if (process.env.NODE_ENV !== "development") return

      const matchesOverlay = (svg: SVGElement) => {
        try {
          const outer = svg.outerHTML
          if (!outer) return false
          // look for Next dev client patterns seen in the pasted SVG
          if (/next_logo|next_logo_paint|class=\"paused\"|stroke-dasharray/.test(outer)) return true
        } catch (_) {
          return false
        }
        return false
      }

      const traverseAndCleanup = (root: ParentNode | ShadowRoot | Document) => {
        // Remove Next.js dev tools button directly by id and data attribute
        try {
          if (root instanceof Document || root instanceof ShadowRoot) {
            const devToolsBtn = root.getElementById("next-logo")
            if (devToolsBtn) {
              devToolsBtn.remove()
            }
          }
          const devToolsBtns = Array.from(root.querySelectorAll('[data-nextjs-dev-tools-button="true"]')) as HTMLElement[]
          devToolsBtns.forEach((btn) => btn.remove())

          // Also remove any remaining dev UI elements (buttons, divs with specific patterns)
          const devPatterns = root.querySelectorAll(
            'button[aria-label*="Dev Tools"], button[aria-label*="Next.js"], [data-testid*="dev"], [id*="dev-tools"]'
          )
          devPatterns.forEach((el) => el.remove())

          // Hide any remaining black vertical or horizontal lines that are part of dev UI
          const allDivs = Array.from(root.querySelectorAll('div, button, nav')) as HTMLElement[]
          allDivs.forEach((el) => {
            const style = window.getComputedStyle(el)
            const bg = style.backgroundColor
            const border = style.borderColor
            // if element is very small, fixed positioned, and dark, it's likely dev UI
            const rect = el.getBoundingClientRect()
            if (
              (rect.width < 20 || rect.height < 20) &&
              el.style.position === 'fixed' &&
              (bg.includes('rgb(0') || border.includes('rgb(0'))
            ) {
              el.style.display = 'none'
            }
          })
        } catch (_e) {
          // ignore errors when traversing
        }

        const svgs = Array.from(root.querySelectorAll('svg'))
        svgs.forEach((node) => {
          if (node instanceof SVGElement && matchesOverlay(node)) {
            node.remove()
          }
        })

        // also try to traverse open shadow roots
        const allElements = Array.from(root.querySelectorAll('*')) as Element[]
        allElements.forEach((el) => {
          const shadow = (el as Element & { shadowRoot?: ShadowRoot }).shadowRoot
          if (shadow) traverseAndCleanup(shadow)
        })

        // if there are iframes same-origin, try cleaning inside them
        const iframes = Array.from(root.querySelectorAll('iframe')) as HTMLIFrameElement[]
        iframes.forEach((frame) => {
          try {
            const doc = frame.contentDocument
            if (doc) traverseAndCleanup(doc)
          } catch (e) {
            // cross-origin iframe — ignore
          }
        })
      }

      // repeated cleanup in case overlay is injected after initial load
      const interval = setInterval(() => {
        try {
          traverseAndCleanup(document)
        } catch (_e) {}
      }, 300)

      // mutation observer as well to be responsive
      const mo = new MutationObserver(() => traverseAndCleanup(document))
      mo.observe(document.documentElement, { childList: true, subtree: true })

      // initial pass
      traverseAndCleanup(document)

      return () => {
        mo.disconnect()
        clearInterval(interval)
      }
    } catch (err) {
      // swallow errors in cleanup to avoid breaking app
      // eslint-disable-next-line no-console
      console.error("DevOverlayCleanup error:", err)
    }
  }, [])

  return null
}
