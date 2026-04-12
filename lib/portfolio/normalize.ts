import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import { portfolioContentSchema, type PortfolioContent } from "@/lib/portfolio/schema"

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function deepMerge<T>(target: T, source: unknown): T {
  if (Array.isArray(target)) {
    return (Array.isArray(source) ? source : target) as T
  }

  if (!isPlainObject(target) || !isPlainObject(source)) {
    return (source ?? target) as T
  }

  const result: Record<string, unknown> = { ...target }

  for (const key of Object.keys(source)) {
    const targetValue = result[key]
    const sourceValue = source[key]

    if (Array.isArray(targetValue)) {
      result[key] = Array.isArray(sourceValue) ? sourceValue : targetValue
      continue
    }

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      result[key] = deepMerge(targetValue, sourceValue)
      continue
    }

    if (sourceValue !== undefined) {
      result[key] = sourceValue
    }
  }

  return result as T
}

export function normalizePortfolioContent(content: unknown): PortfolioContent {
  const merged = deepMerge(structuredClone(defaultPortfolioContent), content)
  return portfolioContentSchema.parse(merged)
}
