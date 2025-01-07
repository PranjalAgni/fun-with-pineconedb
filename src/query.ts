// add more querying logic
// happy new year it was good 2024 🚀💚✨
// read the deffered query in SQL
// write more app code 

import { pc } from "./pinecone";
import { isValidEmbedding } from "./utils/embeddings";
import {
  pineconeIndex,
  pineconeModel,
  pineconeNamespace,
} from "./utils/settings";

export async function queryPinecone(query: string[]) {
  // Convert the query into a numerical vector that Pinecone can search with
  const queryEmbedding = await pc.inference.embed(pineconeModel, query, {
    inputType: "query",
  });

  const index = pc.Index(pineconeIndex);

  if (!isValidEmbedding(queryEmbedding)) {
    return;
  }

  // Search the index for the three most similar vectors
  const queryResponse = await index.namespace(pineconeNamespace).query({
    topK: 3,
    vector: queryEmbedding[0].values!,
    includeValues: false,
    includeMetadata: true,
  });

  return queryResponse;
}
