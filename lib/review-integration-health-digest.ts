import type { getIntegrationHealthRollup } from "@/lib/review-integration-health";

export function buildIntegrationHealthEmail(input: {
  toEmail: string;
  rollup: Awaited<ReturnType<typeof getIntegrationHealthRollup>> & { ok: true };
}) {
  const subject = input.rollup.needsAttention
    ? `POS/CRM sync health: ${input.rollup.needsAttention} need attention`
    : "POS/CRM sync health: all clear";
  const lines = input.rollup.clients.map((client) => {
    const latest = client.health?.latestAt ? formatShortDate(client.health.latestAt) : "no events";
    const held = client.health?.held ?? 0;
    const eligible = client.health?.sendCandidateEligible ?? 0;
    const status = client.needsAttention ? "CHECK" : client.activeAutoSync ? "ACTIVE" : "MANUAL";
    return `${status} - ${client.clientName}: ${client.integration?.systemName ?? "No POS/CRM"}; latest ${latest}; held ${held}; eligible ${eligible}`;
  });
  const text = `POS/CRM sync health

Clients: ${input.rollup.totalClients}
Need attention: ${input.rollup.needsAttention}
Stale threshold: ${input.rollup.staleAfterHours} hours

${lines.join("\n")}

Client profiles:
https://getmefound.ai/mike-mc/clients

GetMeFound`;

  const rows = input.rollup.clients
    .map((client) => {
      const latest = client.health?.latestAt ? formatShortDate(client.health.latestAt) : "no events";
      const tone = client.needsAttention ? "#be123c" : client.activeAutoSync ? "#047857" : "#52525b";
      return `<tr>
        <td style="padding:10px;border-top:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(client.clientName)}</td>
        <td style="padding:10px;border-top:1px solid #e2e8f0;color:#475569;">${escapeHtml(client.integration?.systemName ?? "No POS/CRM")}</td>
        <td style="padding:10px;border-top:1px solid #e2e8f0;color:${tone};font-weight:700;">${client.needsAttention ? "Check" : client.activeAutoSync ? "Active" : "Manual"}</td>
        <td style="padding:10px;border-top:1px solid #e2e8f0;color:#475569;">${escapeHtml(latest)}</td>
      </tr>`;
    })
    .join("");
  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f6f7f4;color:#0f172a;font-family:Arial,sans-serif;">
    <div style="max-width:760px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#047857;">POS/CRM sync health</p>
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;color:#0f172a;">${input.rollup.needsAttention ? `${input.rollup.needsAttention} need attention` : "All clear"}</h1>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.5;color:#475569;">${input.rollup.totalClients} clients checked. Stale threshold: ${input.rollup.staleAfterHours} hours.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr>
              <th align="left" style="padding:10px;color:#64748b;">Client</th>
              <th align="left" style="padding:10px;color:#64748b;">System</th>
              <th align="left" style="padding:10px;color:#64748b;">Status</th>
              <th align="left" style="padding:10px;color:#64748b;">Latest</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin:24px 0 0;">
          <a href="https://getmefound.ai/mike-mc/clients" style="display:inline-block;border-radius:8px;background:#065f46;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:700;">Open client profiles</a>
        </p>
      </div>
    </div>
  </body>
</html>`;

  return {
    to: input.toEmail,
    subject,
    text,
    html,
  };
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
