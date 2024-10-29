// src/types.ts
export interface RSSFeed {
  title: string;
  link: string;
  items: RSSItem[];
}

// src/types.ts
export interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  budget?: string;
  categories?: string[];
}

export interface Config {
  discordWebhook: string;
  feeds: string[];
  checkInterval: number;
  logLevel: "debug" | "info" | "warn" | "error";
}
