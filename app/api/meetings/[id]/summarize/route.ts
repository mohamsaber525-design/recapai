import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Groq from "groq-sdk";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  const meeting = await prisma.meeting.findUnique({ where: { id } });
  if (!meeting || meeting.userId !== session.user.id) {
    return NextResponse.json({ error: "Réunion introuvable" }, { status: 404 });
  }

  const prompt = `Tu es un assistant qui résume des réunions professionnelles.
Voici la transcription d'une réunion :

"""
${meeting.transcriptText}
"""

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après, au format exact suivant :
{
  "summary": "un résumé clair en 3-5 phrases",
  "tasks": [
    { "description": "description de la tâche", "assignee": "nom de la personne ou null" }
  ]
}`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const rawText = completion.choices[0]?.message?.content || "{}";
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json({ error: "Erreur d'analyse IA" }, { status: 500 });
  }

  const summary = await prisma.summary.create({
    data: {
      contentText: parsed.summary,
      aiProviderUsed: "groq",
      meetingId: meeting.id,
      tasks: {
        create: parsed.tasks.map((t: { description: string; assignee?: string }) => ({
          description: t.description,
          assignee: t.assignee || null,
        })),
      },
    },
    include: { tasks: true },
  });

  await prisma.meeting.update({
    where: { id: meeting.id },
    data: { status: "done" },
  });

  return NextResponse.json(summary);
}