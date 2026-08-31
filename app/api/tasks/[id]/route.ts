import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const { done } = await request.json();

  // Vérifie que la tâche appartient bien à une réunion de l'utilisateur connecté
  const task = await prisma.task.findUnique({
    where: { id },
    include: { summary: { include: { meeting: true } } },
  });

  if (!task || task.summary.meeting.userId !== session.user.id) {
    return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
  }

  const updated = await prisma.task.update({
    where: { id },
    data: { done: Boolean(done) },
  });

  return NextResponse.json(updated);
}