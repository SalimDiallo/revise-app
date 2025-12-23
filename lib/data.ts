import { string, z } from "zod";
import prisma from "./prisma";

export const QuestionScheme = z.object({
  question: z.string(),
  options: z.string().array(),
  correctAnswer: z.string(),
  explication: z.string().optional(),
});

export type QuizQuestion = z.infer<typeof QuestionScheme>;

export const userCountQuizz = async (id: string) => {
  const countUserNumberQuizz = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      usageMax: true,
    },
  });

  return countUserNumberQuizz;
};
