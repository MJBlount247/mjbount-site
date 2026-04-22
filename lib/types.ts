export type ClientConfig = {
  slug: string;
  name: string;
  tagline: string;
  brand: {
    primary: string;
    secondary: string;
    accent: string;
    primaryText: string;
    secondaryText: string;
  };
  logo: {
    dark: string;
    darkFull: string;
    light: string;
    red: string;
    redFull: string;
  };
  ga4PropertyId: string;
  gtmContainerId: string;
  business: {
    type: string;
    location: string;
    website: string;
    services: string[];
  };
  toneOfVoice: string;
  dashboard: {
    reportingPeriodDays: number;
  };
};

export type DailyMetric = {
  date: string;
  sessions: number;
  users: number;
  pageviews: number;
};

export type TrafficSource = {
  source: string;
  medium: string;
  sessions: number;
};

export type TopPage = {
  path: string;
  title: string;
  pageviews: number;
  avgDurationSeconds: number;
};

export type AnalyticsSummary = {
  sessions: number;
  users: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDurationSeconds: number;
  trend: number;
};

export type AnalyticsData = {
  summary: AnalyticsSummary;
  daily: DailyMetric[];
  sources: TrafficSource[];
  topPages: TopPage[];
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
};
