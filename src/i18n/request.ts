import { getRequestConfig } from "next-intl/server";
import { routing, TLocale } from "./routing";


export default getRequestConfig(async ({requestLocale})=>{
    // corresponds to `[locale]` segment
    let locale = await requestLocale;

    // ensure that va valid locale is used
    if(!locale || !routing.locales.includes(locale as TLocale)){
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../i18n/translations/${locale}.json`)).default
    }


})