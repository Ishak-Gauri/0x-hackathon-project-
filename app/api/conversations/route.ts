import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getDatabase, collections } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()

    // Get conversations for the user
    const conversations = await db
      .collection(collections.conversations)
      .find({
        participants: new ObjectId(session.user.id),
      })
      .sort({ lastMessageAt: -1 })
      .toArray()

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Get conversations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { participantId } = await request.json()

    if (!participantId) {
      return NextResponse.json({ error: "Participant ID is required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if conversation already exists
    const existingConversation = await db.collection(collections.conversations).findOne({
      participants: {
        $all: [new ObjectId(session.user.id), new ObjectId(participantId)],
      },
    })

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation })
    }

    // Create new conversation
    const conversation = {
      participants: [new ObjectId(session.user.id), new ObjectId(participantId)],
      lastMessage: "",
      lastMessageAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(collections.conversations).insertOne(conversation)

    return NextResponse.json({ conversation: { ...conversation, _id: result.insertedId } }, { status: 201 })
  } catch (error) {
    console.error("Create conversation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
