import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authConfig";
import prisma from "@/lib/prisma";
import { z } from "zod";

const saveQuizSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  sourceText: z.string().min(50),
  categoryId: z.string().optional(),
  questions: z.array(
    z.object({
      text: z.string(),
      options: z.array(z.string()),
      correctAnswer: z.string(),
      explication: z.string().optional(),
    })
  ),
});

// POST - Sauvegarder un quiz
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const data = saveQuizSchema.parse(body);

    const quiz = await prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        sourceText: data.sourceText,
        categoryId: data.categoryId,
        userId: session.user.id,
        questions: {
          create: data.questions.map((q, index) => ({
            text: q.text,
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            explication: q.explication,
            order: index,
          })),
        },
      },
      include: {
        questions: true,
        category: true,
      },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erreur POST /api/quiz/save:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
