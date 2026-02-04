import { NextRequest, NextResponse } from "next/server";
import { mockAgents } from "@/data/agents-data";
import {
  loadEmbeddingsCache,
  classifyQuery,
  getAdjustedThreshold,
} from "@/lib/agent-embeddings";

// Cache embeddings in memory for better performance
let cachedEmbeddings: Record<string, number[]> | null = null;

function getEmbeddings(): Record<string, number[]> {
  if (!cachedEmbeddings) {
    cachedEmbeddings = loadEmbeddingsCache();
    if (!cachedEmbeddings) {
      throw new Error("Embeddings cache not found. Run: npm run generate-embeddings");
    }
  }
  return cachedEmbeddings;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, threshold = 0.6 } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query parameter is required and must be a string" },
        { status: 400 }
      );
    }

    // Load embeddings
    const embeddings = getEmbeddings();

    // Adjust threshold based on query length
    const adjustedThreshold = getAdjustedThreshold(query, threshold);

    console.log(`Classifying query: "${query}"`);
    console.log(`Threshold: ${adjustedThreshold}`);

    // Classify the query
    const result = await classifyQuery(
      query,
      mockAgents,
      embeddings,
      adjustedThreshold
    );

    console.log(`Best match: ${result.agentId || "none"} (confidence: ${result.confidence.toFixed(3)})`);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error classifying agent:", error);

    // Return graceful fallback
    return NextResponse.json({
      agentId: null,
      confidence: 0,
      topMatches: [],
      error: "Classification failed",
    }, { status: 500 });
  }
}
