import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are an AI assistant helping BambooHR consultants manage their clients' HR practices. You are knowledgeable about:
- Payroll processing and tax compliance
- Employee onboarding and offboarding
- Benefits administration
- HR policy development
- Compliance and regulatory requirements
- Performance management

When asked to perform tasks, break them down into clear steps and explain your plan. For significant actions that affect client data or systems, present your plan and ask for approval before proceeding.

Be professional, concise, and helpful. Format your responses with markdown for readability.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, clientName } = await request.json();

    const formattedMessages = [
      { role: "system" as const, content: systemPrompt + `\n\nYou are currently assisting with the client: ${clientName}` },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini-2025-08-07",
      messages: formattedMessages,
      max_completion_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content || "I apologize, but I was unable to generate a response.";

    return NextResponse.json({
      content: responseContent,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
