import { NextResponse, type NextRequest } from "next/server"

import { requireAdminSession } from "@/lib/server/admin-request"
import { getPortfolioContent, savePortfolioContent } from "@/lib/server/portfolio"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const authError = await requireAdminSession(request)

  if (authError) {
    return authError
  }

  const content = await getPortfolioContent()
  return NextResponse.json({ content })
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdminSession(request)

  if (authError) {
    return authError
  }

  const body = await request.json()
  const updatedBy = request.headers.get("x-admin-username") ?? "admin"
  const content = await savePortfolioContent(body?.content ?? body, updatedBy)

  return NextResponse.json({ content, success: true })
}
