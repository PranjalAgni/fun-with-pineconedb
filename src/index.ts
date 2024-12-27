import { pc, generateEmbeddings, upsertData } from "./pinecone";
import { queryPinecone } from "./query";
import { getTextById, KNOWLEDGE_DATA, QUERY_PC } from "./utils/data";
import { pineconeIndex } from "./utils/settings";

async function run() {
  // Create a serverless index
  // await pc.createIndex({
  //   name: pineconeIndex,
  //   dimension: 1024,
  //   metric: "cosine",
  //   spec: {
  //     serverless: {
  //       cloud: "aws",
  //       region: "us-east-1",
  //     },
  //   },
  // });
  // await generateEmbeddings(KNOWLEDGE_DATA);

  const embeddings = await generateEmbeddings(KNOWLEDGE_DATA);
  await upsertData(embeddings, KNOWLEDGE_DATA);
  const result = await queryPinecone(QUERY_PC);
  if (!result || result.matches.length === 0) {
    console.log("No matches found");
  } else {
    const matchesId = result.matches.map((m) => m.id);
    const scores = result.matches.map((m) => m.score);
    console.log(getTextById(matchesId));
    console.log(scores);
  }
}

run();
