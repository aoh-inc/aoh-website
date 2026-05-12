import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Servicios de IA para Negocios Locales",
  description:
    "Servicios de IA hechos por ti para negocios locales: resenas, visibilidad, recepcion virtual y contenido.",
  alternates: { canonical: "/es" },
};

const offers = [
  {
    name: "Automatizacion de Resenas",
    price: "$49/mes",
    desc: "Pide resenas automaticamente despues de cada trabajo.",
    href: "/es/pricing#review-automation",
  },
  {
    name: "Visibilidad en IA",
    price: "$179/mes",
    desc: "Ayudamos a que te encuentren en Google y ChatGPT.",
    href: "/es/pricing#ai-visibility",
  },
  {
    name: "Reach",
    price: "$249/mes",
    desc: "Prospeccion hecha por nosotros. Tu solo atiendes las llamadas.",
    href: "/es/pricing#reach",
  },
];

export default function HomeEsPage() {
  return (
    <main id="main-content" className="flex-1 bg-[var(--color-bg-page)] text-[var(--color-text-body)]">
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">AOH en Espanol</p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight max-w-4xl">
            Tu manejas tu negocio. Nosotros manejamos la IA.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[var(--color-hero-subtext)]">
            Sin dashboards, sin curva tecnica. Implementamos, operamos y optimizamos por ti.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/es/pricing" className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-text)] hover:bg-[var(--color-accent-hover)]">
              Ver servicios
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/es/contact" className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-hero-border)] px-5 py-3 text-sm font-semibold text-[var(--color-hero-subtext)] hover:bg-white/5">
              Hablar con el equipo
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Servicios principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((o) => (
            <article key={o.name} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">{o.price}</p>
              <h3 className="text-xl font-bold mb-2">{o.name}</h3>
              <p className="text-[var(--color-text-muted)] mb-4">{o.desc}</p>
              <Link href={o.href} className="text-sm font-semibold text-[var(--color-accent)] hover:underline">Ver detalles</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
