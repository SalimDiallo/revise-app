import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authConfig";
import prisma from "@/lib/prisma";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional(),
});

// GET - Récupérer les catégories
export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      include: {
        _count: { select: { quizzes: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Créer une catégorie
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { name, color, icon } = categorySchema.parse(body);

    // Vérifier si la catégorie existe déjà
    const existing = await prisma.category.findFirst({
      where: {
        name,
        userId: session.user.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Cette catégorie existe déjà" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        color: color || "#6366f1",
        icon,
        userId: session.user.id,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await prisma.category.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
