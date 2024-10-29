// src/index.ts
import { config } from "./config";
import { sendToDiscord } from "./discord";
import { Logger } from "./logger";
import { fetchFeeds } from "./rss";

let lastCheckedDate = new Date();
let checkInterval: NodeJS.Timeout;

async function checkAndSendUpdates() {
  Logger.info("Démarrage d'une nouvelle vérification...");
  const items = await fetchFeeds(config.feeds);

  const newItems = items.filter((item) => {
    const itemDate = new Date(item.pubDate);
    return itemDate > lastCheckedDate;
  });

  Logger.info(`${newItems.length} nouveaux articles trouvés`);

  for (const item of newItems) {
    await sendToDiscord(config.discordWebhook, item);
  }

  lastCheckedDate = new Date();
  Logger.info("Vérification terminée");
}

function validateConfig() {
  if (!config.discordWebhook) {
    Logger.error(
      "DISCORD_WEBHOOK_URL non définie dans les variables d'environnement"
    );
    process.exit(1);
  }
  if (config.feeds.length === 0) {
    Logger.warn("Aucun flux RSS configuré");
  }
}

async function gracefulShutdown() {
  Logger.info("Arrêt du bot...");
  clearInterval(checkInterval);
  Logger.success("Bot arrêté avec succès");
  process.exit(0);
}

// Gestion des signaux d'arrêt
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Démarrage de l'application
async function start() {
  try {
    Logger.startup();
    validateConfig();

    Logger.info("Configuration du bot:");
    Logger.info(
      `- Intervalle de vérification: ${config.checkInterval} minutes`
    );
    Logger.info(`- Nombre de flux RSS: ${config.feeds.length}`);
    Logger.info(`- Niveau de log: ${config.logLevel}`);

    checkInterval = setInterval(
      checkAndSendUpdates,
      config.checkInterval * 60 * 1000
    );
    Logger.info("Bot démarré avec succès");
    await checkAndSendUpdates(); // Première vérification immédiate
  } catch (error) {
    Logger.error("Erreur fatale lors du démarrage:", error);
    process.exit(1);
  }
}

start();
