import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, collections } from "@/lib/mongodb"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if user exists
    const user = await db.collection(collections.users).findOne({ email })
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ message: "If an account with that email exists, we've sent a reset link." })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to user
    await db.collection(collections.users).updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        },
      },
    )

    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken)
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError)
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
    }

    return NextResponse.json({ message: "If an account with that email exists, we've sent a reset link." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
