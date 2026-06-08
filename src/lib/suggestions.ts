import type { CreativeSuggestion, MetaCampaignInsights } from "~/integrations/meta/types";

/**
 * Heurísticas baseadas em sinais que o algoritmo de entrega da META usa para
 * decidir o ritmo de veiculação (frequência, CTR, custo por resultado, fadiga
 * de criativo). Cada regra gera uma sugestão acionável para a campanha.
 */
export function buildSuggestions(insights: MetaCampaignInsights): CreativeSuggestion[] {
  const suggestions: CreativeSuggestion[] = [];
  const base = { campaignId: insights.campaignId, adId: insights.campaignId, adName: insights.campaignName };

  if (insights.frequency > 3) {
    suggestions.push({
      ...base,
      severity: "warning",
      title: "Possível fadiga de criativo",
      metric: `Frequência: ${insights.frequency.toFixed(2)}`,
      description: "O público está vendo o mesmo anúncio repetidamente, o que tende a reduzir o CTR e elevar o CPM.",
      recommendation: "Renove o criativo (imagem, vídeo ou copy) ou amplie o público para distribuir as impressões.",
    });
  }

  if (insights.ctr < 1) {
    suggestions.push({
      ...base,
      severity: "warning",
      title: "CTR abaixo da média",
      metric: `CTR: ${insights.ctr.toFixed(2)}%`,
      description: "Um CTR baixo sinaliza ao algoritmo da META que o criativo é pouco relevante, prejudicando a entrega.",
      recommendation: "Teste novos ganchos visuais e headlines nos primeiros segundos do criativo para aumentar a relevância.",
    });
  }

  if (insights.conversions > 0 && insights.costPerConversion > 0) {
    const targetCpa = insights.spend > 0 ? insights.spend / Math.max(insights.conversions, 1) : 0;
    if (targetCpa > insights.costPerConversion * 1.3) {
      suggestions.push({
        ...base,
        severity: "critical",
        title: "Custo por conversão acima do esperado",
        metric: `Custo/conversão: R$ ${insights.costPerConversion.toFixed(2)}`,
        description: "O custo por resultado está subindo, indicando que o algoritmo está tendo dificuldade em encontrar conversores qualificados.",
        recommendation: "Revise o evento de otimização e o público de conversão; considere ajustar o orçamento para sair da fase de aprendizagem.",
      });
    }
  }

  if (insights.spend > 0 && insights.conversions === 0) {
    suggestions.push({
      ...base,
      severity: "critical",
      title: "Sem conversões registradas",
      metric: `Gasto: R$ ${insights.spend.toFixed(2)}`,
      description: "A campanha está consumindo orçamento sem gerar conversões, o que pode travar a fase de aprendizagem do algoritmo.",
      recommendation: "Verifique a configuração do pixel/evento de conversão e avalie pausar a campanha até corrigir o rastreamento.",
    });
  }

  if (insights.cpm > 0 && insights.reach > 0 && insights.impressions / Math.max(insights.reach, 1) > 4) {
    suggestions.push({
      ...base,
      severity: "info",
      title: "Saturação de público",
      metric: `Impressões/Alcance: ${(insights.impressions / Math.max(insights.reach, 1)).toFixed(1)}x`,
      description: "O anúncio está sendo entregue muitas vezes para o mesmo público, sinal de que o público pode estar pequeno demais.",
      recommendation: "Amplie o público-alvo ou crie públicos semelhantes (lookalike) para dar mais espaço ao algoritmo de entrega.",
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      ...base,
      severity: "info",
      title: "Performance saudável",
      metric: `CTR: ${insights.ctr.toFixed(2)}% · Freq: ${insights.frequency.toFixed(2)}`,
      description: "Os indicadores principais estão dentro do esperado para o algoritmo de entrega da META.",
      recommendation: "Mantenha o monitoramento e considere escalar o orçamento gradualmente (incrementos de até 20% a cada 3 dias).",
    });
  }

  return suggestions;
}
