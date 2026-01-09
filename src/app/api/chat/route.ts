import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { loadAgentPrompt } from "@/lib/prompt-loader";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const defaultSystemPrompt = `You are an AI assistant helping BambooHR consultants manage their clients' HR practices. You are knowledgeable about:
- Payroll processing and tax compliance
- Employee onboarding and offboarding
- Benefits administration
- HR policy development
- Compliance and regulatory requirements
- Performance management

Be professional, concise, and helpful. Format your responses with markdown for readability.

ACTION PLANS:
For HIGH-STAKES actions that modify data or systems, you MUST create an action plan for user approval. High-stakes actions include:
- Running payroll
- Terminating employees
- Changing benefits
- Submitting tax forms
- Bulk data changes
- Any action that cannot be easily undone

When creating an action plan, use this exact format:
<action_plan>
title: Short action title
description: Brief description of what will happen
affected_count: Number (optional)
affected_label: Label like "employees" or "records" (optional)
estimated_time: Time estimate like "~5 min" (optional)
steps:
- Step 1 description
- Step 2 description
- Step 3 description
</action_plan>

Example:
<action_plan>
title: Run January Payroll
description: Process payroll for all active employees for the January pay period.
affected_count: 47
affected_label: employees
estimated_time: ~5 min
steps:
- Collect and validate employee hours and salary data
- Calculate gross pay, deductions, and net pay
- Process direct deposits and generate pay stubs
- Report and remit payroll taxes
</action_plan>

If the user asks to modify a pending plan, create a NEW action plan with the requested changes. The old plan will be automatically replaced.

Include a brief message before the action plan explaining what you're about to do.

ARTIFACTS:
When generating substantial content that would benefit from being displayed in a dedicated panel, wrap it in an artifact tag. Use artifacts for:
- Code blocks (5+ lines)
- Tables (3+ rows)
- Lists (5+ items)
- Documents/reports (structured content with headers)

Format: <artifact title="Descriptive Title" type="code|table|list|document" language="optional-for-code">content</artifact>

Examples:
- <artifact title="Employee Onboarding Checklist" type="list">...</artifact>
- <artifact title="Payroll Summary Report" type="document">...</artifact>
- <artifact title="Tax Calculation Script" type="code" language="python">...</artifact>
- <artifact title="Q4 Benefits Comparison" type="table">...</artifact>

Keep artifact titles concise but descriptive. You can include text before/after artifacts to provide context.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, clientName, agentId } = await request.json();

    // Load agent-specific prompt if agentId is provided
    let systemPrompt = defaultSystemPrompt;
    if (agentId) {
      const agentPrompt = loadAgentPrompt(agentId);
      if (agentPrompt?.systemPrompt) {
        systemPrompt = agentPrompt.systemPrompt;
      }
    }

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
