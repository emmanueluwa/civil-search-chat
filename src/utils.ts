import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";
const inference = new HfInference(process.env.HUGGINGFACE_TOKEN!);

export async function queryPineConeVectorStore(
  client: Pinecone,
  indexName: string,
  namespace: string,
  searchQuery: string
): Promise<string> {
  /**
   *comparing vector to vector, search query will also be converted into embedding like with knowledge base
   *comparison will return top results
   *text attached as metadata to vector can then be unpacked

   *similarity search
   **/

  const hfOutput = await inference.featureExtraction({
    model: "mixedbread-ai/mxbai-embed-large-v1",
    inputs: searchQuery,
  });

  const queryEmbedding = Array.from(hfOutput);

  const index = client.Index(indexName);

  const queryResponse = await index.namespace(namespace).query({
    topK: 5,
    vector: queryEmbedding as any,
    includeMetadata: true,
    includeValues: false,
  });

  if (queryResponse.matches.length > 0) {
    const concatRetrievals = queryResponse.matches
      .map((match, index) => {
        return `\n Structural Finding ${index + 1}: \n ${
          match.metadata?.chunk
        }`;
      })
      .join(`\n\n`);
    console.log(concatRetrievals);

    return concatRetrievals;
  } else {
    return "<no_match>";
  }
}
