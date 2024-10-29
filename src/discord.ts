// src/discord.ts
import axios from "axios";
import { decodeHtmlEntities } from "./config";
import { Logger } from "./logger";
import { RSSItem } from "./types";

export async function sendToDiscord(
  webhookUrl: string,
  item: RSSItem
): Promise<void> {
  try {
    Logger.debug(`Envoi de l'annonce "${item.title}" vers Discord`);

    // Décodage du titre et de la description
    const cleanTitle = decodeHtmlEntities(item.title);
    const cleanDescription = decodeHtmlEntities(item.description);

    // Extraction du budget et des catégories depuis la description nettoyée
    const budgetMatch = cleanDescription.match(/Budget : ([^-]+)/);
    const budget = budgetMatch ? budgetMatch[1].trim() : "Demande de devis";

    const categoriesMatch = cleanDescription.match(/Catégories : ([^<]+)/);
    const categories = categoriesMatch
      ? categoriesMatch[1].split(",").map((cat) => cat.trim())
      : [];

    // Extraction de la description principale
    const descriptionMatch = cleanDescription.match(/<p>([^<]+)<\/p>/g);
    const mainDescription = descriptionMatch
      ? decodeHtmlEntities(descriptionMatch[1]?.replace(/<\/?p>/g, "").trim())
      : "";

    // Formatage de la date en français
    const date = new Date(item.pubDate);
    const formattedDate = `${date.getDate()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const embed = {
      author: {
        name: "Codeur.com RSS Bot • Nouveau projet",
      },
      title: cleanTitle,
      url: item.link,
      color: 0x4a90e2,
      description: mainDescription,
      fields: [
        {
          name: "💰 Budget",
          value: budget,
          inline: false,
        },
        {
          name: "📁 Catégories",
          value: categories.join(" • "),
          inline: true,
        },
      ],
      footer: {
        text: `Publié le ${formattedDate}`,
      },
    };

    await axios.post(webhookUrl, { embeds: [embed] });
    Logger.success(`Annonce "${cleanTitle}" envoyée avec succès`);
  } catch (error) {
    Logger.error(`Erreur lors de l'envoi de l'annonce vers Discord:`, error);
  }
}
