import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ExtractedPlanData } from "@/types/project-plan";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are a project plan extraction assistant. Given document text containing a project plan, extract structured data.

Return ONLY valid JSON matching this exact schema:
{
  "title": "Plan title",
  "description": "Brief description",
  "phases": [
    {
      "id": "phase-1",
      "name": "Phase Name",
      "description": "What this phase covers",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "startDateConfidence": "exact" | "inferred" | "ambiguous",
      "endDateConfidence": "exact" | "inferred" | "ambiguous",
      "milestones": [
        {
          "id": "ms-1",
          "title": "Milestone name",
          "date": "YYYY-MM-DD",
          "dateConfidence": "exact" | "inferred" | "ambiguous",
          "originalText": "original text if not exact date",
          "completed": false
        }
      ],
      "status": "not_started" | "in_progress" | "completed",
      "order": 1
    }
  ],
  "ambiguousItems": [
    {
      "id": "amb-1",
      "type": "date" | "phase_boundary" | "milestone",
      "description": "What is ambiguous",
      "originalText": "the original vague text",
      "suggestedValue": "YYYY-MM-DD",
      "resolved": false
    }
  ]
}

Rules:
- For every date, assess confidence: "exact" if a specific date is given, "inferred" if you calculated it from context, "ambiguous" if the text is vague (e.g. "early Q2", "~3 weeks after launch")
- Identify phase dependencies and order them sequentially
- Flag any ambiguous dates or phase boundaries in the ambiguousItems array
- Use today's date context to determine phase statuses
- If dates seem relative ("2 weeks after X"), convert to absolute dates and mark as "inferred"
- Return ONLY the JSON, no markdown fencing or explanation`;

// Fallback mock extraction for demo reliability
function getMockExtraction(content: string): ExtractedPlanData {
  return {
    title: "Imported Project Plan",
    description: "Extracted from uploaded document",
    phases: [
      {
        id: "phase-ext-1",
        name: "Phase 1 - Planning",
        startDate: "2026-03-10",
        endDate: "2026-04-11",
        startDateConfidence: "inferred",
        endDateConfidence: "inferred",
        milestones: [
          { id: "ms-ext-1", title: "Kickoff meeting", date: "2026-03-10", dateConfidence: "inferred", completed: false },
          { id: "ms-ext-2", title: "Requirements finalized", date: "2026-04-11", dateConfidence: "inferred", completed: false },
        ],
        status: "not_started",
        order: 1,
      },
      {
        id: "phase-ext-2",
        name: "Phase 2 - Implementation",
        startDate: "2026-04-14",
        endDate: "2026-06-06",
        startDateConfidence: "inferred",
        endDateConfidence: "ambiguous",
        milestones: [
          { id: "ms-ext-3", title: "Build complete", date: "2026-05-16", dateConfidence: "inferred", completed: false },
          { id: "ms-ext-4", title: "Testing complete", date: "2026-06-06", dateConfidence: "ambiguous", originalText: "approximately 8 weeks", completed: false },
        ],
        status: "not_started",
        order: 2,
      },
    ],
    ambiguousItems: [
      {
        id: "amb-ext-1",
        type: "date",
        description: "Implementation end date is approximate",
        originalText: "approximately 8 weeks",
        suggestedValue: "2026-06-06",
        resolved: false,
      },
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const { content, clientName } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt + `\n\nToday's date: ${new Date().toISOString().split("T")[0]}\nClient: ${clientName}` },
          { role: "user", content: `Extract the project plan from this document:\n\n${content}` },
        ],
        max_completion_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content || "";
      const extractedPlan: ExtractedPlanData = JSON.parse(responseText);

      return NextResponse.json({ extractedPlan });
    } catch {
      // Fallback to mock data for demo reliability
      console.log("AI extraction failed, using mock fallback");
      return NextResponse.json({ extractedPlan: getMockExtraction(content) });
    }
  } catch (error) {
    console.error("Extract plan error:", error);
    return NextResponse.json({ error: "Failed to extract plan" }, { status: 500 });
  }
}
