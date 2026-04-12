import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"

import {
  ADMIN_SESSION_COOKIE,
  assertLoginAllowed,
  clearFailedLogins,
  createAdminSession,
  isAdminAuthConfigured,
  recordFailedLogin,
  validateAdminCredentials,
} from "@/lib/server/auth"
import { requireAdminAccessKey } from "@/lib/server/admin-request"

const loginSchema = z.object({
  password: z.string().min(1),
  username: z.string().min(1),
})

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const accessError = requireAdminAccessKey(request)

  if (accessError) {
    return accessError
  }

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Admin authentication is not configured. Please finish the env file first." },
      { status: 503 },
    )
  }

  try {
    await assertLoginAllowed(request)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Too many login attempts." },
      { status: 429 },
    )
  }

  const parsedBody = loginSchema.safeParse(await request.json())

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 })
  }

  const { username, password } = parsedBody.data
  const isValid = validateAdminCredentials(username, password)

  if (!isValid) {
    await recordFailedLogin(request)
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 })
  }

  await clearFailedLogins(request)

  const session = await createAdminSession(request, username)
  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: session.token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    expires: session.expiresAt,
    path: "/",
  })

  return response
}
