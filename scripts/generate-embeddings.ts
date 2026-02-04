/**
 * Script to generate and cache embeddings for all agents
 * Run with: npx tsx scripts/generate-embeddings.ts
 */

import { mockAgents } from "../src/data/agents-data";
import {
  generateAgentEmbeddings,
  saveEmbeddingsCache,
} from "../src/lib/agent-embeddings";

async function main() {
  console.log("=== Agent Embeddings Generation ===\n");
  console.log(`Generating embeddings for ${mockAgents.length} agents...\n`);

  try {
    // Generate embeddings
    const embeddings = await generateAgentEmbeddings(mockAgents);

    // Save to cache file
    await saveEmbeddingsCache(embeddings);

    console.log("\n✅ Success! Embeddings generated and cached.");
    console.log(`\nGenerated embeddings for:`);
    Object.keys(embeddings).forEach((agentId) => {
      const agent = mockAgents.find((a) => a.id === agentId);
      console.log(`  - ${agent?.name} (${agentId})`);
    });
  } catch (error) {
    console.error("\n❌ Error generating embeddings:", error);
    process.exit(1);
  }
}

main();
