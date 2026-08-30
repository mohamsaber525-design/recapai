import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const FREE_PLAN_MONTHLY_LIMIT = 3;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  if (user?.plan !== "pro") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const meetingsThisMonth = await prisma.meeting.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: startOfMonth },
      },
    });

    if (meetingsThisMonth >= FREE_PLAN_MONTHLY_LIMIT) {
      return NextResponse.json(
        {
          error: "limit_reached",
          message: `Le plan gratuit est limité à ${FREE_PLAN_MONTHLY_LIMIT} réunions par mois. Passe Pro pour créer des réunions en illimité.`,
        },
        { status: 403 }
      );
    }
  }

  const { title, transcriptText } = await request.json();

  if (!title || !transcriptText) {
    return NextResponse.json(
      { error: "Titre et transcription requis" },
      { status: 400 }
    );
  }

  const meeting = await prisma.meeting.create({
    data: {
      title,
      transcriptText,
      status: "pending",
      userId: session.user.id,
    },
  });

  return NextResponse.json(meeting);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [meetings, meetingsThisMonth] = await Promise.all([
    prisma.meeting.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.meeting.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: startOfMonth },
      },
    }),
  ]);

  return NextResponse.json({
    meetings,
    plan: user?.plan ?? "free",
    meetingsThisMonth,
    limit: FREE_PLAN_MONTHLY_LIMIT,
  });
}