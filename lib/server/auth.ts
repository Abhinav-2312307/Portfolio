import { createHash, createHmac, pbkdf2Sync, randomBytes, randomUUID, timingSafeEqual } from "crypto"
import type { NextRequest } from "next/server"

import { getDatabase } from "@/lib/server/db"
import { getAdminConfig, isMongoConfigured } from "@/lib/server/env"

export const ADMIN_SESSION_COOKIE = "portfolio_admin_session"

type SessionPayload = {
  exp: number
  sid: string
  ua: string
  user: string
}

type StoredSession = {
  _id: string
  createdAt: Date
  expiresAt: Date
  ipHash: string
  lastSeenAt: Date
  uaHash: string
  user: string
}

type InMemoryAttempt = {
  blockedUntil?: number
  count: number
  createdAt: number
  updatedAt: number
}

declare global {
  // eslint-disable-next-line no-var
  var __portfolioAdminAttempts: Map<string, InMemoryAttempt> | undefined
  // eslint-disable-next-line no-var
  var __portfolioAdminSessions: Map<string, StoredSession> | undefined
}

function toBase64Url(value: Buffer | string) {
  const buffer = typeof value === "string" ? Buffer.from(value) : value
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4))
  return Buffer.from(normalized + padding, "base64")
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

function signToken(payload: SessionPayload, secret: string) {
  const encodedPayload = toBase64Url(JSON.stringify(payload))
  const signature = createHmac("sha256", secret).update(encodedPayload).digest()
  return `${encodedPayload}.${toBase64Url(signature)}`
}

function verifyToken(token: string, secret: string): SessionPayload | null {
  const [payloadPart, signaturePart] = token.split(".")

  if (!payloadPart || !signaturePart) {
    return null
  }

  const expectedSignature = createHmac("sha256", secret).update(payloadPart).digest()
  const actualSignature = fromBase64Url(signaturePart)

  if (expectedSignature.length !== actualSignature.length) {
    return null
  }

  if (!timingSafeEqual(expectedSignature, actualSignature)) {
    return null
  }

  const payload = JSON.parse(fromBase64Url(payloadPart).toString("utf8")) as SessionPayload

  if (payload.exp <= Date.now()) {
    return null
  }

  return payload
}

export function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex")
  const iterations = 210_000
  const derivedKey = pbkdf2Sync(password, salt, iterations, 64, "sha512").toString("hex")
  return `pbkdf2$sha512$${iterations}$${salt}$${derivedKey}`
}

function verifyPasswordHash(password: string, storedHash: string) {
  const parts = storedHash.split("$")

  if (parts.length !== 5 || parts[0] !== "pbkdf2") {
    return false
  }

  const [, algorithm, iterationsValue, salt, expectedHash] = parts
  const iterations = Number(iterationsValue)

  if (!Number.isFinite(iterations)) {
    return false
  }

  const actualHash = pbkdf2Sync(password, salt, iterations, 64, algorithm).toString("hex")
  return timingSafeEqual(Buffer.from(actualHash, "hex"), Buffer.from(expectedHash, "hex"))
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown"
  }

  return request.headers.get("x-real-ip") ?? "unknown"
}

function getUserAgent(request: NextRequest) {
  return request.headers.get("user-agent") ?? "unknown"
}

export function isAdminAccessKeyValid(accessKey: string | null) {
  const { routeSecret } = getAdminConfig()
  return Boolean(routeSecret && accessKey && safeCompare(accessKey, routeSecret))
}

export function isAdminAuthConfigured() {
  const { password, passwordHash, routeSecret, sessionSecret, username } = getAdminConfig()
  return Boolean(routeSecret && sessionSecret && username && (password || passwordHash))
}

export function validateAdminCredentials(username: string, password: string) {
  const config = getAdminConfig()

  if (!config.username || !safeCompare(username, config.username)) {
    return false
  }

  if (config.passwordHash) {
    return verifyPasswordHash(password, config.passwordHash)
  }

  if (config.password) {
    return safeCompare(password, config.password)
  }

  return false
}

export async function assertLoginAllowed(request: NextRequest) {
  const { blockMinutes, maxAttempts } = getAdminConfig()
  const ipHash = sha256(getClientIp(request))

  if (!isMongoConfigured()) {
    const attempts = global.__portfolioAdminAttempts ?? new Map<string, InMemoryAttempt>()
    global.__portfolioAdminAttempts = attempts
    const existing = attempts.get(ipHash)

    if (existing?.blockedUntil && existing.blockedUntil > Date.now()) {
      const secondsRemaining = Math.ceil((existing.blockedUntil - Date.now()) / 1000)
      throw new Error(`Too many login attempts. Try again in ${secondsRemaining} seconds.`)
    }

    if (existing?.count && existing.count >= maxAttempts) {
      existing.blockedUntil = Date.now() + blockMinutes * 60 * 1000
      existing.updatedAt = Date.now()
      attempts.set(ipHash, existing)
      throw new Error(`Too many login attempts. Try again in ${blockMinutes} minutes.`)
    }

    return
  }

  const database = await getDatabase()
  const collection = database.collection("admin_login_attempts")
  const existing = await collection.findOne<{ blockedUntil?: Date; count: number; firstAttemptAt: Date }>({ _id: ipHash })

  if (existing?.blockedUntil && existing.blockedUntil.getTime() > Date.now()) {
    const secondsRemaining = Math.ceil((existing.blockedUntil.getTime() - Date.now()) / 1000)
    throw new Error(`Too many login attempts. Try again in ${secondsRemaining} seconds.`)
  }

  if (existing?.count && existing.count >= maxAttempts) {
    await collection.updateOne(
      { _id: ipHash },
      {
        $set: {
          blockedUntil: new Date(Date.now() + blockMinutes * 60 * 1000),
          updatedAt: new Date(),
        },
      },
    )
    throw new Error(`Too many login attempts. Try again in ${blockMinutes} minutes.`)
  }
}

