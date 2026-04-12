import { Db, MongoClient } from "mongodb"

import { getMongoConfig, isMongoConfigured } from "@/lib/server/env"

declare global {
  // eslint-disable-next-line no-var
  var __portfolioMongoClientPromise: Promise<MongoClient> | undefined
}

async function createClient() {
  const { uri } = getMongoConfig()

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.")
  }

  const client = new MongoClient(uri)
  return client.connect()
}

export async function getMongoClient() {
  if (!isMongoConfigured()) {
    throw new Error("MongoDB is not configured.")
  }

  if (!global.__portfolioMongoClientPromise) {
    global.__portfolioMongoClientPromise = createClient()
  }

  return global.__portfolioMongoClientPromise
}

export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient()
  const { dbName } = getMongoConfig()
  return client.db(dbName)
}
