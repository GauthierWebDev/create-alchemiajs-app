type AlchemiaResponse = {
  code: number;
  body: string | object | null;
};

type AlchemiaDictionaryTexts = {
  [key: string]: string | number | null | string[] | AlchemiaDictionaryTexts;
};

type AlchemiaDictionary = {
  language: string;
  texts: AlchemiaDictionaryTexts;
};

type AlchemiaMethod = "get" | "post" | "put" | "delete";

type AlchemiaMethods = {
  [key: string]: AlchemiaMethod;
};

type AlchemiaRoutes = {
  [key: string]: string;
};

type AlchemiaMiddlewares = {
  [key: string]: AlchemiaMiddleware[];
};

type AlchemiaMiddleware = (
  req: import("fastify").FastifyRequest,
  res: import("fastify").FastifyReply,
  next: (err?: Error) => void
) => void;

type AlchemiaController = {
  _middlewares: AlchemiaMiddlewares;
  _methods: AlchemiaMethods;
  _routes: AlchemiaRoutes;
};
