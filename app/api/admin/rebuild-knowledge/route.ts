import { NextResponse, type NextRequest } from "next/server"

import { requireAdminSession } from "@/lib/server/admin-request"
import { rebuildKnowledgeBase } from "@/lib/server/knowledge"
import { getPortfolioContent, savePortfolioContent } from "@/lib/server/portfolio"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const authError = await requireAdminSession(request)

  if (authError) {
    return authError
  }

  const content = await getPortfolioContent()
  const rebuilt = await rebuildKnowledgeBase(content)
  const updated = await savePortfolioContent(
    {
      ...content,
      assistant: {
        ...content.assistant,
        resumeText: rebuilt.resumeText,
      },
    },
    request.headers.get("x-admin-username") ?? "admin",
  )

  return NextResponse.json({
    content: updated,
    chunkCount: rebuilt.chunks.length,
    success: true,
  })
}
