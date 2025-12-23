import Groq from "groq-sdk";
import { env } from "@/src/env";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authConfig";
import prisma from "@/lib/prisma";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

// Prompt système optimisé pour générer des questions de quiz
const SYSTEM_PROMPT = `Tu es un assistant spécialisé dans la création de quiz éducatifs.
À partir du texte fourni par l'utilisateur, génère un tableau JSON de questions.

RÈGLES STRICTES:
1. Génère UNIQUEMENT un tableau JSON valide, sans texte avant ou après
2. Chaque question doit avoir exactement 4 options
3. La correctAnswer doit être l'une des 4 options (texte identique)
4. L'explication doit être claire et éducative

FORMAT EXACT (respecte ce format JSON):
[
  {
    "question": "La question ici ?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B",
    "explication": "Explication détaillée de pourquoi c'est la bonne réponse."
  }
]

IMPORTANT: Réponds UNIQUEMENT avec le tableau JSON, rien d'autre.`;

interface QuizRequest {
  content: string;
  questionCount?: number;
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user.id) {
      return NextResponse.json(
        { error: "Utilisateur non connecté" }, 
        { status: 401 }
      );
    }

    // Vérifier les crédits de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { usageMax: true },
    });

    if (!user || user.usageMax <= 0) {
      return NextResponse.json(
        { error: "Crédits épuisés. Revenez demain !" }, 
        { status: 403 }
      );
    }

    const body: QuizRequest = await req.json();
    const questionCount = body.questionCount || 5;

    // Validation du contenu
    if (!body.content || body.content.length < 50) {
      return NextResponse.json(
        { error: "Le texte doit contenir au moins 50 caractères" }, 
        { status: 400 }
      );
    }

    // Initialiser Groq (gratuit et rapide!)
    const groq = new Groq({
      apiKey: env.GROQ_API_KEY,
    });

    // Appel à l'API Groq avec Llama 3.3
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Modèle gratuit et performant
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Génère exactement ${questionCount} questions de quiz basées sur ce texte:\n\n${body.content}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("Réponse vide du modèle");
    }

    // Parser la réponse JSON
    let questions;
    try {
      const parsed = JSON.parse(responseContent);
      // Groq avec json_object retourne souvent un objet avec une clé
      questions = Array.isArray(parsed) ? parsed : parsed.questions || parsed.quiz || Object.values(parsed)[0];
      
      if (!Array.isArray(questions)) {
        throw new Error("Format de réponse invalide");
      }
    } catch (parseError) {
      console.error("Erreur de parsing JSON:", responseContent);
      throw new Error("Erreur de format de la réponse IA");
    }

    // Décrémenter les crédits
    await prisma.user.update({
      where: { id: session.user.id },
      data: { usageMax: user.usageMax - 1 },
    });

    // Retourner au format attendu par le frontend
    return NextResponse.json({
      choices: [
        {
          message: {
            content: JSON.stringify(questions),
          },
        },
      ],
    });

  } catch (error: any) {
    console.error("Erreur API Quiz:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la génération du quiz" }, 
      { status: 500 }
    );
  }
}
