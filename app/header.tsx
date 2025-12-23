"use client";

import CenterLayout from "@/components/layout/CenterLayout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ButtonTheme from "@/src/theme/ButtonTheme";
import Link from "next/link";
import React, { useState } from "react";
import AvatarProfile from "@/components/ui/AvatarProfile";
import { 
  BookOpen, 
  BarChart3, 
  History, 
  LayoutDashboard, 
  Menu, 
  Sparkles, 
  Timer,
  X
} from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

const Header = ({
  userId,
  userName,
  userImage,
  countUsage,
}: {
  userId?: string;
  userImage?: string | undefined | null;
  userName?: string | undefined | null;
  countUsage?: number;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/quizz", label: "Générer", icon: Sparkles },
    { href: "/quizz/timed", label: "Examen", icon: Timer },
    { href: "/revision", label: "Réviser", icon: BookOpen },
    { href: "/stats", label: "Stats", icon: BarChart3 },
    { href: "/history", label: "Historique", icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <CenterLayout className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/20">
            Re
          </div>
          <span className="font-medium text-white">vise</span>
        </Link>

        {/* Desktop Navigation */}
        {userId && (
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="mr-1.5 h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {userId && (
            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-secondary text-sm">
              <span className="text-muted-foreground mr-1">Crédits:</span>
              <span className="font-medium">{countUsage ?? 0}</span>
            </div>
          )}

          <ButtonTheme />

          {userId ? (
            <>
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <div className="hidden sm:block">
                <AvatarProfile name={userName} image={userImage} />
              </div>
            </>
          ) : (
            <AuthModal />
          )}
        </div>
      </CenterLayout>

      {/* Mobile Navigation */}
      {userId && mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <CenterLayout className="py-4">
            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <item.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AvatarProfile name={userName} image={userImage} />
                <span className="text-sm font-medium">{userName}</span>
              </div>
              <div className="flex items-center px-3 py-1.5 rounded-full bg-secondary text-sm">
                <span className="text-muted-foreground mr-1">Crédits:</span>
                <span className="font-medium">{countUsage ?? 0}</span>
              </div>
            </div>
          </CenterLayout>
        </div>
      )}
    </header>
  );
};

export default Header;
