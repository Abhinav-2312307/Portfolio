// This file contains different cursor variants you can use
// Import this in your HTML and use the function to change cursor styles

// Function to change cursor style
function changeCursorStyle(style) {
  const cursorPointer = document.querySelector(".cursor-pointer")
  if (!cursorPointer) return

  // Remove current SVG
  while (cursorPointer.firstChild) {
    cursorPointer.removeChild(cursorPointer.firstChild)
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

  cursorPointer.appendChild(svg)
}

// You can call this function to change cursor style
// Example: changeCursorStyle('tech');
