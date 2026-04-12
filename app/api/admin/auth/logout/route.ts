import { NextResponse, type NextRequest } from "next/server"

import { ADMIN_SESSION_COOKIE, clearAdminSession } from "@/lib/server/auth"
import { requireAdminAccessKey } from "@/lib/server/admin-request"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const accessError = requireAdminAccessKey(request)

  if (accessError) {
    return accessError
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  await clearAdminSession(token)

  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    expires: new Date(0),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })

  return response
}
