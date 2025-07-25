export type LanguageCode = "KR" | "EN" | "ZH";

export const localeToSelected = (locale: string): LanguageCode => {
   switch (locale) {
      case "ko":
         return "KR";
      case "en":
         return "EN";
      case "zh":
         return "ZH";
      default:
         return "KR";
   }
};

export const selectedToLocale = (selected: LanguageCode): string => {
   switch (selected) {
      case "KR":
         return "ko";
      case "EN":
         return "en";
      case "ZH":
         return "zh";
   }
};

export function getCurrentLocale(pathname: string): string {
   const matched = pathname.match(/^\/(ko|en|zh)(\/|$)/);
   return matched ? matched[1] : "ko";
}

export function getReplacedLocalePath(
   pathname: string,
   newLocale: string,
): string {
   let newPathname = pathname.replace(/^\/(ko|en|zh)/, "");
   if (!newPathname.startsWith("/")) newPathname = "/" + newPathname;
   if (newPathname === "") newPathname = "/";
   return `/${newLocale}${newPathname}`;
}
