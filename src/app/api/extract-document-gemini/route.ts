import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const prompt = `Attached is a case study of a structural failure. Go over the case study and identify the problem and how it could have been avoided.
    Then summarize in 70 words. You may increase the word limit if the case study has multiple pages. Make sure to include numerical values and key details from the 
    case study, including the case study title. ## Summary: `;

export async function POST(req: Request, res: Response) {
  const { base64 } = await req.json();

  const filePart = fileToGenerativePart(base64);

  const generatedContent = await model.generateContent([prompt, filePart]);
  console.log(generatedContent);

  return new Response("got here", { status: 200 });
}

function fileToGenerativePart(imageData: string) {
  return {
    inlineData: {
      data: imageData.split(",")[1],
      mimeType: imageData.substring(
        imageData.indexOf(":") + 1,
        imageData.lastIndexOf(";")
      ),
    },
  };
}
