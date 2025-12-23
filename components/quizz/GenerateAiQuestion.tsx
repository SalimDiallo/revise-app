"use client";

import React, { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { QuizQuestion } from "@/lib/data";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, FileText, Loader2, Sparkles, CheckCircle, AlertCircle } from "lucide-react";

interface QuizResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: string;
}

const GenerateAiQuestions = ({ countMax }: { countMax: number }) => {
  const maxLength = 6000;
  const minLength = 50;
  const [text, setText] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const GenerateQuestionsWithAi = useMutation({
    mutationFn: async ({ content, questionCount }: { content: string; questionCount: number }) => {
      const response = await fetch("/api/quizz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, questionCount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la génération");
      }

      return response.json() as Promise<QuizResponse>;
    },
    onSuccess(data) {
      setErrorMessage(null);
      const content = data.choices[0]?.message?.content;
      if (content) {
        try {
          const parseData: QuizQuestion[] = JSON.parse(content);
          window.localStorage.setItem(
            "responseDataAi",
            JSON.stringify(parseData)
          );
          router.refresh();
        } catch (e) {
          setErrorMessage("Erreur de format de la réponse");
        }
      }
    },
    onError(error: Error) {
      setErrorMessage(error.message);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (countMax > 0 && text.length >= minLength) {
      GenerateQuestionsWithAi.mutate({ content: text, questionCount });
    }
  };

  const isValid = text.length >= minLength && text.length <= maxLength && countMax > 0;
  const progress = Math.min((text.length / maxLength) * 100, 100);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-foreground text-background mb-4">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Générer un quiz avec l&apos;IA
        </h1>
        <p className="text-muted-foreground mt-2">
          Collez votre texte et l&apos;IA créera des questions pour vous aider à réviser.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Propulsé par Llama 3.3 (gratuit)
        </p>
      </div>

      {/* Credit warning */}
      {countMax <= 0 && !GenerateQuestionsWithAi.isPending && (
        <div className="mb-6 p-4 rounded-lg border border-destructive/50 bg-destructive/5">
          <p className="text-sm text-center text-destructive font-medium">
            Vos crédits sont épuisés. Revenez demain pour en obtenir de nouveaux.
          </p>
        </div>
      )}

      {/* Success state */}
      {GenerateQuestionsWithAi.isSuccess && !errorMessage ? (
        <div className="p-8 rounded-xl border bg-card text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Quiz généré avec succès !</h3>
          <p className="text-muted-foreground mb-6">
            Vos questions sont prêtes. Commencez le quiz maintenant.
          </p>
          <Link href="/quizz/game">
            <Button size="lg">
              Commencer le quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : GenerateQuestionsWithAi.isPending ? (
        /* Loading state */
        <div className="p-8 rounded-xl border bg-card text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4 animate-pulse-subtle">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-lg font-medium mb-2">Génération en cours...</h3>
          <p className="text-muted-foreground">
            L&apos;IA analyse votre texte et crée des questions pertinentes.
          </p>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Options */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Nombre de questions</span>
            </div>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={3}>3 questions</option>
              <option value={5}>5 questions</option>
              <option value={10}>10 questions</option>
            </select>
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Collez votre texte ici... (cours, article, notes, etc.)"
              disabled={countMax <= 0}
              className={cn(
                "w-full min-h-[240px] p-4 rounded-lg border bg-card resize-none",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-subtle"
              )}
            />

            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex-1 mr-4">
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      text.length > maxLength
                        ? "bg-destructive"
                        : text.length >= minLength
                        ? "bg-foreground"
                        : "bg-muted-foreground"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span
                className={cn(
                  "tabular-nums",
                  text.length > maxLength
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {text.length} / {maxLength}
              </span>
            </div>

            {text.length > 0 && text.length < minLength && (
              <p className="text-xs text-muted-foreground">
                Minimum {minLength} caractères requis
              </p>
            )}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            size="lg"
            disabled={!isValid || GenerateQuestionsWithAi.isPending}
            className="w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Générer {questionCount} questions
          </Button>

          {/* Error message */}
          {(errorMessage || GenerateQuestionsWithAi.isError) && (
            <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">
                  {errorMessage || "Une erreur est survenue. Veuillez réessayer."}
                </p>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default GenerateAiQuestions;
