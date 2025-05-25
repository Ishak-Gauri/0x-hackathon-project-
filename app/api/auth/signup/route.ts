import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase, collections } from "@/lib/mongodb"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  console.log("=== SIGNUP API ROUTE STARTED ===")

  try {
    // Parse request body
    console.log("1. Parsing request body...")
    const body = await request.json()
    console.log("Request body parsed successfully:", {
      name: body.name,
      email: body.email,
      studentId: body.studentId,
      department: body.department,
      year: body.year,
    })

    const { name, email, password, studentId, department, year } = body

    // Validate required fields
    console.log("2. Validating required fields...")
    if (!name || !email || !password) {
      console.log("❌ Missing required fields")
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate email format
    console.log("3. Validating email format...")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format")
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    console.log("4. Validating password strength...")
    if (password.length < 6) {
      console.log("❌ Password too short")
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check environment variables
    console.log("5. Checking environment variables...")
    if (!process.env.MONGODB_URI) {
      console.log("❌ MONGODB_URI not found in environment variables")
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 })
    }
    console.log("✅ MONGODB_URI found")

    // Connect to database
    console.log("6. Connecting to database...")
    let db
    try {
      db = await getDatabase()
      console.log("✅ Database connected successfully")
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: process.env.NODE_ENV === "development" ? dbError.message : undefined,
        },
        { status: 500 },
      )
    }

    // Check if user already exists
    console.log("7. Checking if user exists...")
    let existingUser
    try {
      const query = {
        $or: [{ email: email.toLowerCase() }, ...(studentId ? [{ studentId }] : [])],
      }
      console.log("Query:", query)
      existingUser = await db.collection(collections.users).findOne(query)
      console.log("User exists check completed:", existingUser ? "User found" : "No user found")
    } catch (queryError) {
      console.error("❌ Error checking existing user:", queryError)
      return NextResponse.json({ error: "Database query error" }, { status: 500 })
    }

    if (existingUser) {
      console.log("❌ User already exists")
      return NextResponse.json({ error: "User with this email or student ID already exists" }, { status: 400 })
    }

    // Hash password
    console.log("8. Hashing password...")
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 12)
      console.log("✅ Password hashed successfully")
    } catch (hashError) {
      console.error("❌ Password hashing failed:", hashError)
      return NextResponse.json({ error: "Password processing error" }, { status: 500 })
    }

    // Create user object
    console.log("9. Creating user object...")
    const user = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      studentId: studentId?.trim() || null,
      department: department || null,
      year: year || null,
      skills: [],
      interests: [],
      projectAreas: [],
      bio: "",
      avatar: "",
      isOnline: false,
      lastSeen: new Date(),
      connections: 0,
      posts: 0,
      views: 0,
      location: "",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      achievements: [],
      mutualConnections: [],
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    console.log("✅ User object created")

    // Insert user into database
    console.log("10. Inserting user into database...")
    let result
    try {
      result = await db.collection(collections.users).insertOne(user)
      console.log("✅ User inserted successfully:", result.insertedId)
    } catch (insertError) {
      console.error("❌ User insertion failed:", insertError)
      return NextResponse.json(
        {
          error: "Failed to create user account",
          details: process.env.NODE_ENV === "development" ? insertError.message : undefined,
        },
        { status: 500 },
      )
    }

    // Send welcome email (optional)
    console.log("11. Attempting to send welcome email...")
    try {
      if (process.env.RESEND_API_KEY) {
        await sendWelcomeEmail(email, name)
        console.log("✅ Welcome email sent")
      } else {
        console.log("⚠️ RESEND_API_KEY not configured, skipping email")
      }
    } catch (emailError) {
      console.error("⚠️ Failed to send welcome email (non-critical):", emailError)
      // Don't fail the signup if email fails
    }

    console.log("=== SIGNUP COMPLETED SUCCESSFULLY ===")
    return NextResponse.json(
      {
        message: "User created successfully",
        userId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("=== SIGNUP API ERROR ===")
    console.error("Error type:", error.constructor.name)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)

    // Specific error handling
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    if (error.message?.includes("MONGODB_URI")) {
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 })
    }

    if (error.message?.includes("network") || error.message?.includes("connection")) {
      return NextResponse.json({ error: "Network connection error" }, { status: 500 })
    }

    return NextResponse.json(
      {
        error: "Internal server error. Please try again.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
