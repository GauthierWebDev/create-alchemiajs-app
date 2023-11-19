import type { Request, Response, NextFunction } from "express";

/**
 * Middleware function to set the "X-Powered-By" header to "AlchemiaJS".
 *
 * @param _req - The request object.
 * @param res - The response object.
 * @param next - The next function to call.
 */
const minifyHtmlMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.set("X-Powered-By", "AlchemiaJS");

  next();
};

export default minifyHtmlMiddleware;
