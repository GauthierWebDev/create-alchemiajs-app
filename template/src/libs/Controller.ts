import type { Request, Response, NextFunction } from "express";
import { findControllerMethodByPath } from "@/functions";
import { languages, settings } from "@/config";
import { Logger } from "@/utils";

class Controller {
  protected req: Request;
  protected res: Response;
  protected next: NextFunction;
  protected statusCode: number = 200;
  protected breadcrumbs: string[] = [];
  protected lang: string = languages.FALLBACK;
  protected params: { [key: string]: any } = {};
  protected readonly privateFields: string[] = [];

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.lang = req.originalUrl.split("/")[1] || languages.FALLBACK;

    this.log();
  }

  protected setBreadcrumbs(breadcrumbs: string[]) {
    this.breadcrumbs = breadcrumbs;
    return this;
  }

  protected addParam(key: string, value: any) {
    this.params[key] = value;
    return this;
  }

  protected removeParam(key: string) {
    delete this.params[key];
    return this;
  }

  protected setCode(code: number) {
    this.statusCode = code;
    return this;
  }

  protected sendNotFound() {
    const isApi = this.req.originalUrl.startsWith("/api");
    this.setCode(404);

    if (isApi) this.sendResponse();
    else this.render("errors/notFound");
  }

  protected async render(view: string, data: object = {}) {
    const params = {
      ...data,
      ...this.params,
      lang: this.lang,
      availableLanguages: languages.AVAILABLE,
      breadcrumbs: this.breadcrumbs,
      isProduction: settings.NODE_ENV === "production",
    };

    try {
      this.res
        .status(this.statusCode || 200)
        .render(`pages/${view}.njk`, params);

      this.log("out", view);
    } catch (error) {
      this.sendNotFound();
    }
  }

  protected sendResponse(data: object = {}): void {
    this.res.status(this.statusCode).json({
      ...this.params,
      ...data,
    });

    this.log("out");
  }

  protected removePrivateFields(data: { [key: string | number]: any }): {
    [key: string | number]: any;
  } {
    const newData = { ...data };

    for (const field of this.privateFields) {
      delete newData[field];
    }

    return newData;
  }

  protected log(direction: "in" | "out" = "in", view?: string): void {
    const arrow = direction === "in" ? "⬅️" : "➡️";

    const controllerMethod = findControllerMethodByPath(
      this.constructor.name,
      this.req.path
    );

    let message = `${arrow} `;
    message += ` [${this.req.method}] `;
    if (this.constructor.name && controllerMethod) {
      message += `| ${this.constructor.name}.${controllerMethod} `;
    }
    message += `| ${this.req.path}`;

    if (direction === "out") {
      if (this.statusCode >= 400) {
        message += ` | ${Logger.chalk.red.bold(this.statusCode)}`;
      } else if (this.statusCode >= 300) {
        message += ` | ${Logger.chalk.yellow.bold(this.statusCode)}`;
      } else {
        message += ` | ${Logger.chalk.green.bold(this.statusCode)}`;
      }

      if (view) message += ` | pages/${view}.njk`;
    }

    Logger.setTitle("⚙️ Controller", "info").addMessage(message).send();
  }
}

export default Controller;
