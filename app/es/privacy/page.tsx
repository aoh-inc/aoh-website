import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "Como AI Outsource Hub recopila, usa y protege tu informacion.",
  alternates: { canonical: "/es/privacy" },
};

export default function PrivacyPageEs() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Politica de Privacidad"
        subtitle="Como AI Outsource Hub recopila, usa y protege tu informacion. Lenguaje claro."
      />
      <PageBody>
        <PageSection>
          <div className="prose-section space-y-10 text-[var(--color-text-body)]">
            <p className="text-sm text-[var(--color-text-muted)]">Ultima actualizacion: 7 de mayo de 2026</p>

            <div>
              <h2 className="text-2xl font-bold mb-3">Que recopilamos</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Cuando pides un reporte gratis, recopilamos tu email de negocio y la URL de tu sitio web. Cuando te vuelves cliente, recopilamos la informacion necesaria para operar los servicios por ti.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Como lo usamos</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Usamos tu informacion para entregar los servicios que contrataste. No vendemos tus datos y no los compartimos para publicidad de terceros.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Tus derechos</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Puedes solicitar copia de tus datos, corregir informacion o pedir eliminacion escribiendo a{" "}
                <a href="mailto:support@aioutsourcehub.com" className="text-[var(--color-accent)] hover:underline">
                  support@aioutsourcehub.com
                </a>
                .
              </p>
            </div>
          </div>
        </PageSection>
      </PageBody>
    </>
  );
}
