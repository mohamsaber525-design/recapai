import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import TaskList from "@/components/TaskList";

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: { summary: { include: { tasks: true } } },
  });

  if (!meeting || meeting.userId !== session.user.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FC]">
        <p className="text-[#5A6A9A]">Réunion introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-[#0F8B8D] hover:underline"
        >
          ← Retour au dashboard
        </Link>

        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[#1E2761]">
          {meeting.title}
        </h1>
        <p className="mt-1 text-sm text-[#5A6A9A]">
          Créée le{" "}
          {new Date(meeting.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {meeting.summary ? (
          <>
            <div className="mt-8 rounded-xl border border-[#E4E9F5] bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0F8B8D]" />
                <h2 className="font-[family-name:var(--font-display)] font-semibold text-[#1E2761]">
                  Résumé
                </h2>
              </div>
              <p className="leading-relaxed text-[#3A4360]">
                {meeting.summary.contentText}
              </p>
            </div>

            <TaskList tasks={meeting.summary.tasks} />
          </>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-[#E4E9F5] bg-white p-8 text-center">
            <p className="text-sm text-[#5A6A9A]">Pas encore de résumé généré.</p>
          </div>
        )}
      </div>
    </div>
  );
}