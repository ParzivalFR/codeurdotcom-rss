// src/config.ts
import { config as dotenvConfig } from "dotenv";
import { Config } from "./types";

dotenvConfig();

export const config: Config = {
  discordWebhook: process.env.DISCORD_WEBHOOK_URL as string,
  feeds: [
    "https://www.codeur.com/projects?c=developpement&format=rss",
    "https://www.codeur.com/projects?c=web&format=rss",
    "https://www.codeur.com/projects?format=rss",
  ],
  checkInterval: 5,
  logLevel: (process.env.LOG_LEVEL as Config["logLevel"]) || "info",
};

// src/utils.ts
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, (match) => {
      const dec = parseInt(match.match(/\d+/)![0], 10);
      return String.fromCharCode(dec);
    });
}
