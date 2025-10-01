import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("data"); 
    const collection = db.collection("chat-log"); 

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    const chatLogs = await collection
      .find({ chatId: String(chatId) })
      .sort({ createdAt: 1 }) // safer than sentTime string
      .toArray();

    // normalize for frontend
    const normalized = chatLogs.map(log => ({
      message: log.message,
      sentTime: log.sentTime,
      sender: log.sender,
      direction: log.direction || (log.sender === "User" ? "outgoing" : "incoming")
    }));

    return NextResponse.json(normalized);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
