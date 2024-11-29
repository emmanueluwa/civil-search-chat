import { Message } from "ai/react";
import { Pinecone } from "@pinecone-database/pinecone";
import { queryPineConeVectorStore } from "@/utils";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const google = createGoogleGenerativeAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GEMINI_API_KEY!,
});
const model = google("gemini-1.5-pro-latest");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function POST(req: Request) {
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
  const finalPrompt = `Here is a summary of the concrete structural failure case study, and a user query. Go through the case 
  study and answer the user query. 
  Ensure the response is factually accurate, demonstrates a thorough understanding of the query topic and the case study.
  Before answering you may enrich your knowledge by going through the provided structural findings.
  Do not include any concrete design rules if it is not relevant to the case study.
  
  \n\n**Structural Failure document summary:** \n${documentData}.
  \n**end of case study**
  
  \n\n**User Query:**\n${userQuestion}?
  \n**end of user query**
  
  \n\n**Generic Structural findings:**
  \n\n${retrievals},
  \n\n**end if generic structural findings**
  
  \n\nProvide thorough justification for your answer.
  \n\n**Answer:**
  `;

  //get stream from gemini api
  //send back to client with stream function
  const result = await streamText({
    model: model,
    prompt: finalPrompt,
  });

  return result.toDataStreamResponse();
}
