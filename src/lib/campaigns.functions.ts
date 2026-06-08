import { createServerFn } from "@tanstack/react-start";
import { getCampaignInsights, listCampaigns } from "~/integrations/meta/client.server";
import { buildSuggestions } from "~/lib/suggestions";

export const fetchCampaignsOverview = createServerFn({ method: "GET" }).handler(async () => {
  const campaigns = await listCampaigns();

  const overview = await Promise.all(
    campaigns.map(async (campaign) => {
      const insights = await getCampaignInsights(campaign.id);
      return {
        campaign,
        insights,
        suggestions: insights ? buildSuggestions(insights) : [],
      };
    }),
  );

  return overview;
});
