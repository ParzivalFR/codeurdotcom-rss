"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
// src/logger.ts
class Logger {
    static getTimestamp() {
        return new Date().toISOString();
    }
    static colorize(text, color) {
        return `${Logger.colors[color]}${text}${Logger.colors.reset}`;
    }
    static log(level, color, message, ...args) {
        const timestamp = this.colorize(this.getTimestamp(), "gray");
        const levelStr = this.colorize(level.padEnd(5), color);
        console.log(`${timestamp} ${levelStr} ${message}`, ...args);
    }
    static startup() {
        console.log("\n" + this.colorize("╔════════════════════════════════════════╗", "cyan"));
        console.log(this.colorize("║        RSS TO DISCORD BOT - START        ║", "cyan"));
        console.log(this.colorize("╚════════════════════════════════════════╝\n", "cyan"));
    }
    static debug(message, ...args) {
        this.log("DEBUG", "blue", message, ...args);
    }
    static info(message, ...args) {
        this.log("INFO", "green", message, ...args);
    }
    static warn(message, ...args) {
        this.log("WARN", "yellow", message, ...args);
    }
    static error(message, ...args) {
        this.log("ERROR", "red", message, ...args);
    }
    static success(message) {
        this.log("OK", "brightGreen", message);
    }
}
exports.Logger = Logger;
Logger.colors = {
    reset: "\x1b[0m",
    gray: "\x1b[90m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    brightGreen: "\x1b[92m",
};
