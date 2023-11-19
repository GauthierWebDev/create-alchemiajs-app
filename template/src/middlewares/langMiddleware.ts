import type { Request, Response, NextFunction } from "express";
import { languages } from "@/config";

const langMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const fallbackLang = languages.FALLBACK;
  const availableLangs = languages.AVAILABLE;

  const lang = req.url.split("/")[1];

  if (
    availableLangs.find((availableLang) => availableLang.code === lang) ||
    lang === "api"
  ) {
    res.locals.lang = lang;
    return next();
  }

  const userLang = req.acceptsLanguages(
    availableLangs.map((lang) => lang.code)
  );

  const langToUse = userLang ? userLang : fallbackLang;

  res.redirect(`/${langToUse}${req.url}`);
};

export default langMiddleware;
