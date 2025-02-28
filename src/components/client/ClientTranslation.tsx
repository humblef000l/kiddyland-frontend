import { useTranslations } from 'next-intl'
import React from 'react'

const ClientTranslation = () => {
    const t = useTranslations();
  return (
    <div className='flex flex-row m-2 p-4 bg-blue-200 rounded-lg w-fit gap-4'>
        <h1 className='w-64'>ClientTranslation</h1>
        <p className='w-64'>{t("title")}</p>
        <p>{t("about")}</p>
    </div>
  )
}

export default ClientTranslation