import { NextRequest, NextResponse } from "next/server"
export const runtime = "nodejs"
export async function POST(request: NextRequest) {
  const backend = process.env.BACKEND_URL || "http://127.0.0.1:8000"
  try {
    const response = await fetch(`${backend}/api/analyze`, {
      method: "POST",
      body: await request.formData(),
      signal: AbortSignal.timeout(120000),
      cache: "no-store",
    })
    return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ detail: "Backend unavailable or request timed out. Check the Python API." }, { status: 502 })
  }
}
