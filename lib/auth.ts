import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getDatabase, collections } from "./mongodb"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Auth attempt for:", credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          console.log("Connecting to database for auth...")
          const db = await getDatabase()
          console.log("Database connected, searching for user...")

          const user = await db.collection(collections.users).findOne({
            email: credentials.email.toLowerCase(),
          })

          console.log("User found:", user ? "Yes" : "No")

          if (!user) {
            console.log("User not found in database")
            return null
          }

          console.log("Comparing passwords...")
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          console.log("Password valid:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

          console.log("Authentication successful")
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar || null,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
