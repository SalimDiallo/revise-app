"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { UseQUizzStore } from "@/src/zustand/store";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trophy,
  RotateCcw,
  ArrowRight,
  Timer,
  Pause,
  Play,
} from "lucide-react";
import Link from "next/link";

interface QuizProgress {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  answers: Array<{
    questionIndex: number;
    selectedOption: number | null;
    isCorrect: boolean;
    timeSpent: number;
  }>;
}

export default function TimedQuiz() {
  const router = useRouter();
  const questions = UseQUizzStore((state) => state.data);
  const updateQuizData = UseQUizzStore((state) => state.updateQuizzData);

  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState<"setup" | "playing" | "paused" | "finished">("setup");
  const [timePerQuestion, setTimePerQuestion] = useState(30); // secondes par question
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [progress, setProgress] = useState<QuizProgress>({
    currentIndex: 0,
    totalQuestions: 0,
    score: 0,
    answers: [],
  });

  // Charger les questions
  useEffect(() => {
    setMounted(true);
    const savedData = window.localStorage.getItem("responseDataAi");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      updateQuizData(parsedData);
      setProgress((prev) => ({
        ...prev,
        totalQuestions: parsedData.length,
      }));
    }
  }, [updateQuizData]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState === "playing" && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
        setTotalTime((prev) => prev + 1);
      }, 1000);
    } else if (gameState === "playing" && timeRemaining === 0) {
      // Temps écoulé pour cette question
      handleTimeUp();
    }

    return () => clearInterval(interval);
  }, [gameState, timeRemaining]);

  const handleTimeUp = useCallback(() => {
    const currentQuestion = questions?.[progress.currentIndex];
    const isCorrect = false; // Pas de réponse = incorrect

    setProgress((prev) => ({
      ...prev,
      answers: [
        ...prev.answers,
        {
          questionIndex: prev.currentIndex,
          selectedOption: null,
          isCorrect,
          timeSpent: timePerQuestion,
        },
      ],
    }));

    moveToNextQuestion();
  }, [progress.currentIndex, questions, timePerQuestion]);

  const startQuiz = () => {
    setTimeRemaining(timePerQuestion);
    setTotalTime(0);
    setGameState("playing");
  };

  const togglePause = () => {
    setGameState((prev) => (prev === "playing" ? "paused" : "playing"));
  };

  const handleOptionSelect = (index: number) => {
    if (gameState !== "playing") return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !questions) return;

    const currentQuestion = questions[progress.currentIndex];
    const isCorrect =
      currentQuestion.options[selectedOption] === currentQuestion.correctAnswer;
    const timeSpent = timePerQuestion - timeRemaining;

    setProgress((prev) => ({
      ...prev,
      score: prev.score + (isCorrect ? 1 : 0),
      answers: [
        ...prev.answers,
        {
          questionIndex: prev.currentIndex,
          selectedOption,
          isCorrect,
          timeSpent,
        },
      ],
    }));

    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    if (progress.currentIndex < progress.totalQuestions - 1) {
      setProgress((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }));
      setSelectedOption(null);
      setTimeRemaining(timePerQuestion);
    } else {
      setGameState("finished");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 5) return "text-red-600";
    if (timeRemaining <= 10) return "text-amber-600";
    return "text-foreground";
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 animate-fade-in">
        <Timer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Mode Examen Chronométré</h2>
        <p className="text-muted-foreground mb-6">
          Générez d&apos;abord un quiz pour commencer l&apos;examen chronométré.
        </p>
        <Link href="/quizz">
          <Button>Générer un quiz</Button>
        </Link>
      </div>
    );
  }

  // Setup screen
  if (gameState === "setup") {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
            <Timer className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold">Mode Examen</h1>
          <p className="text-muted-foreground mt-2">
            Testez-vous en conditions d&apos;examen avec un temps limité
          </p>
        </div>

        <div className="p-6 rounded-xl border bg-card space-y-6">
          <div>
            <label className="text-sm font-medium">Temps par question</label>
            <div className="flex gap-2 mt-2">
              {[15, 30, 45, 60].map((time) => (
                <button
                  key={time}
                  onClick={() => setTimePerQuestion(time)}
                  className={cn(
                    "flex-1 py-2 rounded-lg border transition-colors",
                    timePerQuestion === time
                      ? "bg-foreground text-background border-foreground"
                      : "hover:bg-secondary"
                  )}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Questions</span>
              <span className="font-medium">{questions.length}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">Durée estimée</span>
              <span className="font-medium">
                ~{formatTime(questions.length * timePerQuestion)}
              </span>
            </div>
          </div>

          <Button onClick={startQuiz} className="w-full" size="lg">
            <Play className="mr-2 h-4 w-4" />
            Commencer l&apos;examen
          </Button>
        </div>
      </div>
    );
  }

  // Finished screen
  if (gameState === "finished") {
    const percentage = Math.round((progress.score / progress.totalQuestions) * 100);
    const avgTimePerQuestion = Math.round(totalTime / progress.totalQuestions);

    return (
      <div className="max-w-lg mx-auto text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
          <Trophy className="h-10 w-10" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">Examen terminé !</h2>
        <p className="text-muted-foreground mb-8">
          {percentage >= 80
            ? "Excellent travail ! 🎉"
            : percentage >= 60
            ? "Bien joué ! 👍"
            : "Continuez à réviser ! 💪"}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl border bg-card">
            <div className="text-3xl font-bold">{percentage}%</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="text-3xl font-bold">{formatTime(totalTime)}</div>
            <div className="text-sm text-muted-foreground">Temps total</div>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="text-3xl font-bold text-green-600">
              {progress.score}
            </div>
            <div className="text-sm text-muted-foreground">Correctes</div>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="text-3xl font-bold">{avgTimePerQuestion}s</div>
            <div className="text-sm text-muted-foreground">Moy./question</div>
          </div>
        </div>

        {/* Answer review */}
        <div className="text-left p-4 rounded-xl border bg-card mb-8">
          <h3 className="font-medium mb-3">Détail des réponses</h3>
          <div className="space-y-2">
            {progress.answers.map((answer, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">Question {i + 1}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {answer.timeSpent}s
                  </span>
                  {answer.isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={() => router.push("/quizz")} className="w-full">
            Nouveau quiz
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setGameState("setup");
              setProgress({
                currentIndex: 0,
                totalQuestions: questions.length,
                score: 0,
                answers: [],
              });
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Recommencer
          </Button>
        </div>
      </div>
    );
  }

  // Playing screen
  const currentQuestion = questions[progress.currentIndex];
  const progressPercentage =
    ((progress.currentIndex + 1) / progress.totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header with timer */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-sm text-muted-foreground">
            Question {progress.currentIndex + 1} / {progress.totalQuestions}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Pause button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePause}
            className="text-muted-foreground"
          >
            {gameState === "paused" ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>

          {/* Timer */}
          <div
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-full bg-secondary font-mono text-lg font-semibold",
              getTimeColor(),
              timeRemaining <= 5 && "animate-pulse"
            )}
          >
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-secondary rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Paused overlay */}
      {gameState === "paused" && (
        <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-50">
          <div className="text-center">
            <Pause className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Examen en pause</h2>
            <p className="text-muted-foreground mb-6">
              Le timer est arrêté
            </p>
            <Button onClick={togglePause}>
              <Play className="mr-2 h-4 w-4" />
              Reprendre
            </Button>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="p-6 rounded-xl border bg-card mb-6">
        <h2 className="text-lg font-medium mb-6">{currentQuestion.question}</h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={cn(
                "w-full p-4 rounded-lg border text-left transition-all duration-200",
                selectedOption === index
                  ? "border-foreground bg-secondary"
                  : "border-border hover:border-foreground/50"
              )}
            >
              <div className="flex items-center">
                <span className="flex items-center justify-center w-7 h-7 rounded-full border mr-3 text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Low time warning */}
      {timeRemaining <= 10 && timeRemaining > 0 && (
        <div className="flex items-center justify-center space-x-2 text-amber-600 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">Dépêchez-vous !</span>
        </div>
      )}

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={selectedOption === null}
        className="w-full"
        size="lg"
      >
        Valider
      </Button>
    </div>
  );
}
