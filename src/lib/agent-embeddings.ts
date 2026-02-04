import OpenAI from "openai";
import { Agent } from "@/types/agent";
import fs from "fs";
import path from "path";

// Embedding model to use
const EMBEDDING_MODEL = "text-embedding-3-small";

// Lazy-load OpenAI client
let openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Cache file location
const CACHE_FILE_PATH = path.join(
  process.cwd(),
  "src/data/agent-embeddings.json"
);

/**
 * Embedding cache structure
 */
export interface EmbeddingCache {
  version: string;
  model: string;
  generatedAt: string;
  embeddings: Record<string, number[]>;
}

/**
 * Agent classification result
 */
export interface ClassificationResult {
  agentId: string | null;
  confidence: number;
  topMatches: Array<{
    agentId: string;
    agentName: string;
    confidence: number;
  }>;
}

/**
 * Generate text for embedding from agent metadata
 */
export function getAgentEmbeddingText(agent: Agent): string {
  return `${agent.name}. ${agent.description}`;
}

/**
 * Generate embeddings for all agents
 */
export async function generateAgentEmbeddings(
  agents: Agent[]
): Promise<Record<string, number[]>> {
  const embeddings: Record<string, number[]> = {};

  // Batch process all agents
  const texts = agents.map((agent) => getAgentEmbeddingText(agent));
  const agentIds = agents.map((agent) => agent.id);

  console.log(`Generating embeddings for ${agents.length} agents...`);

  try {
    const response = await getOpenAIClient().embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
    });

    // Map embeddings to agent IDs
    response.data.forEach((item, index) => {
      embeddings[agentIds[index]] = item.embedding;
    });

    console.log(`Successfully generated ${Object.keys(embeddings).length} embeddings`);
    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}

/**
 * Save embeddings to cache file
 */
export async function saveEmbeddingsCache(
  embeddings: Record<string, number[]>
): Promise<void> {
  const cache: EmbeddingCache = {
    version: "1.0",
    model: EMBEDDING_MODEL,
    generatedAt: new Date().toISOString(),
    embeddings,
  };

  const dir = path.dirname(CACHE_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2));
  console.log(`Embeddings cache saved to ${CACHE_FILE_PATH}`);
}

/**
 * Load embeddings from cache file
 */
export function loadEmbeddingsCache(): Record<string, number[]> | null {
  try {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
      console.warn(`Embeddings cache not found at ${CACHE_FILE_PATH}`);
      return null;
    }

    const fileContent = fs.readFileSync(CACHE_FILE_PATH, "utf-8");
    const cache: EmbeddingCache = JSON.parse(fileContent);

    console.log(
      `Loaded ${Object.keys(cache.embeddings).length} agent embeddings from cache`
    );
    return cache.embeddings;
  } catch (error) {
    console.error("Error loading embeddings cache:", error);
    return null;
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Classify a query and return the best matching agent
 */
export async function classifyQuery(
  query: string,
  agents: Agent[],
  agentEmbeddings: Record<string, number[]>,
  threshold: number = 0.6
): Promise<ClassificationResult> {
  // Generate embedding for the query
  const queryEmbedding = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
  });

  const queryVector = queryEmbedding.data[0].embedding;

  // Calculate similarity with each agent
  const similarities: Array<{
    agentId: string;
    agentName: string;
    confidence: number;
  }> = [];

  for (const agent of agents) {
    const agentEmbedding = agentEmbeddings[agent.id];
    if (!agentEmbedding) {
      console.warn(`No embedding found for agent: ${agent.id}`);
      continue;
    }

    const similarity = cosineSimilarity(queryVector, agentEmbedding);
    similarities.push({
      agentId: agent.id,
      agentName: agent.name,
      confidence: similarity,
    });
  }

  // Sort by confidence descending
  similarities.sort((a, b) => b.confidence - a.confidence);

  // Get top 3 matches
  const topMatches = similarities.slice(0, 3);

  // Return best match if confidence exceeds threshold
  const bestMatch = topMatches[0];
  const agentId = bestMatch.confidence >= threshold ? bestMatch.agentId : null;

  return {
    agentId,
    confidence: bestMatch.confidence,
    topMatches,
  };
}

/**
 * Adjust threshold for short queries
 */
export function getAdjustedThreshold(query: string, baseThreshold: number): number {
  const wordCount = query.trim().split(/\s+/).length;

  // Increase threshold for very short queries
  if (wordCount < 5) {
    return Math.min(baseThreshold + 0.15, 0.85);
  }

  return baseThreshold;
}
