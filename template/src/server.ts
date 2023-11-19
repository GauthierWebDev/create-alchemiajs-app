import { ErrorController } from "./controllers";
import * as middlewares from "@/middlewares";
import * as filters from "@/filters";
import nunjucks from "nunjucks";
import express from "express";
import routes from "@/routes";
import path from "path";

const server = express();

server.use(middlewares.poweredBy);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, "..", "public")));
server.use(middlewares.minify);
server.use(middlewares.lang);

const env = nunjucks.configure(path.join(__dirname, "..", "views"), {
  autoescape: true,
  express: server,
});

Object.keys(filters).forEach((filterName) => {
  env.addFilter(filterName, filters[filterName as keyof typeof filters]);
});

server.use(routes);
server.use(ErrorController.prototype.notFound);

export default server;
