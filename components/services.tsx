"use client";

const services = [
  {
    title: "Review Management",
    description:
      "We get your customers to leave reviews. Your rating goes up. Your phone rings more.",
  },
  {
    title: "AI Receptionist",
    description:
      "When you can't get to the phone, it gets answered. In English or Spanish. Caller books an appointment. You see it on your phone.",
  },
  {
    title: "AI Sales Rep",
    description:
      "We find owners in your zip code who need what you sell, write them, and book the ones who reply. You see names on your calendar.",
  },
  {
    title: "AI Marketing Agent",
    description:
      "Your social media, blog, and email — produced and posted. You get a daily summary of what went out.",
  },
];

export function Services() {
  return (
    <section id="services" style={{ padding: "6rem 0", backgroundColor: "rgba(20,20,25,0.4)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#F5F5F7",
              marginBottom: "1rem",
            }}
          >
            Four ways we run AI for you
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#71717A" }}>
            Pick one. Add more later. We handle them all.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {services.map((service) => (
            <div
              key={service.title}
              style={{
                backgroundColor: "#141419",
                border: "1px solid #27272A",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(14,165,233,0.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#27272A")}
            >
              <h3
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#F5F5F7",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "1rem",
                }}
              >
                {service.title}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#71717A", lineHeight: 1.6 }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
