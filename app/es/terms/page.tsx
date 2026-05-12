import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: "Terminos",
  description:
    "Terminos de servicio de AI Outsource Hub. Sin contratos largos. Puedes cancelar cuando quieras.",
  alternates: { canonical: "/es/terms" },
};

export default function TermsPageEs() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terminos de Servicio"
        subtitle="Terminos claros sobre lo que incluye AOH y lo que esperamos de cada cliente."
      />
      <PageBody>
        <PageSection>
          <div className="space-y-10">
            <p className="text-sm text-[var(--color-text-muted)]">Ultima actualizacion: 7 de mayo de 2026</p>

            <div>
              <h2 className="text-2xl font-bold mb-3">Sin contratos</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Los servicios de AOH son mes a mes. Puedes cancelar en cualquier momento escribiendo a{" "}
                <a href="mailto:support@aioutsourcehub.com" className="text-[var(--color-accent)] hover:underline">
                  support@aioutsourcehub.com
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Facturacion</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Los planes se cobran mensualmente por adelantado. Si el pago falla, el servicio se pausa hasta que se actualice el metodo de pago.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Contacto</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Preguntas? Escribe a{" "}
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
