// app/api/chat/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, model } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        input: prompt,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json({ error: err || "OpenAI error" }, { status: 500 });
    }

    const data = await resp.json();
    const text = data.output_text || data.output?.[0]?.content?.[0]?.text || "";

    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
