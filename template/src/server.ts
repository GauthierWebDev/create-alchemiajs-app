import * as middlewares from "@/middlewares";
import * as filters from "@/filters";
import nunjucks from "nunjucks";
import routes from "@/routes";
import Fastify from "fastify";
import path from "path";

const server = Fastify({
  // enable minimization
});

const viewConfig = {
  engine: {
    nunjucks,
  },
  templates: [path.join(__dirname, "..", "views")],
  options: {
    onConfigure: (env: nunjucks.Environment) => {
      Object.keys(filters).forEach((filterName) => {
        env.addFilter(filterName, filters[filterName as keyof typeof filters]);
      });
    },
  },
};

server
  .register(require("@fastify/static"), {
    root: path.join(__dirname, "..", "public"),
    prefix: "/",
  })
  .register(require("@fastify/middie"))
  .register(require("@fastify/view"), viewConfig)
  .register(middlewares.createMiddleware(middlewares.poweredBy))
  .register(middlewares.createMiddleware(middlewares.lang))
  .register(routes);

export default server;
