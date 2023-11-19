type AlchemiaResponse = {
  code: number;
  body: string | object | null;
};

type AlchemiaMethod = "get" | "post" | "put" | "delete";

type AlchemiaMethods = {
  [key: string]: AlchemiaMethod;
};

type AlchemiaRoutes = {
  [key: string]: string;
};

type AlchemiaMiddlewares = {
  [key: string]: import("express").RequestHandler[];
};

type AlchemiaController = {
  _middlewares: AlchemiaMiddlewares;
  _methods: AlchemiaMethods;
  _routes: AlchemiaRoutes;
};
