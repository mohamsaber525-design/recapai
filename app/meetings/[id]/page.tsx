import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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

            <div className="mt-6 rounded-xl border border-[#E4E9F5] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#1E2761]" />
                <h2 className="font-[family-name:var(--font-display)] font-semibold text-[#1E2761]">
                  Tâches à faire
                </h2>
                <span className="ml-auto rounded-full bg-[#F7F8FC] px-2.5 py-0.5 text-xs font-medium text-[#5A6A9A]">
                  {meeting.summary.tasks.length}
                </span>
              </div>
              <ul className="space-y-3">
                {meeting.summary.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start gap-3 rounded-lg border border-[#E4E9F5] p-3"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={task.done}
                      className="mt-0.5 h-4 w-4 rounded border-[#E4E9F5] accent-[#0F8B8D]"
                    />
                    <span className="text-sm text-[#1E2761]">
                      {task.description}
                      {task.assignee && (
                        <span className="ml-2 rounded-full bg-[#CADCFC]/50 px-2 py-0.5 text-xs font-medium text-[#0F8B8D]">
                          {task.assignee}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
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