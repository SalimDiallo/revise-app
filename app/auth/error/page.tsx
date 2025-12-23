"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const errorMessages: Record<string, string> = {
  Configuration: "Il y a un problème avec la configuration du serveur.",
  AccessDenied: "Accès refusé. Vous n'avez pas la permission d'accéder à cette ressource.",
  Verification: "Le lien de vérification a expiré ou a déjà été utilisé.",
  Default: "Une erreur est survenue lors de la connexion.",
  CredentialsSignin: "Email ou mot de passe incorrect.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = error
    ? errorMessages[error] || errorMessages.Default
    : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 px-4">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Erreur d&apos;authentification
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {errorMessage}
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/auth/signin">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600">
              Réessayer de se connecter
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
