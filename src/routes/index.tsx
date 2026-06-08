import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CampaignCard } from "~/components/CampaignCard";
import { fetchCampaignsOverview } from "~/lib/campaigns.functions";

export const Route = createFileRoute("/")({
  loader: () => fetchCampaignsOverview(),
  component: DashboardPage,
});

function DashboardPage() {
  const overview = Route.useLoaderData();

  return (
    <div style={{ minHeight: "100vh", padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>LAInt</h1>
        <p style={{ margin: "4px 0 0", color: "var(--muted)" }}>
          Performance das campanhas ativas e sugestões de otimização baseadas no algoritmo da META
        </p>
      </header>

      {overview.length === 0 && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 24,
            color: "var(--muted)",
          }}
        >
          Nenhuma campanha encontrada. Verifique a configuração da conta de anúncios da META em{" "}
          <code>.env</code> (META_ACCESS_TOKEN, META_AD_ACCOUNT_ID).
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {overview.map(({ campaign, insights, suggestions }) => (
          <CampaignCard key={campaign.id} campaign={campaign} insights={insights} suggestions={suggestions} />
        ))}
      </div>
    </div>
  );
}
