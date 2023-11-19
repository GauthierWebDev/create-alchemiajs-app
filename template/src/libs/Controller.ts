import type { Request, Response, NextFunction } from "express";
import { findControllerMethodByPath } from "@/functions";
import { Logger } from "@/utils";

/**
 * Represents a controller class that handles HTTP requests and responses.
 */
class Controller {
  protected req: Request;
  protected res: Response;
  protected next: NextFunction;
  protected statusCode: number = 200;
  protected params: { [key: string]: any } = {};
  protected readonly privateFields: string[] = [];

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;

    this.log();
  }

  protected addParam(key: string, value: any) {
    this.params[key] = value;
    return this;
  }

  /**
   * Removes a parameter from the controller's params object.
   * @param key - The key of the parameter to be removed.
   * @returns The updated instance of the controller.
   */
  protected removeParam(key: string) {
    delete this.params[key];
    return this;
  }

  /**
   * Sets the status code for the instance.
   * @param code - The status code to set.
   * @returns The updated instance of the controller.
   */
  protected setCode(code: number) {
    this.statusCode = code;
    return this;
  }

  /**
   * Sends a 404 Not Found response.
   */
  protected sendNotFound() {
    this.setCode(404).sendResponse();
  }

  /**
   * Sends a response with the specified data.
   * @param data The data to be included in the response.
   */
  protected sendResponse(data: object = {}): void {
    this.res.status(this.statusCode).json({
      ...this.params,
      ...data,
    });

    this.log("out");
  }

  /**
   * Removes private fields from the given data object.
   * @param data - The data object from which to remove private fields.
   * @returns A new object with the private fields removed.
   */
  protected removePrivateFields(data: { [key: string | number]: any }): {
    [key: string | number]: any;
  } {
    const newData = { ...data };

    for (const field of this.privateFields) {
      delete newData[field];
    }

    return newData;
  }

  /**
   * Logs the controller method execution and request/response information.
   * @param direction - The direction of the log, either "in" for incoming request or "out" for outgoing response. Default is "in".
   */
  protected log(direction: "in" | "out" = "in"): void {
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
    }

    Logger.setTitle("⚙️ Controller", "info").addMessage(message).send();
  }
}

export default Controller;
