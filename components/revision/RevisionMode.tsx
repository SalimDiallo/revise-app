"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Brain,
  Clock,
  Zap
} from "lucide-react";
import Link from "next/link";

interface RevisionCard {
  id: string;
  question: string;
  answer: string;
  explication?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview?: Date;
  timesReviewed: number;
}

export default function RevisionMode() {
  const [cards, setCards] = useState<RevisionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({
    reviewed: 0,
    correct: 0,
    incorrect: 0,
  });

  useEffect(() => {
    // Load cards from localStorage
    const savedData = window.localStorage.getItem("responseDataAi");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const revisionCards: RevisionCard[] = parsedData.map((q: any, index: number) => ({
          id: `card-${index}`,
          question: q.question,
          answer: q.correctAnswer,
          explication: q.explication,
          difficulty: 'medium',
          timesReviewed: 0,
        }));
        setCards(revisionCards);
      } catch (e) {
        console.error("Error parsing saved data:", e);
      }
    }
  }, []);

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleResponse = (correct: boolean) => {
    setStats(prev => ({
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));

    // Update card difficulty based on response
    if (currentCard) {
      const newCards = [...cards];
      if (correct) {
        newCards[currentIndex] = {
          ...currentCard,
          difficulty: currentCard.difficulty === 'hard' ? 'medium' : 'easy',
          timesReviewed: currentCard.timesReviewed + 1,
        };
      } else {
        newCards[currentIndex] = {
          ...currentCard,
          difficulty: 'hard',
          timesReviewed: currentCard.timesReviewed + 1,
        };
      }
      setCards(newCards);
    }

    // Move to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStats({ reviewed: 0, correct: 0, incorrect: 0 });
  };

  // Empty state
  if (cards.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h1 className="text-2xl font-semibold mb-2">Mode Révision</h1>
        <p className="text-muted-foreground mb-8">
          Aucune carte de révision disponible. Générez d&apos;abord un quiz pour créer des cartes.
        </p>

        <Link href="/quizz">
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Générer un quiz
          </Button>
        </Link>
      </div>
    );
  }

  // Session complete
  if (stats.reviewed === cards.length) {
    const successRate = Math.round((stats.correct / stats.reviewed) * 100);
    
    return (
      <div className="max-w-lg mx-auto text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6">
          <Brain className="h-8 w-8" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-2">Session terminée !</h2>
        <p className="text-muted-foreground mb-8">
          Voici votre progression
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl border bg-card">
            <div className="text-2xl font-bold">{stats.reviewed}</div>
            <div className="text-xs text-muted-foreground">Cartes révisées</div>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
            <div className="text-xs text-muted-foreground">Correctes</div>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="text-2xl font-bold">{successRate}%</div>
            <div className="text-xs text-muted-foreground">Réussite</div>
          </div>
        </div>

        {/* Tips based on performance */}
        <div className="p-4 rounded-xl border bg-secondary/30 mb-8 text-left">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 mt-0.5 text-amber-500" />
            <div>
              <p className="text-sm font-medium">Conseil</p>
              <p className="text-sm text-muted-foreground">
                {successRate >= 80
                  ? "Excellent travail ! Revenez demain pour consolider vos connaissances."
                  : successRate >= 50
                  ? "Bon travail ! Révisez les cartes difficiles pour vous améliorer."
                  : "Prenez le temps de bien lire les explications. La répétition est la clé !"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleRestart} variant="outline" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Recommencer la session
          </Button>
          <Link href="/quizz" className="w-full">
            <Button className="w-full">
              Nouveau contenu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold">Mode Révision</h1>
          <p className="text-sm text-muted-foreground">
            Carte {currentIndex + 1} sur {cards.length}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">
            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
            {stats.correct}
          </div>
          <div className="flex items-center px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            {stats.incorrect}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-secondary rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      {currentCard && (
        <div
          onClick={handleFlip}
          className={cn(
            "relative min-h-[300px] p-8 rounded-xl border bg-card cursor-pointer",
            "transition-all duration-300 transform",
            "hover:shadow-lg",
            isFlipped && "bg-secondary/30"
          )}
        >
          {/* Difficulty indicator */}
          <div className="absolute top-4 right-4">
            <span className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              currentCard.difficulty === 'easy' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
              currentCard.difficulty === 'medium' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              currentCard.difficulty === 'hard' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {currentCard.difficulty === 'easy' ? 'Facile' : 
               currentCard.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
            {!isFlipped ? (
              <>
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Question</span>
                </div>
                <p className="text-lg font-medium">{currentCard.question}</p>
                <p className="text-sm text-muted-foreground mt-6">
                  Cliquez pour voir la réponse
                </p>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Réponse</span>
                </div>
                <p className="text-lg font-medium text-green-600 dark:text-green-400">
                  {currentCard.answer}
                </p>
                {currentCard.explication && (
                  <p className="text-sm text-muted-foreground mt-4 max-w-md">
                    {currentCard.explication}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 space-y-4">
        {isFlipped && (
          <div className="flex gap-3">
            <Button
              onClick={() => handleResponse(false)}
              variant="outline"
              className="flex-1 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-900/30"
            >
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
              À revoir
            </Button>
            <Button
              onClick={() => handleResponse(true)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Correct
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            variant="ghost"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>
          <Button
            onClick={handleNext}
            variant="ghost"
            disabled={currentIndex === cards.length - 1}
          >
            Suivant
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
