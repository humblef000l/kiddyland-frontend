import { defineRouting } from "next-intl/routing";


export const locales = ["cn","cz","en", "es", "de","it","pl","pt","sk"] as const;
export type TLocale = (typeof locales)[number];

export const defaultLocale: TLocale = "en";

export const routing = defineRouting({
    // a list of all locales that are supported
    locales: locales,

    //  used when no locale matches
    defaultLocale: defaultLocale,
    localePrefix:'always'
})