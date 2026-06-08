import type { MetaCampaign, MetaCampaignInsights } from "./types";

const GRAPH_BASE = "https://graph.facebook.com";

function apiVersion() {
  return process.env.META_API_VERSION ?? "v23.0";
}

function accessToken() {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) throw new Error("META_ACCESS_TOKEN não configurado");
  return token;
}

async function metaGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${GRAPH_BASE}/${apiVersion()}${path}`);
  url.searchParams.set("access_token", accessToken());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Meta Graph API error (${response.status}): ${body}`);
  }
  return response.json() as Promise<T>;
}

export async function listCampaigns(adAccountId = process.env.META_AD_ACCOUNT_ID ?? "") {
  if (!adAccountId) throw new Error("META_AD_ACCOUNT_ID não configurado");

  const data = await metaGet<{ data: MetaCampaign[] }>(`/act_${adAccountId}/campaigns`, {
    fields: "id,name,status,objective,daily_budget",
  });
  return data.data;
}

export async function getCampaignInsights(
  campaignId: string,
  options: { since?: string; until?: string } = {},
): Promise<MetaCampaignInsights | null> {
  const params: Record<string, string> = {
    fields:
      "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,reach,frequency,actions,cost_per_action_type",
  };
  if (options.since && options.until) {
    params.time_range = JSON.stringify({ since: options.since, until: options.until });
  } else {
    params.date_preset = "last_7d";
  }

  const data = await metaGet<{ data: any[] }>(`/${campaignId}/insights`, params);
  const row = data.data[0];
  if (!row) return null;

  const conversions = (row.actions ?? [])
    .filter((a: any) => a.action_type === "offsite_conversion" || a.action_type === "lead")
    .reduce((sum: number, a: any) => sum + Number(a.value ?? 0), 0);

  const costPerConversion = (row.cost_per_action_type ?? []).find(
    (a: any) => a.action_type === "offsite_conversion" || a.action_type === "lead",
  );

  return {
    campaignId: row.campaign_id,
    campaignName: row.campaign_name,
    spend: Number(row.spend ?? 0),
    impressions: Number(row.impressions ?? 0),
    clicks: Number(row.clicks ?? 0),
    ctr: Number(row.ctr ?? 0),
    cpc: Number(row.cpc ?? 0),
    cpm: Number(row.cpm ?? 0),
    conversions,
    costPerConversion: Number(costPerConversion?.value ?? 0),
    reach: Number(row.reach ?? 0),
    frequency: Number(row.frequency ?? 0),
    dateStart: row.date_start,
    dateStop: row.date_stop,
  };
}
