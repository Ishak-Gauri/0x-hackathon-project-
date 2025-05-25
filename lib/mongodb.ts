import { MongoClient, type Db } from "mongodb"

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

function getMongoClient(): Promise<MongoClient> {
  console.log("=== MONGODB CLIENT CONNECTION ===")

  // Only check for environment variable when actually connecting
  if (typeof window !== "undefined") {
    throw new Error("MongoDB client should not be used on the client side")
  }

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable is not set")
    console.log(
      "Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("MONGO")),
    )
    throw new Error("Please add your MongoDB URI to environment variables")
  }

  if (clientPromise) {
    console.log("✅ Reusing existing MongoDB client promise")
    return clientPromise
  }

  const uri = process.env.MONGODB_URI
  console.log("🔗 Connecting to MongoDB...")
  console.log(
    "URI format check:",
    uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://") ? "✅ Valid" : "❌ Invalid",
  )

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000, // Increased timeout
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  try {
    if (process.env.NODE_ENV === "development") {
      const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
      }

      if (!globalWithMongo._mongoClientPromise) {
        console.log("🔄 Creating new MongoDB client for development")
        client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
      }
      clientPromise = globalWithMongo._mongoClientPromise
    } else {
      console.log("🔄 Creating new MongoDB client for production")
      client = new MongoClient(uri, options)
      clientPromise = client.connect()
    }

    return clientPromise
  } catch (error) {
    console.error("❌ Error creating MongoDB client:", error)
    throw error
  }
}

export default getMongoClient

export async function getDatabase(): Promise<Db> {
  console.log("=== DATABASE CONNECTION ===")

  try {
    console.log("🔄 Getting MongoDB client...")
    const client = await getMongoClient()
    console.log("✅ MongoDB client connected successfully")

    console.log("🔄 Selecting database 'peerconnect'...")
    const db = client.db("peerconnect")
    console.log("✅ Database 'peerconnect' selected")

    // Test the connection
    console.log("🔄 Testing database connection...")
    await db.admin().ping()
    console.log("✅ Database ping successful")

    return db
  } catch (error) {
    console.error("❌ Database connection failed:")
    console.error("Error type:", error.constructor.name)
    console.error("Error message:", error.message)

    if (error.message?.includes("MONGODB_URI")) {
      throw new Error("Database configuration error: MONGODB_URI not found")
    }

    if (error.message?.includes("authentication")) {
      throw new Error("Database authentication failed: Check your MongoDB credentials")
    }

    if (error.message?.includes("network") || error.message?.includes("ENOTFOUND")) {
      throw new Error("Database network error: Cannot reach MongoDB server")
    }

    throw new Error(`Database connection failed: ${error.message}`)
  }
}

export const collections = {
  users: "users",
  messages: "messages",
  conversations: "conversations",
  connections: "connections",
  posts: "posts",
  notifications: "notifications",
}
