// app/api/saveChat/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// write chat log
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("data"); // database name
    const collection = db.collection("chat-log"); // collection name

    const { chatId, sender, message, sentTime, direction } = await req.json();

    const chatDoc = {
      chatId,
      sender,
      message,
      sentTime,
      direction,
      createdAt: new Date(), // server adds its own timestamp
    };
    const result = await collection.insertOne(chatDoc);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// read all chat log
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("chatbot");
    const collection = db.collection("logs");

    const chats = await collection.find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(chats);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
