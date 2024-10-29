"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const config_1 = require("./config");
const discord_1 = require("./discord");
const logger_1 = require("./logger");
const rss_1 = require("./rss");
let lastCheckedDate = new Date();
let checkInterval;
async function checkAndSendUpdates() {
    logger_1.Logger.info("Démarrage d'une nouvelle vérification...");
    const items = await (0, rss_1.fetchFeeds)(config_1.config.feeds);
    const newItems = items.filter((item) => {
        const itemDate = new Date(item.pubDate);
        return itemDate > lastCheckedDate;
    });
    logger_1.Logger.info(`${newItems.length} nouveaux articles trouvés`);
    for (const item of newItems) {
        await (0, discord_1.sendToDiscord)(config_1.config.discordWebhook, item);
    }
    lastCheckedDate = new Date();
    logger_1.Logger.info("Vérification terminée");
}
function validateConfig() {
    if (!config_1.config.discordWebhook) {
        logger_1.Logger.error("DISCORD_WEBHOOK_URL non définie dans les variables d'environnement");
        process.exit(1);
    }
    if (config_1.config.feeds.length === 0) {
        logger_1.Logger.warn("Aucun flux RSS configuré");
    }
}
async function gracefulShutdown() {
    logger_1.Logger.info("Arrêt du bot...");
    clearInterval(checkInterval);
    logger_1.Logger.success("Bot arrêté avec succès");
    process.exit(0);
}
// Gestion des signaux d'arrêt
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
// Démarrage de l'application
async function start() {
    try {
        logger_1.Logger.startup();
        validateConfig();
        logger_1.Logger.info("Configuration du bot:");
        logger_1.Logger.info(`- Intervalle de vérification: ${config_1.config.checkInterval} minutes`);
        logger_1.Logger.info(`- Nombre de flux RSS: ${config_1.config.feeds.length}`);
        logger_1.Logger.info(`- Niveau de log: ${config_1.config.logLevel}`);
        checkInterval = setInterval(checkAndSendUpdates, config_1.config.checkInterval * 60 * 1000);
        logger_1.Logger.info("Bot démarré avec succès");
        await checkAndSendUpdates(); // Première vérification immédiate
    }
    catch (error) {
        logger_1.Logger.error("Erreur fatale lors du démarrage:", error);
        process.exit(1);
    }
}
start();
