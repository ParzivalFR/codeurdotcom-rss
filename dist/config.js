"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// src/config.ts
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.config = {
    discordWebhook: process.env.DISCORD_WEBHOOK_URL,
    feeds: [
        "https://www.codeur.com/projects?c=developpement&format=rss",
        "https://www.codeur.com/projects?c=web&format=rss",
        "https://www.codeur.com/projects?format=rss",
    ],
    checkInterval: 5,
    logLevel: process.env.LOG_LEVEL || "info",
};
