"use client"
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import React from 'react'

const LanguageSwitch = () => {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;;
        router.replace(pathname, { locale: newLocale });
    }
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