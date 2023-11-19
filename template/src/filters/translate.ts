import { languages } from "@/config";
import * as locales from "@/locales";

const parseText = (texts: AlchemiaDictionaryTexts, key: string) => {
  let currentTexts = texts;
  const keys = key.split(".");

  for (const key of keys) {
    if (!currentTexts[key]) break;
    currentTexts = currentTexts[key] as AlchemiaDictionaryTexts;

    if (typeof currentTexts === "string") {
      return currentTexts;
    }
  }

  return null;
};

const findText = (key: string, { texts }: AlchemiaDictionary) => {
  const fallbackDictionary = Object.values(locales).find((locale) => {
    return locale.language === languages.FALLBACK;
  });

  let text = parseText(texts, key);

  if (!text && fallbackDictionary) {
    text = parseText(fallbackDictionary.texts, key);
  }

  return text || `{{ ${key} }}`;
};

const translate = (key: string, lang: string, ...fixedValues: string[]) => {
  let language = lang;
  if (
    !languages.AVAILABLE.find(
      (availableLang) => availableLang.code === language
    )
  ) {
    language = languages.FALLBACK;
  }

  const dictionary = Object.values(locales).find((locale) => {
    return locale.language === language;
  }) as AlchemiaDictionary | undefined;

  if (!dictionary) {
    return "NO DICTIONARY FOUND";
  }

  let text = findText(key, dictionary);

  if (fixedValues.length > 0) {
    text = fixedValues.reduce((acc, value, index) => {
      return acc.replace(`$${index + 1}`, value);
    }, text);
  }

  return text;
};

export default translate;
