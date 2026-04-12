import { NextResponse } from "next/server"

import { getPublicPortfolioContent } from "@/lib/server/portfolio"

export const runtime = "nodejs"

export async function GET() {
  const content = await getPublicPortfolioContent()
  return NextResponse.json({ content })
}
