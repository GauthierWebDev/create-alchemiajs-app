import { buildRoutesFromController } from "@/functions";
import * as controllers from "@/controllers";
import { Router } from "express";
import { Logger } from "@/utils";
const router = Router();

Object.values(controllers).forEach((Controller: any) => {
  const middlewares: AlchemiaMiddlewares = Controller._middlewares;
  const httpMethods: AlchemiaMethods = Controller._methods;
  const routes: AlchemiaRoutes = Controller._routes;

  if (!httpMethods || !routes) return;
  Logger.debug(`Building routes for "${Controller.name}"`);

  router.use(
    buildRoutesFromController(Controller, routes, httpMethods, middlewares)
  );
});

export default router;
