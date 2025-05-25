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

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Get messages for the conversation
    const messages = await db
      .collection(collections.messages)
      .find({ conversationId: new ObjectId(conversationId) })
      .sort({ createdAt: 1 })
      .toArray()

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { conversationId, content, type = "text" } = await request.json()

    if (!conversationId || !content) {
      return NextResponse.json({ error: "Conversation ID and content are required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Create new message
    const message = {
      conversationId: new ObjectId(conversationId),
      senderId: new ObjectId(session.user.id),
      content,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(collections.messages).insertOne(message)

    // Update conversation's last message
    await db.collection(collections.conversations).updateOne(
      { _id: new ObjectId(conversationId) },
      {
        $set: {
          lastMessage: content,
          lastMessageAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: { ...message, _id: result.insertedId } }, { status: 201 })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
