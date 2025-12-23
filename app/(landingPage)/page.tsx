import Link from "next/link";
import { Brain, Zap, Target, TrendingUp, ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Subtle Neural Network Background */}
      <div className="fixed inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="currentColor" className="text-slate-900 dark:text-slate-100" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-32">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Propulsé par Llama 3.3</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-center">
            <span className="block text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-slate-800 dark:text-slate-200">
              Apprenez
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight mt-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              avec l'IA
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-center text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Répétition espacée. Feedback instantané. Progression optimisée.
            <br />
            <span className="text-slate-500 dark:text-slate-500">Transformez n'importe quel contenu en quiz intelligent.</span>
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center px-8 py-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-lg shadow-slate-900/10 dark:shadow-slate-100/10"
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-8 py-4 rounded-xl border border-slate-300 dark:border-slate-700 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-300"
            >
              Se connecter
            </Link>
          </div>

          {/* Visual Element - Learning Curve */}
          <div className="mt-20 flex justify-center">
            <div className="relative w-full max-w-lg">
              <svg viewBox="0 0 400 120" className="w-full h-auto">
                {/* Axes */}
                <line x1="40" y1="100" x2="380" y2="100" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" />
                <line x1="40" y1="100" x2="40" y2="20" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" />
                
                {/* Traditional Learning Curve */}
                <path 
                  d="M 40 90 Q 120 85 200 70 T 360 50" 
                  fill="none" 
                  className="stroke-slate-400 dark:stroke-slate-600" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                />
                
                {/* AI-Optimized Learning Curve */}
                <path 
                  d="M 40 90 Q 100 60 160 40 T 360 25" 
                  fill="none" 
                  className="stroke-emerald-500 dark:stroke-emerald-400" 
                  strokeWidth="2.5"
                />
                
                {/* Data Points */}
                <circle cx="100" cy="55" r="4" className="fill-emerald-500 dark:fill-emerald-400" />
                <circle cx="180" cy="38" r="4" className="fill-emerald-500 dark:fill-emerald-400" />
                <circle cx="280" cy="28" r="4" className="fill-emerald-500 dark:fill-emerald-400" />
                
                {/* Labels */}
                <text x="200" y="115" textAnchor="middle" className="fill-slate-500 dark:fill-slate-500 text-xs">Temps</text>
                <text x="25" y="60" textAnchor="middle" className="fill-slate-500 dark:fill-slate-500 text-xs" transform="rotate(-90, 25, 60)">Rétention</text>
              </svg>
              
              {/* Legend */}
              <div className="flex justify-center gap-8 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-slate-400 dark:bg-slate-600" style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0, currentColor 4px, transparent 4px, transparent 8px)' }}></div>
                  <span className="text-slate-500 dark:text-slate-500">Révision classique</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-emerald-500 dark:bg-emerald-400"></div>
                  <span className="text-slate-600 dark:text-slate-400">Avec Revise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-slate-800 dark:text-slate-200">
              Un système <span className="font-semibold">inspiré du machine learning</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="Génération intelligente"
              description="L'IA analyse votre contenu et crée des questions qui ciblent les concepts clés, comme un modèle identifie des patterns."
            />
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              title="Répétition espacée"
              description="Algorithme adaptatif qui optimise les intervalles de révision selon votre courbe d'oubli personnelle."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Feedback en temps réel"
              description="Chaque réponse affine le modèle de vos connaissances. Plus vous pratiquez, plus le système vous comprend."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Métriques précises"
              description="Visualisez votre progression avec des données claires : taux de rétention, points faibles, prédictions de maîtrise."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-slate-800 dark:text-slate-200">
              Trois étapes. <span className="font-semibold">Zéro friction.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <Step
              number="01"
              title="Input"
              description="Collez votre cours, article ou documentation. Tout texte devient source d'apprentissage."
            />
            <Step
              number="02"
              title="Process"
              description="Llama 3.3 extrait les concepts et génère des questions calibrées sur votre contenu."
            />
            <Step
              number="03"
              title="Output"
              description="Quiz adaptatif, scores en temps réel, et planification automatique des révisions."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-12 text-center overflow-hidden">
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cta-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-grid)" />
              </svg>
            </div>
            
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-light text-white mb-4">
                Prêt à optimiser votre apprentissage ?
              </h2>
              <p className="text-slate-400 mb-8 font-light">
                Gratuit. Sans carte bancaire. Résultats immédiats.
              </p>
              <Link
                href="/auth/signup"
                className="group inline-flex items-center px-8 py-4 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-all duration-300"
              >
                Créer un compte
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © {new Date().getFullYear()} Revise. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Propulsé par l'IA
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-block mb-4">
        <span className="text-5xl font-extralight text-emerald-500 dark:text-emerald-400 tracking-tighter">
          {number}
        </span>
      </div>
      <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-3">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}