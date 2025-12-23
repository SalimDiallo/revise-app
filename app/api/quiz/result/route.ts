import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authConfig";
import prisma from "@/lib/prisma";
import { z } from "zod";

const resultSchema = z.object({
  quizId: z.string(),
  score: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
  duration: z.number().int().optional(), // en secondes
  mode: z.enum(["normal", "timed", "revision"]).default("normal"),
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        answer: z.string(),
        isCorrect: z.boolean(),
        timeSpent: z.number().int().optional(),
      })
    )
    .optional(),
});

// POST - Enregistrer un résultat de quiz
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const data = resultSchema.parse(body);

    const percentage = (data.score / data.totalQuestions) * 100;

    const result = await prisma.quizResult.create({
      data: {
        quizId: data.quizId,
        userId: session.user.id,
        score: data.score,
        totalQuestions: data.totalQuestions,
        percentage,
        duration: data.duration,
        mode: data.mode,
        answers: data.answers
          ? {
              create: data.answers.map((a) => ({
                questionId: a.questionId,
                answer: a.answer,
                isCorrect: a.isCorrect,
                timeSpent: a.timeSpent,
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erreur POST /api/quiz/result:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET - Récupérer les résultats d'un quiz
export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");

    const where: any = { userId: session.user.id };
    if (quizId) {
      where.quizId = quizId;
    }

    const results = await prisma.quizResult.findMany({
      where,
      orderBy: { completedAt: "desc" },
      take: 20,
      include: {
        quiz: {
          select: { title: true },
        },
      },
    });

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
