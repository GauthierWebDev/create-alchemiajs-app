import type { Request, Response, NextFunction } from "express";
import htmlminify from "html-minifier-terser";
import { Logger } from "@/utils";

/**
 * Middleware function that minifies the HTML body before sending it.
 * It also calculates the compression ratio and logs the compression details.
 * If an error occurs during compression, it logs the error and sends the original body.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call in the middleware chain.
 */
const minifyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const send = res.send;

  res.send = async function (body: string) {
    try {
      const minifiedContent =
        (await htmlminify.minify(body, {
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeAttributeQuotes: true,
        })) || body;

      const kbBeforeCompression = Buffer.byteLength(body, "utf8") / 1024;
      const kbAfterCompression =
        Buffer.byteLength(minifiedContent, "utf8") / 1024;

      const difference = kbBeforeCompression - kbAfterCompression;
      const ratio = (kbAfterCompression / kbBeforeCompression) * 100;

      send.call(res, minifiedContent);

      const rawKb = `${kbBeforeCompression.toFixed(2)}kb`;
      const compressedKb = `${kbAfterCompression.toFixed(2)}kb`;
      const compression = `Response compression: ${rawKb} -> ${compressedKb}`;

      const savedKbRatio = `${Math.round(ratio)}%`;
      const savedKb = `${difference.toFixed(2)}kb saved | ${savedKbRatio}`;

      Logger.debug(`${compression} (${savedKb})`);
    } catch (error: any) {
      Logger.setTitle("Response compression", "error")
        .addMessage(error.message)
        .send();
      send.call(res, body);
    }

    return res;
  } as any;

  next();
};

export default minifyMiddleware;
