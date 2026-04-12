import { NextResponse, type NextRequest } from "next/server"

import { getAdminSession, isAdminAccessKeyValid } from "@/lib/server/auth"

export function requireAdminAccessKey(request: NextRequest) {
  const accessKey = request.headers.get("x-admin-access-key")

  if (!isAdminAccessKeyValid(accessKey)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return null
}

export async function requireAdminSession(request: NextRequest) {
  const accessKeyError = requireAdminAccessKey(request)

  if (accessKeyError) {
    return accessKeyError
  }

  const session = await getAdminSession(request)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}
