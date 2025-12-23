import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/authConfig";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Sparkles, Zap } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

export default async function Page() {
  const session = await getAuthSession();

  if (session?.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm mb-8">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Propulsé par l&apos;IA
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Révisez intelligemment
            <br />
            <span className="text-muted-foreground">avec l&apos;IA</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Transformez n&apos;importe quel texte en quiz interactif. 
            Notre IA génère des questions pertinentes pour optimiser votre apprentissage.
          </p>

          {/* CTA */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <AuthModal />
            <Link href="/auth/signin">
              <Button variant="ghost">
                J&apos;ai déjà un compte
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Comment ça fonctionne
            </h2>
            <p className="mt-4 text-muted-foreground">
              Trois étapes simples pour réviser efficacement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-foreground text-background mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Collez votre texte</h3>
              <p className="text-sm text-muted-foreground">
                Cours, articles, notes... L&apos;IA analyse tout type de contenu.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-foreground text-background mb-6">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Quiz généré</h3>
              <p className="text-sm text-muted-foreground">
                Des questions pertinentes avec explications détaillées.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-foreground text-background mb-6">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Révisez</h3>
              <p className="text-sm text-muted-foreground">
                Mode quiz ou flashcards avec répétition espacée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-t">
        <div className="mx-auto max-w-3xl px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-semibold">3</div>
              <div className="text-sm text-muted-foreground mt-1">Quiz gratuits/jour</div>
            </div>
            <div>
              <div className="text-3xl font-semibold">10+</div>
              <div className="text-sm text-muted-foreground mt-1">Questions par quiz</div>
            </div>
            <div>
              <div className="text-3xl font-semibold">∞</div>
              <div className="text-sm text-muted-foreground mt-1">Révisions</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Prêt à commencer ?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Créez votre compte gratuit et générez votre premier quiz en moins d&apos;une minute.
          </p>
          <div className="mt-8">
            <Link href="/auth/signup">
              <Button size="lg">
                Créer un compte gratuit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-semibold text-xs">
                Re
              </div>
              <span className="font-medium">vise</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Revise. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
