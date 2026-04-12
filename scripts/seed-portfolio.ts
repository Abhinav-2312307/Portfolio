import fs from "fs/promises"
import path from "path"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import { uploadBufferToCloudinary } from "@/lib/server/cloudinary"
import { isCloudinaryConfigured, isMongoConfigured } from "@/lib/server/env"
import { savePortfolioContent } from "@/lib/server/portfolio"

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function maybeUploadLocalAsset(url: string, options: { folder: string; filename: string; resourceType?: "image" | "raw" }) {
  if (!url.startsWith("/")) {
    return url
  }

  if (!isCloudinaryConfigured()) {
    return url
  }

  const absolutePath = path.join(process.cwd(), "public", url.replace(/^\//, ""))
  const buffer = await fs.readFile(absolutePath)
  const uploaded = await uploadBufferToCloudinary(buffer, {
    filename: options.filename,
    folder: options.folder,
    resourceType: options.resourceType ?? "image",
  })

  return uploaded.secure_url
}

async function main() {
  const content = structuredClone(defaultPortfolioContent)

  if (isCloudinaryConfigured()) {
    console.log("[seed] Uploading local portfolio assets to Cloudinary...")

    content.identity.profileImageUrl = await maybeUploadLocalAsset(content.identity.profileImageUrl, {
      filename: "profile-image",
      folder: "portfolio/profile",
      resourceType: "image",
    })

    content.identity.resumeUrl = await maybeUploadLocalAsset(content.identity.resumeUrl, {
      filename: "resume",
      folder: "portfolio/resume",
      resourceType: "raw",
    })

    content.meta.ogImageUrl = content.identity.profileImageUrl

    for (const [index, project] of content.projects.items.entries()) {
      project.image = await maybeUploadLocalAsset(project.image, {
        filename: `${String(index + 1).padStart(2, "0")}-${slugify(project.title)}`,
        folder: "portfolio/projects",
        resourceType: "image",
      })
    }
  } else {
    console.log("[seed] Cloudinary credentials are incomplete. Keeping current local asset paths.")
  }

  const saved = await savePortfolioContent(content, "seed-script")

  if (isMongoConfigured()) {
    console.log(`[seed] Portfolio content saved to MongoDB for ${saved.identity.fullName}.`)
  } else {
    console.log("[seed] MONGODB_URI is missing. Content was normalized but not persisted to MongoDB yet.")
  }

  console.log(`[seed] Projects indexed: ${saved.projects.items.length}`)
  console.log(`[seed] Social links indexed: ${saved.socialLinks.length}`)
  console.log("[seed] Seed process finished.")
}

main().catch((error) => {
  console.error("[seed] Failed to seed portfolio:", error)
  process.exit(1)
})
