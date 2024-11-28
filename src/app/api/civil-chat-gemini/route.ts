import { Message } from "ai/react";
import { Pinecone } from "@pinecone-database/pinecone";
import { queryPineConeVectorStore } from "@/utils";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function POST(req: Request, res: Response) {
  const reqBody = await req.json();
  console.log(reqBody);

  const messages: Message[] = reqBody.messages;
  const userQuestion = messages[messages.length - 1].content;
  const documentData = reqBody.data.documentData;

  const searchQuery = `Represent this sentence for searching relevant passages: Concrete structural failure document says: \n${documentData} \n\n ${userQuestion}`;

  //query vector store
  //get rag retrievals
  const retrievals = await queryPineConeVectorStore(
    pc,
    "index-ein",
    "namingspace",
    searchQuery
  );

  //create prompt
  //hit gemini api

  //get stream from gemini api
  //send back to client with stream function

  return new Response("csws", { status: 200 });
}
