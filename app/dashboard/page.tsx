"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type Meeting = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [title, setTitle] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/meetings")
        .then((res) => res.json())
        .then((data) => setMeetings(data));
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, transcriptText }),
    });

    if (res.ok) {
      const newMeeting = await res.json();
      setMeetings([newMeeting, ...meetings]);
      setTitle("");
      setTranscriptText("");
    }
    setLoading(false);
  };

  const handleSummarize = async (meetingId: string) => {
    setSummarizingId(meetingId);

    const res = await fetch(`/api/meetings/${meetingId}/summarize`, {
      method: "POST",
    });

    if (res.ok) {
      setMeetings((prev) =>
        prev.map((m) => (m.id === meetingId ? { ...m, status: "done" } : m))
      );
    } else {
      alert("Erreur lors de la génération du résumé. Vérifie la console pour plus de détails.");
    }

    setSummarizingId(null);
  };

  if (status === "loading") return <p className="p-8">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {session?.user?.name || session?.user?.email}
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Se déconnecter
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-3 rounded-lg bg-white p-6 shadow"
        >
          <h2 className="text-lg font-semibold">Nouvelle réunion</h2>
          <input
            type="text"
            placeholder="Titre de la réunion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded border px-3 py-2"
          />
          <textarea
            placeholder="Colle ici la transcription de ta réunion..."
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            required
            rows={6}
            className="w-full rounded border px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Créer la réunion"}
          </button>
        </form>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Mes réunions</h2>
          {meetings.length === 0 && (
            <p className="text-gray-500">Aucune réunion pour le moment.</p>
          )}

          {meetings.map((m) => (
            <div key={m.id} className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm text-gray-500">Statut : {m.status}</p>
                </div>

                {m.status === "pending" ? (
                  <button
                    onClick={() => handleSummarize(m.id)}
                    disabled={summarizingId === m.id}
                    className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {summarizingId === m.id ? "Génération..." : "Générer le résumé"}
                  </button>
                ) : (
                  <a
                    href={`/meetings/${m.id}`}
                    className="rounded bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-900"
                  >
                    Voir le résumé
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
