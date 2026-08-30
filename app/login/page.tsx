"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      router.push("/dashboard");
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
            Content de vous revoir.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#CADCFC]">
            Reconnectez-vous pour retrouver vos réunions, vos résumés et vos tâches en cours.
          </p>
        </div>

        <div className="rounded-xl bg-[#273580] p-5 text-sm text-[#CADCFC]">
          <p className="mb-1 font-medium text-white">Point hebdo marketing</p>
          <p className="text-xs">Résumé généré en 4.2s — 3 tâches assignées</p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex w-full items-center justify-center bg-[#F7F8FC] px-6 md:w-1/2">
        <div className="w-full max-w-sm">
          <p className="mb-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#1E2761] md:hidden">
            RecapAI
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#1E2761]">
            Connexion
          </h1>
          <p className="mt-1 text-sm text-[#5A6A9A]">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-medium text-[#0F8B8D] hover:underline">
              Créer un compte
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
              className="w-full rounded-full bg-[#1E2761] py-2.5 text-sm font-medium text-white hover:bg-[#273580] disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}