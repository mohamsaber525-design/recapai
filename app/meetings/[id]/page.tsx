import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
    return <p className="p-8">Réunion introuvable.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <a href="/dashboard" className="text-sm text-blue-600">
          ← Retour au dashboard
        </a>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{meeting.title}</h1>

        {meeting.summary ? (
          <>
            <div className="mt-6 rounded-lg bg-white p-6 shadow">
              <h2 className="mb-2 font-semibold">Résumé</h2>
              <p className="text-gray-700">{meeting.summary.contentText}</p>
            </div>

            <div className="mt-6 rounded-lg bg-white p-6 shadow">
              <h2 className="mb-3 font-semibold">Tâches à faire</h2>
              <ul className="space-y-2">
                {meeting.summary.tasks.map((task) => (
                  <li key={task.id} className="flex items-start gap-2">
                    <input type="checkbox" defaultChecked={task.done} className="mt-1" />
                    <span>
                      {task.description}
                      {task.assignee && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({task.assignee})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="mt-6 text-gray-500">Pas encore de résumé généré.</p>
        )}
      </div>
    </div>
  );
}