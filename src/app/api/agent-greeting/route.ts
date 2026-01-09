import { NextRequest, NextResponse } from "next/server";
import { loadAgentPrompt } from "@/lib/prompt-loader";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const agentId = searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json(
      { error: "agentId is required" },
      { status: 400 }
    );
  }

  const prompt = loadAgentPrompt(agentId);

  if (!prompt) {
    return NextResponse.json(
      { greeting: null },
      { status: 200 }
    );
  }

  return NextResponse.json({
    greeting: prompt.greeting,
  });
}
