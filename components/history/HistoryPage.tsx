"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Loader2,
  Plus,
  Search,
  Target,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  category: { name: string; color: string } | null;
  questions: { id: string }[];
  results: Array<{
    score: number;
    totalQuestions: number;
    percentage: number;
    completedAt: string;
  }>;
  _count: { results: number };
}

export default function HistoryPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const params = new URLSearchParams({ limit: "50" });
        if (selectedCategory) {
          params.append("categoryId", selectedCategory);
        }
        const response = await fetch(`/api/quiz/history?${params}`);
        if (response.ok) {
          const data = await response.json();
          setQuizzes(data);
        }
      } catch (error) {
        console.error("Erreur chargement historique:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [selectedCategory]);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Historique</h1>
          <p className="text-muted-foreground mt-1">
            Retrouvez tous vos quiz sauvegardés
          </p>
        </div>
        <Link href="/quizz">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau quiz
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un quiz..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Quiz list */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">
            {searchQuery ? "Aucun résultat" : "Aucun quiz sauvegardé"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Essayez avec d'autres mots-clés"
              : "Créez et sauvegardez des quiz pour les retrouver ici"}
          </p>
          {!searchQuery && (
            <Link href="/quizz">
              <Button>Créer mon premier quiz</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz }: { quiz: Quiz }) {
  const lastResult = quiz.results[0];
  const questionsCount = quiz.questions.length;

  return (
    <div className="p-4 rounded-xl border bg-card hover:bg-secondary/30 transition-colors group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Category indicator */}
          <div
            className={cn(
              "w-1 h-12 rounded-full",
              quiz.category ? "" : "bg-muted"
            )}
            style={{
              backgroundColor: quiz.category?.color || undefined,
            }}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{quiz.title}</h3>
            <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Target className="h-3.5 w-3.5 mr-1" />
                {questionsCount} questions
              </span>
              <span className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {quiz._count.results} tentatives
              </span>
              <span className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {new Date(quiz.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </div>

        {/* Last result + actions */}
        <div className="flex items-center space-x-4">
          {lastResult && (
            <div className="text-right hidden sm:block">
              <div className="text-lg font-semibold">
                {Math.round(lastResult.percentage)}%
              </div>
              <div className="text-xs text-muted-foreground">Dernier score</div>
            </div>
          )}

          <Link href={`/quizz/play/${quiz.id}`}>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              Rejouer
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
