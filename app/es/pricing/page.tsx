import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Que Hacemos",
  description: "Servicios de AOH con precios claros para negocios locales.",
  alternates: { canonical: "/es/pricing" },
};

const plans = [
  {
    id: "review-automation",
    name: "Automatizacion de Resenas",
    price: "$49/mes",
    setup: "Sin costo de setup",
    points: [
      "Solicitudes de resenas por email automaticas",
      "Ajuste inicial de perfil de Google",
      "Resumen mensual de resultados",
    ],
  },
  {
    id: "ai-visibility",
    name: "Visibilidad en IA",
    price: "$179/mes",
    setup: "$199 setup",
    points: [
      "Incluye todo lo de resenas",
      "Respuestas sugeridas por IA en tu tono",
      "Trabajo mensual para aparecer en busquedas de IA",
    ],
  },
  {
    id: "reach",
    name: "Reach",
    price: "$249/mes",
    setup: "$199 setup",
    points: [
      "Lista de prospectos curada",
      "Mensajes de outreach en tu voz",
      "Citas calificadas en tu calendario",
    ],
  },
];

export default function PricingEsPage() {
  return (
    <main id="main-content" className="flex-1 bg-[var(--color-bg-page)] text-[var(--color-text-body)]">
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">Que hacemos</p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">Precios claros, sin presion.</h1>
          <p className="mt-5 max-w-2xl text-lg text-[var(--color-hero-subtext)]">
            Elige el servicio que necesitas hoy. Escalamos contigo cuando tenga sentido.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <article id={p.id} key={p.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">{p.setup}</p>
              <h2 className="text-2xl font-bold mb-1">{p.name}</h2>
              <p className="text-lg font-semibold mb-4">{p.price}</p>
              <ul className="space-y-2 text-sm text-[var(--color-text-muted)] mb-5">
                {p.points.map((x) => (
                  <li key={x}>• {x}</li>
                ))}
              </ul>
              <Link href="https://link.hub360ai.com/widget/booking/fVfL3Xth5gEW9mRjZS56" className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-accent-text)] hover:bg-[var(--color-accent-hover)]">
                Agendar llamada
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
