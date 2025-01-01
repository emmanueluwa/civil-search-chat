import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GEMINI_API_KEY: z.string().min(1),
    PINECONE_API_KEY: z.string().min(1),
    HUGGINGFACE_TOKEN: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
});
