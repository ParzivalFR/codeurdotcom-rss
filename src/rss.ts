// src/rss.ts
import Parser from "rss-parser";
import { Logger } from "./logger";
import { RSSItem } from "./types";

const parser = new Parser({
  customFields: {
    item: [["description", "description"]],
  },
});

export async function fetchFeeds(urls: string[]): Promise<RSSItem[]> {
  try {
    Logger.info(`Récupération de ${urls.length} flux RSS...`);

    const feedPromises = urls.map((url) => {
      Logger.debug(`Lecture du flux: ${url}`);
      return parser.parseURL(url);
    });

    const feeds = await Promise.all(feedPromises);
    const items = feeds.flatMap((feed) =>
      feed.items.map((item) => ({
        title: item.title || "",
        link: item.link || "",
        pubDate: item.pubDate || "",
        description: item.description || "",
      }))
    );

    Logger.success(`${items.length} annonces récupérées avec succès`);
    return items;
  } catch (error) {
    Logger.error("Erreur lors de la récupération des feeds:", error);
    return [];
  }
}
