import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1E2761]">
          RecapAI
        </span>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm text-[#5A6A9A] hover:text-[#1E2761]">
            Se connecter
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#1E2761] px-5 py-2 text-sm font-medium text-white hover:bg-[#273580]"
          >
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-20">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-[#CADCFC]/60 px-3 py-1 text-xs font-medium tracking-wide text-[#0F8B8D]">
              PROPULSÉ PAR L&apos;IA
            </span>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.08] text-[#1E2761] md:text-6xl">
              Transformez vos réunions en actions claires.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#5A6A9A]">
              Collez la transcription d&apos;une réunion. RecapAI en extrait un résumé et une liste de tâches assignées, en quelques secondes.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/register"
                className="rounded-full bg-[#0F8B8D] px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#0c7274]"
              >
                Essayer gratuitement
              </Link>
              <span className="text-xs text-[#5A6A9A]">Aucune carte bancaire requise</span>
            </div>
          </div>

          {/* Signature visual: chaos -> clarity */}
          <div className="relative">
            <div className="rotate-[-2deg] rounded-xl border border-[#E4E9F5] bg-white p-5 font-mono text-[11px] leading-relaxed text-[#8891ad] shadow-sm">
              <p className="mb-2 text-[10px] uppercase tracking-wide text-[#b7bfd8]">Transcription brute</p>
              Sarah : bon on fait le point sur le lancement...<br />
              Karim : les visuels sont à 80%, je valide les<br />
              couleurs avec le client vendredi normalement...<br />
              Amina : ok je m&apos;occupe des textes Instagram<br />
              cette semaine, et euh... le budget aussi je pense<br />
              Sarah : nickel, on refait un point la semaine pro
            </div>

            <div className="relative z-10 -mt-6 ml-8 rounded-xl bg-[#1E2761] p-5 text-white shadow-lg">
              <p className="mb-1 text-sm font-semibold">Point hebdo marketing</p>
              <p className="mb-4 text-xs text-[#CADCFC]">
                Résumé généré en 4.2s
              </p>
              <div className="space-y-2">
                {[
                  ["Finaliser les visuels", "Karim"],
                  ["Rédiger les textes Instagram", "Amina"],
                  ["Préparer le budget pub", "Amina"],
                ].map(([task, who]) => (
                  <div key={task} className="flex items-center gap-2 text-xs">
                    <span className="h-3.5 w-3.5 rounded border border-[#CADCFC]" />
                    <span>{task}</span>
                    <span className="ml-auto text-[#CADCFC]">{who}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#E4E9F5] bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#1E2761]">
            Ce que RecapAI fait pour vous
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ["Résumé automatique", "Un recap clair de ce qui a été dit et décidé, sans relecture fastidieuse."],
              ["Tâches assignées", "Chaque action est extraite et associée à la bonne personne, automatiquement."],
              ["Multi-fournisseurs IA", "Architecture flexible pour choisir le meilleur modèle selon coût et qualité."],
            ].map(([title, desc]) => (
              <div key={title as string}>
                <div className="mb-3 h-9 w-9 rounded-full bg-[#0F8B8D]" />
                <h3 className="mb-2 font-semibold text-[#1E2761]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#5A6A9A]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#1E2761]">
          Prêt à ne plus prendre de notes en réunion ?
        </h2>
        <Link
          href="/register"
          className="mt-6 inline-block rounded-full bg-[#1E2761] px-7 py-3 text-sm font-medium text-white hover:bg-[#273580]"
        >
          Créer un compte gratuit
        </Link>
      </section>

      <footer className="border-t border-[#E4E9F5] py-8 text-center text-xs text-[#5A6A9A]">
        RecapAI — {new Date().getFullYear()}
      </footer>
    </main>
  );
}