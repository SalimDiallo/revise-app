import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authConfig";
import prisma from "@/lib/prisma";

// GET - Récupérer l'historique des quiz
export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const categoryId = searchParams.get("categoryId");

    const quizzes = await prisma.quiz.findMany({
      where: {
        userId: session.user.id,
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
        questions: {
          select: { id: true },
        },
        results: {
          orderBy: { completedAt: "desc" },
          take: 1,
          select: {
            score: true,
            totalQuestions: true,
            percentage: true,
            completedAt: true,
          },
        },
        _count: {
          select: { results: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(quizzes);
  } catch (error: any) {
    console.error("Erreur GET /api/quiz/history:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
