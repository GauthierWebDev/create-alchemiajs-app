import type { RequestHandler, Request, Response, NextFunction } from "express";
import { buildLangRoutePrefix } from "@/functions";
import { languages } from "@/config";
import { Router } from "express";
import { Logger } from "@/utils";

const router = Router();

type AlchemiaRouteHistory = {
  middlewares: string[];
  classMethod: string;
  httpMethod: string;
  route: string;
};

const buildRoutesFromController = (
  Controller: any,
  routes: AlchemiaRoutes,
  httpMethods: AlchemiaMethods,
  middlewares: AlchemiaMiddlewares
) => {
  const addedRoutes: AlchemiaRouteHistory[] = [];
  const errorRoutes: AlchemiaRouteHistory[] = [];

  Object.entries(routes).forEach(([key, route]) => {
    try {
      const method = httpMethods[key];
      if (!method) return;

      const middlewaresToApply: RequestHandler[] = [];

      if (middlewares && middlewares[key]) {
        middlewaresToApply.push(...middlewares[key]);
      }

      if (!route.startsWith("/api")) {
        route = `/${buildLangRoutePrefix()}/${route}`
          .replace(/\/+/g, "/")
          .replace(/\/$/, "");
      }

      router[method](
        route,
        ...middlewaresToApply,
        (req: Request, res: Response, next: NextFunction) => {
          const instance = new Controller(req, res, next);
          instance[key]();
        }
      );

      addedRoutes.push({
        middlewares: middlewaresToApply.map((middleware) => middleware.name),
        httpMethod: httpMethods[key],
        classMethod: key,
        route,
      });
    } catch (err: any) {
      Logger.setTitle(`💀 Error building route "${route}"`, "error")
        .addMessage(err?.message)
        .send();

      errorRoutes.push({
        middlewares: middlewares[key].map((middleware) => middleware.name),
        httpMethod: httpMethods[key],
        classMethod: key,
        route,
      });
    }
  });

  if (addedRoutes.length) {
    Logger.debug(
      `${addedRoutes.length} route(s) added for the controller "${Controller.name}":`,
      ...addedRoutes.map((route) => {
        return `\n -> [${route.httpMethod.toUpperCase()}] ${route.route} => ${
          Controller.name
        }.${route.classMethod}`;
      })
    );
  }

  if (errorRoutes.length) {
    Logger.debug(
      `${errorRoutes.length} route(s) failed to be added for the controller "${Controller.name}":`,
      ...errorRoutes.map((route) => {
        return `\n -> [${route.httpMethod.toUpperCase()}] ${route.route} => ${
          Controller.name
        }.${route.classMethod}`;
      })
    );
  }

  return router;
};

export default buildRoutesFromController;
