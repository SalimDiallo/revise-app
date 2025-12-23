"use client";

import { BookOpen, Calendar, Sparkles, Target, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <div className="p-5 rounded-xl border bg-card transition-all hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`h-3 w-3 mr-1 ${!trend.isPositive && 'rotate-180'}`} />
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function QuickAction({ title, description, href, icon }: QuickActionProps) {
  return (
    <Link href={href}>
      <div className="group p-5 rounded-xl border bg-card hover:bg-secondary/50 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground text-background">
            {icon}
          </div>
        </div>
        <h3 className="font-medium mb-1 group-hover:text-foreground transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

interface RecentActivityProps {
  activities: {
    id: string;
    type: 'quiz' | 'revision';
    title: string;
    score?: number;
    date: string;
  }[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="p-8 rounded-xl border bg-card text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-1">Pas encore d&apos;activité</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Commencez par générer votre premier quiz !
        </p>
        <Link href="/quizz">
          <Button size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Générer un quiz
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Activité récente</h3>
      </div>
      <div className="divide-y">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                  activity.type === 'quiz' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  {activity.type === 'quiz' ? (
                    <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
              {activity.score !== undefined && (
                <span className="text-sm font-medium">{activity.score}%</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  max: number;
  label: string;
}

export function ProgressRing({ value, max, label }: ProgressRingProps) {
  const percentage = Math.round((value / max) * 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-secondary"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-foreground transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold">{percentage}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

// Dashboard page stats display
interface DashboardStatsProps {
  usageMax: number;
  totalQuizzes?: number;
  averageScore?: number;
}

export function DashboardStats({ usageMax, totalQuizzes = 0, averageScore = 0 }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Crédits restants"
        value={usageMax}
        description="Quiz disponibles"
        icon={<Sparkles className="h-5 w-5" />}
      />
      <StatsCard
        title="Quiz complétés"
        value={totalQuizzes}
        icon={<Target className="h-5 w-5" />}
      />
      <StatsCard
        title="Score moyen"
        value={`${averageScore}%`}
        icon={<TrendingUp className="h-5 w-5" />}
      />
    </div>
  );
}

// Quick actions for dashboard
export function DashboardActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <QuickAction
        title="Générer un quiz"
        description="Créez un quiz à partir de n'importe quel texte"
        href="/quizz"
        icon={<Sparkles className="h-5 w-5" />}
      />
      <QuickAction
        title="Mode révision"
        description="Révisez vos questions avec la répétition espacée"
        href="/revision"
        icon={<BookOpen className="h-5 w-5" />}
      />
    </div>
  );
}
