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

  const handleUpgrade = async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur lors de la création de la session de paiement");
    }
  };

  if (status === "loading")
    return <p className="p-8 text-[#5A6A9A]">Chargement...</p>;

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#1E2761]">
            Bonjour, {session?.user?.name || session?.user?.email}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleUpgrade}
              className="rounded-full bg-[#0F8B8D] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#0c7274]"
            >
              Passer Pro — 9€/mois
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-[#5A6A9A] hover:text-[#1E2761]"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-3 rounded-xl border border-[#E4E9F5] bg-white p-6 shadow-sm"
        >
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1E2761]">
            Nouvelle réunion
          </h2>
          <input
            type="text"
            placeholder="Titre de la réunion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-[#E4E9F5] px-3 py-2 text-sm focus:border-[#0F8B8D] focus:outline-none"
          />
          <textarea
            placeholder="Colle ici la transcription de ta réunion..."
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            required
            rows={6}
            className="w-full rounded-lg border border-[#E4E9F5] px-3 py-2 text-sm focus:border-[#0F8B8D] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#1E2761] px-5 py-2 text-sm font-medium text-white hover:bg-[#273580] disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Créer la réunion"}
          </button>
        </form>

        <div className="space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1E2761]">
            Mes réunions
          </h2>
          {meetings.length === 0 && (
            <p className="text-sm text-[#5A6A9A]">Aucune réunion pour le moment.</p>
          )}

          {meetings.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-[#E4E9F5] bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#1E2761]">{m.title}</p>
                  <p className="text-sm text-[#5A6A9A]">Statut : {m.status}</p>
                </div>

                {m.status === "pending" ? (
                  <button
                    onClick={() => handleSummarize(m.id)}
                    disabled={summarizingId === m.id}
                    className="rounded-full bg-[#0F8B8D] px-3 py-1.5 text-sm text-white hover:bg-[#0c7274] disabled:opacity-50"
                  >
                    {summarizingId === m.id ? "Génération..." : "Générer le résumé"}
                  </button>
                ) : (
                  <a
                    href={`/meetings/${m.id}`}
                    className="rounded-full bg-[#1E2761] px-3 py-1.5 text-sm text-white hover:bg-[#273580]"
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