export async function recordFailedLogin(request: NextRequest) {
  const ipHash = sha256(getClientIp(request))

  if (!isMongoConfigured()) {
    const attempts = global.__portfolioAdminAttempts ?? new Map<string, InMemoryAttempt>()
    global.__portfolioAdminAttempts = attempts
    const existing = attempts.get(ipHash)
    const now = Date.now()
    attempts.set(ipHash, {
      blockedUntil: existing?.blockedUntil,
      count: (existing?.count ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    })
    return
  }

  const database = await getDatabase()
  const collection = database.collection("admin_login_attempts")
  const now = new Date()

  await collection.updateOne(
    { _id: ipHash },
    {
      $set: {
        updatedAt: now,
      },
      $setOnInsert: {
        count: 0,
        createdAt: now,
        firstAttemptAt: now,
      },
      $inc: {
        count: 1,
      },
    },
    { upsert: true },
  )
}

export async function clearFailedLogins(request: NextRequest) {
  const ipHash = sha256(getClientIp(request))

  if (!isMongoConfigured()) {
    const attempts = global.__portfolioAdminAttempts ?? new Map<string, InMemoryAttempt>()
    global.__portfolioAdminAttempts = attempts
    attempts.delete(ipHash)
    return
  }

  const database = await getDatabase()
  const collection = database.collection("admin_login_attempts")
  await collection.deleteOne({ _id: ipHash })
}

export async function createAdminSession(request: NextRequest, username: string) {
  const config = getAdminConfig()

  if (!config.sessionSecret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.")
  }

  const sid = randomUUID()
  const expiresAt = new Date(Date.now() + config.sessionHours * 60 * 60 * 1000)
  const uaHash = sha256(getUserAgent(request))
  const ipHash = sha256(getClientIp(request))
  const now = new Date()

  if (isMongoConfigured()) {
    const database = await getDatabase()
    const sessions = database.collection<StoredSession>("admin_sessions")
    await sessions.insertOne({
      _id: sid,
      createdAt: now,
      expiresAt,
      ipHash,
      lastSeenAt: now,
      uaHash,
      user: username,
    })
  } else {
    const sessions = global.__portfolioAdminSessions ?? new Map<string, StoredSession>()
    global.__portfolioAdminSessions = sessions
    sessions.set(sid, {
      _id: sid,
      createdAt: now,
      expiresAt,
      ipHash,
      lastSeenAt: now,
      uaHash,
      user: username,
    })
  }

  const token = signToken(
    {
      exp: expiresAt.getTime(),
      sid,
      ua: uaHash,
      user: username,
    },
    config.sessionSecret,
  )

  return {
    expiresAt,
    token,
  }
}

export async function getAdminSession(request: NextRequest) {
  const config = getAdminConfig()
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value

  if (!config.sessionSecret || !token) {
    return null
  }

  const payload = verifyToken(token, config.sessionSecret)

  if (!payload) {
    return null
  }

  if (payload.ua !== sha256(getUserAgent(request))) {
    return null
  }

  let session: StoredSession | null = null

  if (isMongoConfigured()) {
    const database = await getDatabase()
    const sessions = database.collection<StoredSession>("admin_sessions")
    session = await sessions.findOne({ _id: payload.sid })
    if (session) {
      await sessions.updateOne(
        { _id: payload.sid },
        {
          $set: {
            lastSeenAt: new Date(),
          },
        },
      )
    }
  } else {
    const sessions = global.__portfolioAdminSessions ?? new Map<string, StoredSession>()
    global.__portfolioAdminSessions = sessions
    session = sessions.get(payload.sid) ?? null

    if (session) {
      session.lastSeenAt = new Date()
      sessions.set(payload.sid, session)
    }
  }

  if (!session) {
    return null
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    if (isMongoConfigured()) {
      const database = await getDatabase()
      const sessions = database.collection<StoredSession>("admin_sessions")
      await sessions.deleteOne({ _id: payload.sid })
    } else {
      const sessions = global.__portfolioAdminSessions ?? new Map<string, StoredSession>()
      global.__portfolioAdminSessions = sessions
      sessions.delete(payload.sid)
    }
    return null
  }

  return session
}

export async function clearAdminSession(token: string | undefined) {
  const config = getAdminConfig()

  if (!token || !config.sessionSecret) {
    return
  }

  const payload = verifyToken(token, config.sessionSecret)

  if (!payload) {
    return
  }

  if (isMongoConfigured()) {
    const database = await getDatabase()
    const sessions = database.collection<StoredSession>("admin_sessions")
    await sessions.deleteOne({ _id: payload.sid })
    return
  }

  const sessions = global.__portfolioAdminSessions ?? new Map<string, StoredSession>()
  global.__portfolioAdminSessions = sessions
  sessions.delete(payload.sid)
}
