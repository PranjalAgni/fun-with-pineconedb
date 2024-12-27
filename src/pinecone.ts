import { EmbeddingsList, Pinecone } from "@pinecone-database/pinecone";
import {
  pineconeIndex,
  pineconeModel,
  pineconeNamespace,
} from "./utils/settings";
import { KNOWLEDGE_DATA } from "./utils/data";
import { isValidEmbedding } from "./utils/embeddings";

export const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
export const pcIndex = pc.index(pineconeIndex);

// generate embeddings for the data
export async function generateEmbeddings(data: any[]) {
  const embeddings = await pc.inference.embed(
    pineconeModel,
    data.map((d) => d.text),
    { inputType: "passage", truncate: "END" }
  );

  return embeddings;
}

// upsert data to the index
export async function upsertData(embeddings: EmbeddingsList, data: any[]) {
  if (!isValidEmbedding(embeddings)) {
    return;
  }

  // Prepare the records for upsert
  // Each contains an 'id', the embedding 'values', and the original text as 'metadata'
  const records = data.map((d, i) => ({
    id: d.id,
    values: embeddings[i].values!,
    metadata: { text: d.text },
  }));

  // Upsert the vectors into the index
  await pcIndex.namespace(pineconeNamespace).upsert(records);
}
