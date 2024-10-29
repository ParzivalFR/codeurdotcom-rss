"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFeeds = fetchFeeds;
// src/rss.ts
const rss_parser_1 = __importDefault(require("rss-parser"));
const logger_1 = require("./logger");
const parser = new rss_parser_1.default({
    customFields: {
        item: [["description", "description"]],
    },
});
async function fetchFeeds(urls) {
    try {
        logger_1.Logger.info(`Récupération de ${urls.length} flux RSS...`);
        const feedPromises = urls.map((url) => {
            logger_1.Logger.debug(`Lecture du flux: ${url}`);
            return parser.parseURL(url);
        });
        const feeds = await Promise.all(feedPromises);
        const items = feeds.flatMap((feed) => feed.items.map((item) => ({
            title: item.title || "",
            link: item.link || "",
            pubDate: item.pubDate || "",
            description: item.description || "",
        })));
        logger_1.Logger.success(`${items.length} annonces récupérées avec succès`);
        return items;
    }
    catch (error) {
        logger_1.Logger.error("Erreur lors de la récupération des feeds:", error);
        return [];
    }
}
