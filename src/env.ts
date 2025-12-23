import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().optional(),
    NEXTAUTH_SECRET: z.string(),
    // OAuth credentials optionnels
    GITHUB_SECRET: z.string().optional(),
    GITHUB_ID: z.string().optional(),
    GOOGLE_SECRET: z.string().optional(),
    GOOGLE_ID: z.string().optional(),
    // API IA - Groq est gratuit !
    GROQ_API_KEY: z.string(),
    // OpenAI optionnel (si vous voulez utiliser GPT en backup)
    OPENAI_KEY: z.string().optional(),
  },
  client: {},
  runtimeEnv: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    OPENAI_KEY: process.env.OPENAI_KEY,
  },
});
