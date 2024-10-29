"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToDiscord = sendToDiscord;
// src/discord.ts
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("./logger");
async function sendToDiscord(webhookUrl, item) {
    try {
        logger_1.Logger.debug(`Envoi de l'annonce "${item.title}" vers Discord`);
        // Extraction du budget et des catégories depuis la description
        const budgetMatch = item.description.match(/Budget : ([^-]+)/);
        const budget = budgetMatch ? budgetMatch[1].trim() : "Demande de devis";
        const categoriesMatch = item.description.match(/Catégories : ([^<]+)/);
        const categories = categoriesMatch
            ? categoriesMatch[1].split(",").map((cat) => cat.trim())
            : [];
        // Extraction de la description principale
        const descriptionMatch = item.description.match(/<p>([^<]+)<\/p>/g);
        const mainDescription = descriptionMatch
            ? descriptionMatch[1]?.replace(/<\/?p>/g, "").trim()
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
            title: item.title,
            url: item.link,
            color: 0x4a90e2, // Bleu comme dans vos captures
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
                    inline: false,
                },
            ],
            footer: {
                text: `Publié le ${formattedDate}`,
            },
        };
        await axios_1.default.post(webhookUrl, { embeds: [embed] });
        logger_1.Logger.success(`Annonce "${item.title}" envoyée avec succès`);
    }
    catch (error) {
        logger_1.Logger.error(`Erreur lors de l'envoi de l'annonce "${item.title}" à Discord:`, error);
    }
}
