import { EmbeddingsList } from "@pinecone-database/pinecone";

export function isValidEmbedding(embeddings: EmbeddingsList) {
  if (embeddings.length === 0 || !embeddings[0].values) {
    console.log("Query is empty or no embedding found");
    return false;
  }

  return true;
}
