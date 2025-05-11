/**
 * Advanced cursor effects for portfolio
 */

class CursorEffects {
  constructor(options = {}) {
    this.options = {
      cursorPointerSelector: ".cursor-pointer",
      cursorTextSelector: ".cursor-text",
      trailCount: 15,
      trailClass: "cursor-trail",
      hoverSelectors:
        "a, button, .skill-card, .hobby-card, .project-card, .education-card, .magnetic-element, input, textarea",
      magneticSelector: ".magnetic-element",
      ...options,
    }

    this.cursorPointer = document.querySelector(this.options.cursorPointerSelector)
    this.cursorText = document.querySelector(this.options.cursorTextSelector)
    this.trails = []
    this.mouseX = 0
    this.mouseY = 0
    this.prevMouseX = 0
    this.prevMouseY = 0
    this.cursorX = 0
    this.cursorY = 0

    this.init()
  }

  init() {
    // Check if it's a touch device
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      this.disableCursor()
      return
    }

    this.createTrails()
    this.setupEventListeners()
    this.handleCursorHover()
    this.handleMagneticElements()
    this.animateCursor()
  }

  createTrails() {
    for (let i = 0; i < this.options.trailCount; i++) {
      const trail = document.createElement("div")
      trail.className = this.options.trailClass
      document.body.appendChild(trail)
      this.trails.push({
        element: trail,
        x: 0,
        y: 0,
        alpha: 0,
        size: Math.random() * 3 + 2,
      })
    }
  }

  setupEventListeners() {
    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX
      this.mouseY = e.clientY

      // Show cursor elements
      this.cursorPointer.style.opacity = "1"

      // Update cursor text position
      this.cursorText.style.left = `${this.mouseX}px`
      this.cursorText.style.top = `${this.mouseY - 20}px`
    })

    document.addEventListener("mousedown", () => {
      this.cursorPointer.style.transform = "translate(-50%, -50%) scale(0.8)"
    })

    document.addEventListener("mouseup", () => {
      this.cursorPointer.style.transform = "translate(-50%, -50%) scale(1)"
    })
  }

  handleCursorHover() {
    const hoverElements = document.querySelectorAll(this.options.hoverSelectors)

    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        this.cursorPointer.style.transform = "translate(-50%, -50%) scale(1.2)"

        // Show cursor text if available
        const cursorTextContent = element.getAttribute("data-cursor-text")
        if (cursorTextContent) {
          this.cursorText.textContent = cursorTextContent
          this.cursorText.style.opacity = "1"
        }
      })

      element.addEventListener("mouseleave", () => {
        this.cursorPointer.style.transform = "translate(-50%, -50%) scale(1)"
        this.cursorText.style.opacity = "0"
      })
    })
  }

  handleMagneticElements() {
    const magneticElements = document.querySelectorAll(this.options.magneticSelector)

    magneticElements.forEach((element) => {
      const strength = Number.parseFloat(element.getAttribute("data-strength")) || 0.1

      element.addEventListener("mousemove", (e) => {
        const rect = element.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const distanceX = e.clientX - centerX
        const distanceY = e.clientY - centerY

        const maxDistance = Math.max(rect.width, rect.height) / 2
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

        if (distance < maxDistance * 1.5) {
          const translateX = distanceX * strength
          const translateY = distanceY * strength

          element.style.transform = `translate(${translateX}px, ${translateY}px)`
        }
      })

      element.addEventListener("mouseleave", () => {
        element.style.transform = "translate(0, 0)"
      })
    })
  }

  animateCursor() {
    // Calculate velocity
    const deltaX = this.mouseX - this.prevMouseX
    const deltaY = this.mouseY - this.prevMouseY
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Smooth cursor movement
    this.cursorX += (this.mouseX - this.cursorX) * 0.2
    this.cursorY += (this.mouseY - this.cursorY) * 0.2
    this.cursorPointer.style.left = `${this.cursorX}px`
    this.cursorPointer.style.top = `${this.cursorY}px`

    // Rotate cursor based on movement direction
    if (velocity > 1) {
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      this.cursorPointer.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`
    }

    // Update cursor trails
    for (let i = this.trails.length - 1; i >= 0; i--) {
      const trail = this.trails[i]

      if (i === this.trails.length - 1) {
        trail.x = this.mouseX
        trail.y = this.mouseY
        trail.alpha = velocity > 5 ? Math.min(velocity / 50, 0.5) : 0
      } else {
        trail.x += (this.trails[i + 1].x - trail.x) * 0.3
        trail.y += (this.trails[i + 1].y - trail.y) * 0.3
        trail.alpha += (this.trails[i + 1].alpha - trail.alpha) * 0.3
      }

      trail.element.style.left = `${trail.x}px`
      trail.element.style.top = `${trail.y}px`
      trail.element.style.opacity = trail.alpha
      trail.element.style.width = `${trail.size}px`
      trail.element.style.height = `${trail.size}px`
      trail.element.style.transform = `translate(-50%, -50%)`
      trail.element.style.boxShadow = `0 0 ${5 + trail.alpha * 10}px var(--primary-color)`
    }

    // Store previous mouse position
    this.prevMouseX = this.mouseX
    this.prevMouseY = this.mouseY

    requestAnimationFrame(this.animateCursor.bind(this))
  }

  disableCursor() {
    document
      .querySelectorAll(
        `${this.options.cursorPointerSelector}, ${this.options.trailClass}, ${this.options.cursorTextSelector}`,
      )
      .forEach((el) => {
        el.style.display = "none"
      })
    document.body.style.cursor = "auto"
  }

  changeCursorStyle(style) {
    if (!this.cursorPointer) return

    // Remove current SVG
    while (this.cursorPointer.firstChild) {
      this.cursorPointer.removeChild(this.cursorPointer.firstChild)
    }

    // Create new SVG based on style
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 24 24")
    svg.setAttribute("fill", "none")

    switch (style) {
      case "arrow":
        // Arrow cursor
        svg.innerHTML = `
          <path d="M7 17L16.8995 7.10051" stroke="#00ff88" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 7H17V15" stroke="#00ff88" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        `
        break

      case "cross":
        // Cross cursor
        svg.innerHTML = `
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#00ff88" stroke-width="2"/>
          <path d="M14.5 9.5L9.5 14.5" stroke="#00ff88" stroke-width="2" stroke-linecap="round"/>
          <path d="M9.5 9.5L14.5 14.5" stroke="#00ff88" stroke-width="2" stroke-linecap="round"/>
        `
        break

      case "dot":
        // Dot cursor
        svg.innerHTML = `
          <circle cx="12" cy="12" r="3" fill="#00ff88" />
          <circle cx="12" cy="12" r="8" stroke="#00ff88" stroke-width="2" stroke-dasharray="2 2" />
        `
        break

      case "star":
        // Star cursor
        svg.innerHTML = `
          <path d="M12 2L14.4 9.09L22 9.5L16.5 14.14L18.18 22L12 17.77L5.82 22L7.5 14.14L2 9.5L9.6 9.09L12 2Z" stroke="#00ff88" stroke-width="2" stroke-linejoin="round"/>
        `
        break

      case "tech":
        // Tech cursor
        svg.innerHTML = `
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00ff88" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="#00ff88" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="#00ff88" stroke-width="2" stroke-linejoin="round"/>
        `
        break

      default:
        // Default cursor (arrow)
        svg.innerHTML = `
          <path d="M7 17L16.8995 7.10051" stroke="#00ff88" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 7H17V15" stroke="#00ff88" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        `
    }

    this.cursorPointer.appendChild(svg)
  }
}

// Export for use in main script
export default CursorEffects
