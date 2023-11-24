import { settings } from "@/config";
import { Logger } from "@/utils";
import server from "@/server";

server.listen({ port: settings.PORT }, () => {
  const parts = [];

  parts.push(Logger.chalk.green("Server started at:"));
  parts.push(Logger.chalk.yellow(`-> http://localhost:${settings.PORT}`));

  if (settings.DOMAIN !== "localhost") {
    parts.push(
      Logger.chalk.yellow(`-> ${settings.PROTOCOL}://${settings.DOMAIN}`)
    );
  }

  parts.push("---------");
  parts.push(Logger.chalk.green("Settings:"));
  parts.push(Logger.chalk.yellow(`-> PROTOCOL: ${settings.PROTOCOL}`));
  parts.push(Logger.chalk.yellow(`-> DOMAIN: ${settings.DOMAIN}`));
  parts.push(Logger.chalk.yellow(`-> PORT: ${settings.PORT}`));
  parts.push(Logger.chalk.yellow(`-> NODE_ENV: ${settings.NODE_ENV}`));
  parts.push(Logger.chalk.yellow(`-> LOG_LEVEL: ${settings.LOG_LEVEL}`));

  Logger.setTitle("🚀 Server").addMessage(parts.join("\n")).send();
});
