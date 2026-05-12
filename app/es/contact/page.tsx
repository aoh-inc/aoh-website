import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";
import { ContactForm } from "@/components/ContactForm";
import { GhlContactEmbed } from "@/components/GhlContactEmbed";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Preguntas sobre AOH? Te respondemos. Escribe a support@aioutsourcehub.com o envia un mensaje.",
  alternates: { canonical: "/es/contact" },
};

const breadcrumb = pageBreadcrumbs("Contacto", "/es/contact");

export default function ContactPageEs() {
  const ghlEmbedSrc = process.env.NEXT_PUBLIC_GHL_CONTACT_FORM_EMBED_URL?.trim();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHeader
        eyebrow="Contacto"
        title="Habla con una persona."
        subtitle="Tienes dudas sobre precios, implementacion o si AOH es para tu negocio? Te respondemos rapido."
      />
      <PageBody>
        <PageSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contacto directo</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                El email es la forma mas rapida de contactarnos. La mayoria de mensajes se responden el mismo dia.
              </p>
              <ul className="space-y-3 text-[var(--color-text-body)]">
                <li>
                  <span className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-1">
                    Email
                  </span>
                  <a
                    href="mailto:support@aioutsourcehub.com"
                    className="text-[var(--color-accent)] hover:underline font-medium"
                  >
                    support@aioutsourcehub.com
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-1">
                    Sitio web
                  </span>
                  <a
                    href="https://aioutsourcehub.com"
                    className="text-[var(--color-accent)] hover:underline font-medium"
                  >
                    aioutsourcehub.com
                  </a>
                </li>
              </ul>
            </div>

            {ghlEmbedSrc ? <GhlContactEmbed src={ghlEmbedSrc} /> : <ContactForm />}
          </div>
        </PageSection>
      </PageBody>
    </>
  );
}
