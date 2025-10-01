import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// write metadata for a new chat
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("data"); // database name
    const collection = db.collection("chats"); // collection name

    const { chatId, chatTitle } = await req.json();

    const chatDoc = {
      chatId,
      chatTitle,
      creationTime: new Date(), // server adds its own timestamp
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

// fetch all chats
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("data"); // database name
    const collection = db.collection("chats"); // collection name

    const chats = await collection.find({}).toArray();

    return NextResponse.json(chats);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}