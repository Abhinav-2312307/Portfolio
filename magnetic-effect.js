// Magnetic effect for elements
// This can be included as a separate JS file

class MagneticEffect {
  constructor(elements, options = {}) {
    this.elements = typeof elements === "string" ? document.querySelectorAll(elements) : elements

    this.options = {
      strength: 0.1,
      speedIn: 1.2,
      speedOut: 0.7,
      ...options,
    }

    this.init()
  }

  init() {
    this.elements.forEach((element) => {
      // Get strength from data attribute or use default
      const strength = Number.parseFloat(element.getAttribute("data-strength")) || this.options.strength

      element.addEventListener("mousemove", (e) => this.handleMouseMove(e, element, strength))
      element.addEventListener("mouseleave", (e) => this.handleMouseLeave(e, element))
      element.addEventListener("mouseenter", (e) => this.handleMouseEnter(e, element))
    })
  }

  handleMouseMove(e, element, strength) {
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
      element.style.transition = "transform 0.1s ease-out"
    }
  }

  handleMouseLeave(e, element) {
    element.style.transform = "translate(0, 0)"
    element.style.transition = `transform ${this.options.speedOut}s ease-out`
  }

  handleMouseEnter(e, element) {
    element.style.transition = `transform ${this.options.speedIn}s ease-out`
  }
}

// Initialize magnetic effect
document.addEventListener("DOMContentLoaded", () => {
  const magneticEffect = new MagneticEffect(".magnetic-element")
})

// Export for use in other files
export { MagneticEffect }
