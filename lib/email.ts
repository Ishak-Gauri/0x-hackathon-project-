import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const fromEmail = process.env.FROM_EMAIL || "noreply@peerconnect.com"
const companyName = process.env.COMPANY_NAME || "PeerConnect"

export async function sendWelcomeEmail(to: string, name: string) {
  console.log("=== SENDING WELCOME EMAIL ===")
  console.log("To:", to)
  console.log("Name:", name)

  if (!process.env.RESEND_API_KEY) {
    console.log("⚠️ RESEND_API_KEY not configured, skipping email")
    return
  }

  try {
    console.log("🔄 Sending email via Resend...")
    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Welcome to ${companyName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">Welcome to ${companyName}, ${name}!</h1>
          <p>Thank you for joining our student networking platform.</p>
          <p>You can now:</p>
          <ul>
            <li>Connect with fellow students</li>
            <li>Share your projects and achievements</li>
            <li>Collaborate on exciting opportunities</li>
            <li>Build your professional network</li>
          </ul>
          <p>Get started by completing your profile and connecting with other students!</p>
          <p>Best regards,<br>The ${companyName} Team</p>
        </div>
      `,
    })
    console.log("✅ Email sent successfully:", result)
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error)
    throw error
  }
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email")
    return
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">Reset Your Password</h1>
          <p>You requested to reset your password for your ${companyName} account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The ${companyName} Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error("Failed to send password reset email:", error)
    throw error
  }
}

export async function sendInvitationEmail(to: string, fromEmail: string, customMessage?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email")
    return
  }

  const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup`

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: `You're invited to join ${companyName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">You're Invited to ${companyName}!</h1>
          <p>${fromEmail} has invited you to join ${companyName}, a platform for student networking and collaboration.</p>
          ${customMessage ? `<p><em>"${customMessage}"</em></p>` : ""}
          <p>Join thousands of students who are:</p>
          <ul>
            <li>Building professional networks</li>
            <li>Collaborating on projects</li>
            <li>Sharing knowledge and experiences</li>
            <li>Finding study partners and mentors</li>
          </ul>
          <a href="${signupUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Join ${companyName}</a>
          <p>Best regards,<br>The ${companyName} Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error("Failed to send invitation email:", error)
    throw error
  }
}
