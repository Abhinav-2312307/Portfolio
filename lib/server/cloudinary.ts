import { v2 as cloudinary } from "cloudinary"

import { getCloudinaryConfig, isCloudinaryConfigured } from "@/lib/server/env"

let configured = false

function ensureCloudinary() {
  if (configured) {
    return
  }

  const { apiKey, apiSecret, cloudName } = getCloudinaryConfig()

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are incomplete.")
  }

  cloudinary.config({
    api_key: apiKey,
    api_secret: apiSecret,
    cloud_name: cloudName,
    secure: true,
  })

  configured = true
}

export type CloudinaryUploadOptions = {
  filename: string
  folder?: string
  resourceType?: "auto" | "image" | "raw"
}

export async function uploadBufferToCloudinary(buffer: Buffer, options: CloudinaryUploadOptions) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.")
  }

  ensureCloudinary()

  const { folder: defaultFolder } = getCloudinaryConfig()
  const folder = options.folder ?? defaultFolder
  const resourceType = options.resourceType ?? "auto"

  return new Promise<Awaited<ReturnType<typeof cloudinary.uploader.upload>>>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        overwrite: true,
        public_id: options.filename,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."))
          return
        }

        resolve(result)
      },
    )

    stream.end(buffer)
  })
}
