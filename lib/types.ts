// ─── Client config ──────────────────────────────────────────────────────────

export type LogoVariant = {
  file: string;
  description: string;
  use_on: string;
};

export type ConversionType = {
  name: string;
  ga4_event: string;
  value: number;
};

export type ROIConfig = {
  close_rate: number;
  build_cost: number;
  amortise_months: number;
  monthly_retainer: number;
  conversion_types: ConversionType[];
};

export type Plugin = {
  name: string;
  status: "up_to_date" | "update_available" | "critical_update";
};

export type MaintenanceData = {
  wordpress_version: string;
  php_version: string;
  php_target: string;
  ssl_expiry: string;
  plugins: Plugin[];
};

export type ClientConfig = {
  client: string;
  slug: string;
  domain: string;
  ga4_property_id: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  brand: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    font_heading: string;
    font_heading_weight: string;
    font_subheading: string;
    font_subheading_weight: string;
    font_body: string;
    font_body_weight: string;
    font_fallback: string;
    font_notes: string;
    logo: {
      _note?: string;
      full_orange_on_black: LogoVariant;
      full_white_on_black: LogoVariant;
      full_white_on_red: LogoVariant;
      icon_white_on_black: LogoVariant;
      icon_black_on_white: LogoVariant;
      icon_orange_on_white: LogoVariant;
    };
    logo_usage: string;
    logo_designer: string;
    tone_of_voice: string;
    brand_personality: string;
    tagline: string;
  };
  social: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
  };
  business: {
    type: string;
    location: string;
    founded: string;
    description: string;
    usp: string;
    services: string[];
    sub_brands: Array<{ name: string; url: string; description: string }>;
    target_audience: string;
  };
  website: {
    platform: string;
    built_by: string;
    key_pages: Array<{ label: string; url: string }>;
    key_conversions: string[];
    gtm_container_id: string;
    analytics_goals: string[];
  };
  dashboard: {
    theme_override: {
      card_radius: string;
      chart_color_primary: string;
      chart_color_secondary: string;
      chart_color_dark: string;
      dashboard_logo: string;
      dashboard_background: string;
      dashboard_text: string;
    };
  };
  roi?: ROIConfig;
  maintenance?: MaintenanceData;
  notes: string;
};

// ─── Analytics ───────────────────────────────────────────────────────────────

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

// ─── PageSpeed ────────────────────────────────────────────────────────────────

export type SpeedOpportunity = {
  title: string;
  description: string;
  savingsMs: number;
};

export type SpeedMetrics = {
  score: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  lcp: string;
  cls: string;
  inp: string;
  fcp: string;
  ttfb: string;
  speedIndex: string;
  opportunities: SpeedOpportunity[];
};

export type SpeedData = {
  mobile: SpeedMetrics;
  desktop: SpeedMetrics;
  url: string;
  fetchedAt: string;
};

// ─── Cache ───────────────────────────────────────────────────────────────────

export type CachedSummary = {
  summary: string;
  generatedAt: string;
};

// ─── Dashboard modules ────────────────────────────────────────────────────────

export type ModuleStatus = "good" | "warning" | "issue" | "info";

export type ModuleDef = {
  id: string;
  title: string;
  status: ModuleStatus;
  metric: string;
  metricLabel: string;
  findings: string[];
};
