import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: "Conoce AI Outsource Hub y como operamos servicios de IA para negocios locales.",
  alternates: { canonical: "/es/about" },
};

export default function AboutEsPage() {
  return (
    <main id="main-content" className="flex-1 bg-[var(--color-bg-page)] text-[var(--color-text-body)]">
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">Sobre AOH</p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight max-w-4xl">
            Equipo operativo de IA para negocios locales.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[var(--color-hero-subtext)]">
            Trabajamos contigo para ejecutar resenas, visibilidad, contenido y outreach sin que tu equipo se complique.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
          <h2 className="text-2xl font-bold mb-3">Como trabajamos</h2>
          <ul className="space-y-2 text-[var(--color-text-muted)]">
            <li>• Operacion mensual hecha por nosotros</li>
            <li>• Reportes claros y accionables</li>
            <li>• Sin contratos largos, puedes cancelar cuando quieras</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
          <h2 className="text-2xl font-bold mb-3">Siguiente paso</h2>
          <p className="text-[var(--color-text-muted)] mb-4">
            Si quieres saber por donde empezar, te recomendamos una llamada corta para mapear prioridad y presupuesto.
          </p>
          <Link href="/es/contact" className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-text)] hover:bg-[var(--color-accent-hover)]">
            Contactar equipo
            <span aria-hidden="true">→</span>
          </Link>
        </article>
      </section>
    </main>
  );
}
