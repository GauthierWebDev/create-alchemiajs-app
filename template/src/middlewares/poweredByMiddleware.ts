import type { FastifyRequest, FastifyReply } from "fastify";

/**
 * Middleware function to set the "X-Powered-By" header to "AlchemiaJS".
 * @param _req - Fastify request object.
 * @param res - Fastify reply object.
 * @param next - Fastify next function.
 */
const minifyHtmlMiddleware = async (
  _req: FastifyRequest,
  res: FastifyReply,
  next: Function
) => {
  res.header("X-Powered-By", "AlchemiaJS");
  next();
};

export default minifyHtmlMiddleware;
