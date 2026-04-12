import { NextResponse, type NextRequest } from "next/server"

import { requireAdminSession } from "@/lib/server/admin-request"
import { uploadBufferToCloudinary } from "@/lib/server/cloudinary"

export const runtime = "nodejs"

function sanitizeFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminSession(request)

  if (authError) {
    return authError
  }

  const formData = await request.formData()
  const file = formData.get("file")
  const folder = String(formData.get("folder") || "portfolio")
  const kind = String(formData.get("kind") || "asset")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file is required." }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const extension = file.name.includes(".") ? file.name.split(".").pop() : ""
  const filename = sanitizeFilename(`${kind}-${Date.now()}${extension ? `.${extension}` : ""}`)
  const resourceType = file.type.includes("pdf") ? "raw" : "image"

  const uploaded = await uploadBufferToCloudinary(buffer, {
    filename,
    folder,
    resourceType,
  })

  return NextResponse.json({
    asset: {
      bytes: uploaded.bytes,
      publicId: uploaded.public_id,
      resourceType: uploaded.resource_type,
      secureUrl: uploaded.secure_url,
    },
    success: true,
  })
}
