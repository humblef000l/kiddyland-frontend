"use client"
import { locales, TLocale } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'

const LanguageSwitch = () => {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;

        // Remove existing locale from the pathname before adding a new one
        const normalizedPath = pathname
            .split("/")
            .filter((segment) => !locales.includes(segment as TLocale)) // Remove old locale
            .join("/");
        
            console.log("normalizedPath", normalizedPath);
        // Navigate to new locale path
        router.replace(`/${newLocale}${normalizedPath ? `/${normalizedPath}` : ""}`);
    };

    return (
        <select onChange={handleChange} defaultValue={currentLocale}>
            {
                locales.map(locale => (
                    <option key={locale} value={locale}>{locale.toUpperCase()}</option>
                ))
            }
        </select>
    )
}

export default LanguageSwitch