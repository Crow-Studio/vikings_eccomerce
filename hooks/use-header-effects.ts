"use client"

import { useEffect, useCallback } from "react"

export function useHeaderEffects(isMenuOpen: boolean, isCartOpen: boolean, setIsSearchOpen: (open: boolean) => void) {
  // Keyboard shortcut handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    },
    [setIsSearchOpen],
  )

  // Keyboard shortcut effect
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Body scroll lock effect
  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isCartOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen, isCartOpen])

  // Smooth animation styles effect
  useEffect(() => {
    const styleId = "smooth-menu-styles"
    if (document.getElementById(styleId)) return

    const style = document.createElement("style")
    style.id = styleId
    style.textContent = `
      [data-radix-dialog-content] {
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      [data-radix-dialog-overlay] {
        transition: opacity 0.2s ease-in-out !important;
      }
      @media (max-width: 640px) {
        body {
          padding-right: 0 !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      const existingStyle = document.getElementById(styleId)
      existingStyle?.remove()
    }
  }, [])
}
