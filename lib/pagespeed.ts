import type { SpeedData } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractMetrics(result: any) {
  const cat = result.lighthouseResult.categories
  const audits = result.lighthouseResult.audits

  return {
    score:         Math.round((cat?.performance?.score ?? 0) * 100),
    seo:           Math.round((cat?.seo?.score ?? 0) * 100),
    accessibility: Math.round((cat?.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((cat?.['best-practices']?.score ?? 0) * 100),
    lcp:  audits?.['largest-contentful-paint']?.displayValue ?? 'n/a',
    cls:  audits?.['cumulative-layout-shift']?.displayValue ?? 'n/a',
    inp:  audits?.['interaction-to-next-paint']?.displayValue ?? 'n/a',
    fcp:  audits?.['first-contentful-paint']?.displayValue ?? 'n/a',
    ttfb: audits?.['server-response-time']?.displayValue ?? 'n/a',
    speedIndex: audits?.['speed-index']?.displayValue ?? 'n/a',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    opportunities: Object.values(audits ?? {})
      .filter((a: any) => a.details?.type === 'opportunity'
        && a.details?.overallSavingsMs > 0)
      .sort((a: any, b: any) =>
        b.details.overallSavingsMs - a.details.overallSavingsMs)
      .slice(0, 4)
      .map((a: any) => ({
        title: a.title,
        description: a.description,
        savingsMs: Math.round(a.details.overallSavingsMs),
      })),
  }
}

export async function getSpeedScore(url: string): Promise<SpeedData | null> {
  const key = process.env.PAGESPEED_API_KEY;
  const base = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

  try {
    const [mobileData, desktopData] = await Promise.all(
      (["mobile", "desktop"] as const).map((strategy) =>
        fetch(
          `${base}?url=${encodeURIComponent(url)}&strategy=${strategy}${key ? `&key=${key}` : ""}`,
          { next: { revalidate: 3600 } }
        ).then((r) => {
          if (!r.ok) throw new Error(`PageSpeed ${r.status}`);
          return r.json();
        })
      )
    );

    return {
      mobile:  extractMetrics(mobileData),
      desktop: extractMetrics(desktopData),
      url,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("PageSpeed fetch failed:", err);
    return null;
  }
}
