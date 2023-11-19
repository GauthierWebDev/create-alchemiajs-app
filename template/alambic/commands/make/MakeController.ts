import { SubCommand } from "@/alambic/libs";
import { Logger } from "@/utils";
import fs from "fs";

class MakeControllerSubCommand extends SubCommand {
  constructor(subcommandData: AlambicSubCommandData, command: string) {
    super(subcommandData, command);
  }

  private doesControllerExist(controllerName: string): boolean {
    const controllerPath = `src/controllers/${controllerName}.ts`;
    return fs.existsSync(controllerPath);
  }

  private replaceTemplateVariables(controllerName: string): string {
    return fs
      .readFileSync("alambic/templates/Controller.template", "utf-8")
      .replace(/\$1/g, controllerName)
      .replace(
        "$2",
        controllerName
          .replace(/Controller/gi, "")
          .split(/(?=[A-Z])/)
          .join("-")
          .toLowerCase()
      );
  }

  private writeController(controllerName: string): void {
    const controllerPath = `src/controllers/${controllerName}.ts`;
    const controllerTemplate = this.replaceTemplateVariables(controllerName);
    fs.writeFileSync(controllerPath, controllerTemplate);
  }

  private filterControllerName(controllerName: string): string {
    controllerName = controllerName
      .replace(/Controller/gi, "")
      .replace(/[^a-zA-Z]/g, " ")
      .replace(/\s+/g, " ");

    const parts = controllerName.split(" ");

    return (
      parts
        .map((part) => {
          const firstLetter = part.charAt(0).toUpperCase();
          const rest = part.slice(1).toLowerCase();
          return firstLetter + rest;
        })
        .join("") + "Controller"
    );
  }

  private appendExports(controllerName: string): void {
    const controllersPath = "src/controllers/index.ts";
    const controllerExport = `export { default as ${controllerName} } from "./${controllerName}";\n`;

    fs.appendFileSync(controllersPath, controllerExport);
  }

  public action(args: string[]): void {
    let [controllerName] = args;

    if (!controllerName) {
      Logger.setTitle("🧪 Alambic", "error")
        .addMessage(`Missing controller name`)
        .send();
      process.exit(1);
    }

    controllerName = this.filterControllerName(controllerName);

    if (this.doesControllerExist(controllerName)) {
      Logger.setTitle("🧪 Alambic", "error")
        .addMessage(`Controller "${controllerName}" already exists`)
        .send();
      process.exit(1);
    }

    this.writeController(controllerName);
    this.appendExports(controllerName);

    Logger.setTitle("🧪 Alambic", "success")
      .addMessage(`Controller "${controllerName}" created successfully!`)
      .send();
  }
}

export default MakeControllerSubCommand;
