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
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [meetingsThisMonth, setMeetingsThisMonth] = useState(0);
  const [limit, setLimit] = useState(3);

  const [title, setTitle] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [limitError, setLimitError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const loadMeetings = () => {
    fetch("/api/meetings")
      .then((res) => res.json())
      .then((data) => {
        setMeetings(data.meetings);
        setPlan(data.plan);
        setMeetingsThisMonth(data.meetingsThisMonth);
        setLimit(data.limit);
      });
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadMeetings();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLimitError("");

    const res = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, transcriptText }),
    });

    if (res.ok) {
      const newMeeting = await res.json();
      setMeetings([newMeeting, ...meetings]);
      setMeetingsThisMonth((n) => n + 1);
      setTitle("");
      setTranscriptText("");
    } else {
      const data = await res.json();
      if (data.error === "limit_reached") {
        setLimitError(data.message);
      }
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

  const limitReached = plan === "free" && meetingsThisMonth >= limit;

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#1E2761]">
            Bonjour, {session?.user?.name || session?.user?.email}
          </h1>
          <div className="flex items-center gap-4">
            {plan === "free" ? (
              <button
                onClick={handleUpgrade}
                className="rounded-full bg-[#0F8B8D] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#0c7274]"
              >
                Passer Pro — 9€/mois
              </button>
            ) : (
              <span className="rounded-full bg-[#CADCFC]/50 px-3 py-1 text-xs font-semibold text-[#0F8B8D]">
                PLAN PRO
              </span>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-[#5A6A9A] hover:text-[#1E2761]"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {plan === "free" && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-[#E4E9F5] bg-white px-5 py-3">
            <p className="text-sm text-[#5A6A9A]">
              <span className="font-semibold text-[#1E2761]">
                {meetingsThisMonth} / {limit}
              </span>{" "}
              réunions utilisées ce mois-ci
            </p>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#F7F8FC]">
              <div
                className="h-full rounded-full bg-[#0F8B8D]"
                style={{ width: `${Math.min((meetingsThisMonth / limit) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-3 rounded-xl border border-[#E4E9F5] bg-white p-6 shadow-sm"
        >
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1E2761]">
            Nouvelle réunion
          </h2>

          {limitReached ? (
            <div className="rounded-lg bg-[#FDF3E7] p-4 text-sm text-[#8a5a1f]">
              Tu as atteint la limite de {limit} réunions gratuites ce mois-ci.{" "}
              <button
                type="button"
                onClick={handleUpgrade}
                className="font-semibold underline"
              >
                Passe Pro
              </button>{" "}
              pour continuer sans limite.
            </div>
          ) : (
            <>
              {limitError && (
                <p className="rounded-lg bg-[#FDF3E7] p-3 text-sm text-[#8a5a1f]">
                  {limitError}
                </p>
              )}
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
            </>
          )}
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