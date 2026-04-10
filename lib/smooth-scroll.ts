export const PORTFOLIO_SCROLL_EVENT = "portfolio:scroll"
export const PORTFOLIO_SCROLL_TO_EVENT = "portfolio:scroll-to"
export const PORTFOLIO_SCROLL_UPDATE_EVENT = "portfolio:scroll-update"

export type PortfolioScrollState = {
  direction: 1 | -1
  limit: number
  progress: number
  y: number
}

export type PortfolioScrollToOptions = {
  duration?: number
  id?: string
  offset?: number
  top?: number
}

export function hasSmoothScroll() {
  if (typeof document === "undefined") {
    return false
  }

  return document.documentElement.classList.contains("has-scroll-smooth")
}

export function dispatchPortfolioScrollState(detail: PortfolioScrollState) {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(new CustomEvent<PortfolioScrollState>(PORTFOLIO_SCROLL_EVENT, { detail }))
}

export function requestPortfolioScrollTo(detail: PortfolioScrollToOptions) {
  if (typeof window === "undefined") {
    return
  }

  if (!hasSmoothScroll()) {
    if (typeof detail.id === "string") {
      const target = document.getElementById(detail.id)

      if (target) {
        const rect = target.getBoundingClientRect()
        const top = window.scrollY + rect.top + (detail.offset ?? 0)

        window.scrollTo({
          top,
          behavior: "smooth",
        })
        return
      }
    }

    if (typeof detail.top === "number") {
      window.scrollTo({
        top: detail.top,
        behavior: "smooth",
      })
      return
    }
  }

  window.dispatchEvent(new CustomEvent<PortfolioScrollToOptions>(PORTFOLIO_SCROLL_TO_EVENT, { detail }))
}

export function requestPortfolioScrollUpdate() {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(new CustomEvent(PORTFOLIO_SCROLL_UPDATE_EVENT))
}
