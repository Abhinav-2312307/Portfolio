function readString(name: string) {
  return process.env[name]?.trim() ?? ""
}

function readNumber(name: string, fallback: number) {
  const rawValue = process.env[name]
  const parsed = Number(rawValue)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function isMongoConfigured() {
  return Boolean(readString("MONGODB_URI"))
}

export function getMongoConfig() {
  return {
    uri: readString("MONGODB_URI"),
    dbName: readString("MONGODB_DB_NAME") || "portfolio",
  }
}

export function getAdminConfig() {
  return {
    routeSecret: readString("ADMIN_ROUTE_SECRET"),
    username: readString("ADMIN_USERNAME"),
    password: readString("ADMIN_PASSWORD"),
    passwordHash: readString("ADMIN_PASSWORD_HASH"),
    sessionSecret: readString("ADMIN_SESSION_SECRET"),
    sessionHours: readNumber("ADMIN_SESSION_HOURS", 12),
    maxAttempts: readNumber("ADMIN_LOGIN_MAX_ATTEMPTS", 5),
    blockMinutes: readNumber("ADMIN_LOGIN_BLOCK_MINUTES", 20),
  }
}

export function isCloudinaryConfigured() {
  return Boolean(readString("CLOUDINARY_CLOUD_NAME") && readString("CLOUDINARY_API_KEY") && readString("CLOUDINARY_API_SECRET"))
}

export function getCloudinaryConfig() {
  return {
    cloudName: readString("CLOUDINARY_CLOUD_NAME"),
    apiKey: readString("CLOUDINARY_API_KEY"),
    apiSecret: readString("CLOUDINARY_API_SECRET"),
    folder: readString("CLOUDINARY_FOLDER") || "portfolio",
  }
}

export function getGeminiConfig() {
  return {
    apiKey: readString("GEMINI_API_KEY"),
    model: readString("GEMINI_MODEL") || "gemini-2.0-flash",
  }
}

export function getEmailJsConfig() {
  return {
    publicKey: readString("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"),
    serviceId: readString("NEXT_PUBLIC_EMAILJS_SERVICE_ID"),
    templateId: readString("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID"),
  }
}
