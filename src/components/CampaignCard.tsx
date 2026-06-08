import React from "react";
import type { CreativeSuggestion, MetaCampaign, MetaCampaignInsights } from "~/integrations/meta/types";

const severityColor: Record<CreativeSuggestion["severity"], string> = {
  info: "var(--accent)",
  warning: "var(--warning)",
  critical: "var(--danger)",
};

const statusLabel: Record<MetaCampaign["status"], string> = {
  ACTIVE: "Ativa",
  PAUSED: "Pausada",
  DELETED: "Excluída",
  ARCHIVED: "Arquivada",
};

interface CampaignCardProps {
  campaign: MetaCampaign;
  insights: MetaCampaignInsights | null;
  suggestions: CreativeSuggestion[];
}

export function CampaignCard({ campaign, insights, suggestions }: CampaignCardProps) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16 }}>{campaign.name}</h3>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>{campaign.objective}</span>
        </div>
        <span
          style={{
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 999,
            background: campaign.status === "ACTIVE" ? "rgba(92,184,122,0.15)" : "rgba(136,143,152,0.15)",
            color: campaign.status === "ACTIVE" ? "var(--success)" : "var(--muted)",
          }}
        >
          {statusLabel[campaign.status]}
        </span>
      </header>

      {insights && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 12 }}>
          <Metric label="Gasto" value={`R$ ${insights.spend.toFixed(2)}`} />
          <Metric label="Impressões" value={insights.impressions.toLocaleString("pt-BR")} />
          <Metric label="CTR" value={`${insights.ctr.toFixed(2)}%`} />
          <Metric label="CPC" value={`R$ ${insights.cpc.toFixed(2)}`} />
          <Metric label="Frequência" value={insights.frequency.toFixed(2)} />
          <Metric label="Conversões" value={String(insights.conversions)} />
        </div>
      )}

      {suggestions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Sugestões de melhoria
          </span>
          {suggestions.map((suggestion) => (
            <div
              key={`${suggestion.campaignId}-${suggestion.title}`}
              style={{
                borderLeft: `3px solid ${severityColor[suggestion.severity]}`,
                background: "var(--surface-raised)",
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong style={{ fontSize: 14 }}>{suggestion.title}</strong>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{suggestion.metric}</span>
              </div>
              <p style={{ margin: "6px 0", fontSize: 13, color: "var(--muted)" }}>{suggestion.description}</p>
              <p style={{ margin: 0, fontSize: 13 }}>{suggestion.recommendation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
