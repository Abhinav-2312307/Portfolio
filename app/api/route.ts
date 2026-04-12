import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({
    service: "portfolio-api",
    status: "ok",
  })
}
