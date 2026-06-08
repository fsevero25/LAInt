export interface MetaCampaign {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED";
  objective: string;
  dailyBudget?: number;
}

export interface MetaCampaignInsights {
  campaignId: string;
  campaignName: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversions: number;
  costPerConversion: number;
  reach: number;
  frequency: number;
  dateStart: string;
  dateStop: string;
}

export interface CreativeSuggestion {
  campaignId: string;
  adId: string;
  adName: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  metric: string;
  recommendation: string;
}
