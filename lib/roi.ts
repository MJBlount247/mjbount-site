import type { ROIConfig } from "./types";

export type ROIResult = {
  estimatedRevenue: number;
  monthlyCost: number;
  costPerLead: number;
  roiMultiplier: number;
  verdict: string;
  verdictLevel: "good" | "warning" | "issue";
};

export function calculateROI(
  config: ROIConfig,
  conversionCounts: Record<string, number>
): ROIResult {
  const monthlyCost =
    config.monthly_retainer + config.build_cost / config.amortise_months;

  const estimatedRevenue = config.conversion_types.reduce((sum, ct) => {
    const count = conversionCounts[ct.ga4_event] ?? 0;
    return sum + count * config.close_rate * ct.value;
  }, 0);

  const totalLeads = config.conversion_types.reduce((sum, ct) => {
    return sum + (conversionCounts[ct.ga4_event] ?? 0);
  }, 0);

  const costPerLead = totalLeads > 0 ? monthlyCost / totalLeads : 0;
  const roiMultiplier = monthlyCost > 0 ? estimatedRevenue / monthlyCost : 0;

  let verdict: string;
  let verdictLevel: ROIResult["verdictLevel"];

  if (roiMultiplier >= 3) {
    verdict = `Generating an estimated £${Math.round(estimatedRevenue).toLocaleString()} per month — ${roiMultiplier.toFixed(1)}× the investment.`;
    verdictLevel = "good";
  } else if (roiMultiplier >= 1) {
    verdict = `Returning ${roiMultiplier.toFixed(1)}× on investment. Room to grow with optimisation.`;
    verdictLevel = "warning";
  } else {
    verdict = `ROI is below 1×. Review conversion rates and consider optimisation.`;
    verdictLevel = "issue";
  }

  return {
    estimatedRevenue,
    monthlyCost,
    costPerLead,
    roiMultiplier,
    verdict,
    verdictLevel,
  };
}
