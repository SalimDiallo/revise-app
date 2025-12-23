"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Trophy, 
  Target, 
  Flame, 
  Calendar,
  BarChart3,
  BookOpen,
  Loader2
} from "lucide-react";

interface StatsData {
  overview: {
    totalQuizzes: number;
    totalCompleted: number;
    avgScore: number;
    currentStreak: number;
    bestStreak: number;
  };
  recentResults: Array<{
    id: string;
    quizTitle: string;
    category: { name: string; color: string } | null;
    score: number;
    total: number;
    percentage: number;
    completedAt: string;
    mode: string;
  }>;
  categoryStats: Array<{
    id: string;
    name: string;
    color: string;
    quizCount: number;
    avgScore: number;
  }>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) throw new Error("Erreur de chargement");
        const data = await response.json();
        setStats(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-lg font-medium mb-2">Pas encore de données</h2>
        <p className="text-muted-foreground">
          Complétez quelques quiz pour voir vos statistiques !
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Statistiques</h1>
        <p className="text-muted-foreground mt-1">
          Suivez votre progression et vos performances
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Quiz créés"
          value={stats.overview.totalQuizzes}
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="Quiz complétés"
          value={stats.overview.totalCompleted}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Score moyen"
          value={`${stats.overview.avgScore}%`}
          highlight={stats.overview.avgScore >= 70}
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Série actuelle"
          value={`${stats.overview.currentStreak} jours`}
          subValue={`Record: ${stats.overview.bestStreak} jours`}
        />
      </div>

      {/* Progress Chart Placeholder */}
      <div className="p-6 rounded-xl border bg-card">
        <h2 className="font-medium mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Progression cette semaine
        </h2>
        <div className="h-32 flex items-end justify-around gap-2">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => {
            const height = Math.random() * 100;
            return (
              <div key={day} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-foreground rounded-t transition-all duration-300"
                  style={{ height: `${height}%`, maxWidth: "40px" }}
                />
                <span className="text-xs text-muted-foreground mt-2">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Stats */}
      {stats.categoryStats.length > 0 && (
        <div className="p-6 rounded-xl border bg-card">
          <h2 className="font-medium mb-4">Performance par catégorie</h2>
          <div className="space-y-4">
            {stats.categoryStats.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({cat.quizCount} quiz)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full transition-all"
                      style={{ width: `${cat.avgScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {cat.avgScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Results */}
      {stats.recentResults.length > 0 && (
        <div className="p-6 rounded-xl border bg-card">
          <h2 className="font-medium mb-4 flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Résultats récents
          </h2>
          <div className="space-y-3">
            {stats.recentResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
              >
                <div className="flex items-center space-x-3">
                  {result.category && (
                    <div
                      className="w-2 h-8 rounded-full"
                      style={{ backgroundColor: result.category.color }}
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{result.quizTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(result.completedAt).toLocaleDateString("fr-FR")}
                      {result.mode !== "normal" && (
                        <span className="ml-2 px-1.5 py-0.5 rounded bg-secondary text-xs">
                          {result.mode === "timed" ? "Chrono" : "Révision"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{result.percentage}%</p>
                  <p className="text-xs text-muted-foreground">
                    {result.score}/{result.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  highlight?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl border bg-card">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary mb-3">
        {icon}
      </div>
      <div
        className={`text-2xl font-semibold ${
          highlight ? "text-green-600 dark:text-green-400" : ""
        }`}
      >
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {subValue && (
        <div className="text-xs text-muted-foreground mt-1">{subValue}</div>
      )}
    </div>
  );
}
