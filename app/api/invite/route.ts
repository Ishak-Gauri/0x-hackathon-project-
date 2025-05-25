import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { sendInvitationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, message } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    try {
      await sendInvitationEmail(email, session.user.email, message)
      return NextResponse.json({ message: "Invitation sent successfully" })
    } catch (emailError) {
      console.error("Failed to send invitation email:", emailError)
      return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 })
    }
  } catch (error) {
    console.error("Invite error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
