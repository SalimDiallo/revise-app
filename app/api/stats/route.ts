import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authConfig";
import prisma from "@/lib/prisma";

// GET - Récupérer les statistiques de l'utilisateur
export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;

    // Statistiques globales
    const [
      totalQuizzes,
      totalResults,
      avgScore,
      recentResults,
      categoryStats,
      weeklyProgress,
    ] = await Promise.all([
      // Nombre total de quiz créés
      prisma.quiz.count({ where: { userId } }),
      
      // Nombre total de quiz complétés
      prisma.quizResult.count({ where: { userId } }),
      
      // Score moyen
      prisma.quizResult.aggregate({
        where: { userId },
        _avg: { percentage: true },
      }),
      
      // 10 derniers résultats
      prisma.quizResult.findMany({
        where: { userId },
        orderBy: { completedAt: "desc" },
        take: 10,
        include: {
          quiz: {
            select: { title: true, category: { select: { name: true, color: true } } },
          },
        },
      }),
      
      // Stats par catégorie
      prisma.category.findMany({
        where: { userId },
        include: {
          quizzes: {
            include: {
              results: {
                select: { percentage: true },
              },
              _count: { select: { questions: true } },
            },
          },
        },
      }),
      
      // Progression hebdomadaire (7 derniers jours)
      prisma.quizResult.groupBy({
        by: ["completedAt"],
        where: {
          userId,
          completedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        _avg: { percentage: true },
        _count: true,
      }),
    ]);

    // Calculer les streaks (jours consécutifs d'activité)
    const allResults = await prisma.quizResult.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      select: { completedAt: true },
    });

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    const uniqueDays = new Set(
      allResults.map((r) => r.completedAt.toISOString().split("T")[0])
    );

    const sortedDays = Array.from(uniqueDays).sort().reverse();
    const today = new Date().toISOString().split("T")[0];

    for (let i = 0; i < sortedDays.length; i++) {
      const date = new Date(sortedDays[i]);
      const prevDate = i > 0 ? new Date(sortedDays[i - 1]) : null;

      if (i === 0) {
        // Vérifier si le dernier quiz était aujourd'hui ou hier
        const diffDays = Math.floor(
          (new Date(today).getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays <= 1) {
          tempStreak = 1;
        }
      }

      if (prevDate) {
        const diffDays = Math.floor(
          (prevDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          tempStreak++;
        } else {
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }

    bestStreak = Math.max(bestStreak, tempStreak);
    currentStreak = tempStreak;

    // Calculer les stats par catégorie
    const categoryStatsFormatted = categoryStats.map((cat) => {
      const allScores = cat.quizzes.flatMap((q) =>
        q.results.map((r) => r.percentage)
      );
      const avgCategoryScore =
        allScores.length > 0
          ? allScores.reduce((a, b) => a + b, 0) / allScores.length
          : 0;

      return {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        quizCount: cat.quizzes.length,
        avgScore: Math.round(avgCategoryScore),
      };
    });

    return NextResponse.json({
      overview: {
        totalQuizzes,
        totalCompleted: totalResults,
        avgScore: Math.round(avgScore._avg.percentage || 0),
        currentStreak,
        bestStreak,
      },
      recentResults: recentResults.map((r) => ({
        id: r.id,
        quizTitle: r.quiz.title,
        category: r.quiz.category,
        score: r.score,
        total: r.totalQuestions,
        percentage: Math.round(r.percentage),
        completedAt: r.completedAt,
        mode: r.mode,
      })),
      categoryStats: categoryStatsFormatted,
      weeklyProgress: weeklyProgress.map((day) => ({
        date: day.completedAt,
        avgScore: Math.round(day._avg.percentage || 0),
        count: day._count,
      })),
    });
  } catch (error: any) {
    console.error("Erreur GET /api/stats:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
