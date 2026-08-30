"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: brand panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#1E2761] p-12 text-white md:flex">
        <Link href="/" className="font-[family-name:var(--font-display)] text-xl font-semibold">
          RecapAI
        </Link>

        <div>
          <p className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight">
            Vos réunions,<br />enfin exploitables.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#CADCFC]">
            Créez un compte gratuit et transformez votre première transcription en résumé structuré en moins d&apos;une minute.
          </p>
        </div>

        <ul className="space-y-2 text-sm text-[#CADCFC]">
          {["3 réunions gratuites par mois", "Résumé et tâches générés par IA", "Aucune carte bancaire requise"].map(
            (item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0F8B8D]" />
                {item}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Right: form */}
      <div className="flex w-full items-center justify-center bg-[#F7F8FC] px-6 md:w-1/2">
        <div className="w-full max-w-sm">
          <p className="mb-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#1E2761] md:hidden">
            RecapAI
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#1E2761]">
            Créer un compte
          </h1>
          <p className="mt-1 text-sm text-[#5A6A9A]">
            Déjà inscrit ?{" "}
            <Link href="/login" className="font-medium text-[#0F8B8D] hover:underline">
              Se connecter
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-[#1E2761]">
                Nom
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="w-full rounded-lg border border-[#E4E9F5] px-3 py-2.5 text-sm focus:border-[#0F8B8D] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#1E2761]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vous@exemple.com"
                className="w-full rounded-lg border border-[#E4E9F5] px-3 py-2.5 text-sm focus:border-[#0F8B8D] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#1E2761]">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#E4E9F5] px-3 py-2.5 text-sm focus:border-[#0F8B8D] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#0F8B8D] py-2.5 text-sm font-medium text-white hover:bg-[#0c7274] disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}