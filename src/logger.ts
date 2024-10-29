// src/logger.ts
export class Logger {
  private static colors = {
    reset: "\x1b[0m",
    gray: "\x1b[90m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    brightGreen: "\x1b[92m",
  };

  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  private static colorize(
    text: string,
    color: keyof typeof Logger.colors
  ): string {
    return `${Logger.colors[color]}${text}${Logger.colors.reset}`;
  }

  private static log(
    level: string,
    color: keyof typeof Logger.colors,
    message: string,
    ...args: any[]
  ) {
    const timestamp = this.colorize(this.getTimestamp(), "gray");
    const levelStr = this.colorize(level.padEnd(5), color);
    console.log(`${timestamp} ${levelStr} ${message}`, ...args);
  }

  static startup() {
    console.log(
      "\n" + this.colorize("╔════════════════════════════════════════╗", "cyan")
    );
    console.log(
      this.colorize("║        RSS TO DISCORD BOT - START      ║", "cyan")
    );
    console.log(
      this.colorize("╚════════════════════════════════════════╝\n", "cyan")
    );
  }

  static debug(message: string, ...args: any[]) {
    this.log("DEBUG", "blue", message, ...args);
  }

  static info(message: string, ...args: any[]) {
    this.log("INFO", "green", message, ...args);
  }

  static warn(message: string, ...args: any[]) {
    this.log("WARN", "yellow", message, ...args);
  }

  static error(message: string, ...args: any[]) {
    this.log("ERROR", "red", message, ...args);
  }

  static success(message: string) {
    this.log("OK", "brightGreen", message);
  }
}
