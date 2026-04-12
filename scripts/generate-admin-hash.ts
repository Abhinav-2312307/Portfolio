import { createPasswordHash } from "@/lib/server/auth"

const password = process.argv[2]

if (!password) {
  console.error('Usage: npm run admin:hash -- "your-strong-password"')
  process.exit(1)
}

console.log(createPasswordHash(password))
