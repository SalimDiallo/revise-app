"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { UseQUizzStore } from "@/src/zustand/store";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  Trophy,
  Target,
  RotateCcw
} from "lucide-react";

export type QuizzProgressType = {
  currentIndex: number;
  numberQuestions: number;
  score: number;
  answered: boolean[];
};

const StartQuizz = () => {
  const router = useRouter();
  const updateQuizData = UseQUizzStore((state) => state.updateQuizzData);
  const [mounted, setMounted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);

  const [progress, setProgress] = useState<QuizzProgressType>({
    currentIndex: 0,
    numberQuestions: 0,
    score: 0,
    answered: [],
  });

  const questions = UseQUizzStore((state) => state.data);

  useEffect(() => {
    setMounted(true);
    const dataLocalStorage = window.localStorage.getItem("responseDataAi");
    if (dataLocalStorage) {
      const parsedData = JSON.parse(dataLocalStorage);
      updateQuizData(parsedData);
      setProgress((prev) => ({
        ...prev,
        numberQuestions: parsedData.length,
        answered: new Array(parsedData.length).fill(false),
      }));
    }
  }, [updateQuizData]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    router.push("/quizz");
    return null;
  }

  const currentQuestion = questions[progress.currentIndex];
  const isCorrect = selectedOption !== null && 
    currentQuestion.options[selectedOption] === currentQuestion.correctAnswer;

  const handleOptionSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    setIsSubmitted(true);
    
    if (isCorrect) {
      setProgress((prev) => ({
        ...prev,
        score: prev.score + 1,
      }));
    }

    // Mark as answered
    const newAnswered = [...progress.answered];
    newAnswered[progress.currentIndex] = true;
    setProgress((prev) => ({ ...prev, answered: newAnswered }));
  };

  const handleNext = () => {
    if (progress.currentIndex < progress.numberQuestions - 1) {
      setProgress((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }));
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowExplanation(false);
    } else {
      setQuizEnded(true);
    }
  };

  const handleRestart = () => {
    setProgress({
      currentIndex: 0,
      numberQuestions: questions.length,
      score: 0,
      answered: new Array(questions.length).fill(false),
    });
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowExplanation(false);
    setQuizEnded(false);
  };

  const getScoreMessage = () => {
    const percentage = (progress.score / progress.numberQuestions) * 100;
    if (percentage >= 80) return "Excellent ! 🎉";
    if (percentage >= 60) return "Bien joué ! 👍";
    if (percentage >= 40) return "Continue tes efforts ! 💪";
    return "Révise encore un peu ! 📚";
  };

  // Quiz ended screen
  if (quizEnded) {
    const percentage = Math.round((progress.score / progress.numberQuestions) * 100);
    
    return (
      <div className="max-w-lg mx-auto text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
          <Trophy className="h-10 w-10" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-2">Quiz terminé !</h2>
        <p className="text-muted-foreground mb-8">{getScoreMessage()}</p>

        {/* Score display */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl border bg-card">
            <div className="text-3xl font-bold">{progress.score}/{progress.numberQuestions}</div>
            <div className="text-sm text-muted-foreground">Bonnes réponses</div>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="text-3xl font-bold">{percentage}%</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button onClick={handleRestart} variant="outline" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Recommencer
          </Button>
          <Button onClick={() => router.push("/quizz")} className="w-full">
            Nouveau quiz
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Question {progress.currentIndex + 1} sur {progress.numberQuestions}
          </span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-secondary">
          <Target className="h-4 w-4" />
          <span className="text-sm font-medium">{progress.score} pts</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-secondary rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-500"
          style={{
            width: `${((progress.currentIndex + (isSubmitted ? 1 : 0)) / progress.numberQuestions) * 100}%`,
          }}
        />
      </div>

      {/* Question card */}
      <div className="p-6 rounded-xl border bg-card mb-6">
        <h2 className="text-lg font-medium mb-6">{currentQuestion.question}</h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrectOption = option === currentQuestion.correctAnswer;
            
            let optionClass = "border-border hover:border-foreground/50";
            
            if (isSubmitted) {
              if (isCorrectOption) {
                optionClass = "border-green-500 bg-green-50 dark:bg-green-900/20";
              } else if (isSelected && !isCorrectOption) {
                optionClass = "border-red-500 bg-red-50 dark:bg-red-900/20";
              }
            } else if (isSelected) {
              optionClass = "border-foreground bg-secondary";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={isSubmitted}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-ring",
                  "disabled:cursor-default",
                  optionClass
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full border mr-3 text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </span>
                  {isSubmitted && isCorrectOption && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {isSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation (visible after submit) */}
      {isSubmitted && currentQuestion.explication && (
        <div className="mb-6">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center justify-between w-full p-4 rounded-lg border bg-card hover:bg-secondary/50 transition-colors"
          >
            <span className="font-medium">Voir l&apos;explication</span>
            {showExplanation ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {showExplanation && (
            <div className="mt-2 p-4 rounded-lg border bg-secondary/30 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Réponse correcte :</strong>{" "}
                {currentQuestion.correctAnswer}
              </p>
              {currentQuestion.explication && (
                <p className="text-sm text-muted-foreground mt-2">
                  {currentQuestion.explication}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="flex-1"
          >
            Valider
          </Button>
        ) : (
          <Button onClick={handleNext} className="flex-1">
            {progress.currentIndex < progress.numberQuestions - 1 ? (
              <>
                Question suivante
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Voir les résultats"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StartQuizz;
