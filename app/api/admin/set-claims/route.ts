import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  if (!adminAuth) {
    return NextResponse.json({ error: "Admin SDK not configured on server" }, { status: 500 })
  }

  try {
    const { uid, role } = await request.json()
    if (!uid || !role) {
      return NextResponse.json({ error: "Missing uid or role" }, { status: 400 })
    }
    if (!["student", "faculty", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    await adminAuth.setCustomUserClaims(uid, { role })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[set-claims] Error:", error)
    return NextResponse.json({ error: "Failed to set claims" }, { status: 500 })
  }
}
