import { getTranslations } from 'next-intl/server'
import React from 'react'

const ServerTranslation = async () => {
    const t = await getTranslations();
  return (
    <div className='flex flex-row m-2 p-4 bg-gray-200 rounded-lg gap-16 w-fit justify-center items-center'>
        <h1 className='w-32'>ServerTranslation</h1>
        <p className='w-64 text-center'>{t("title")}</p>
        <p>{t("about")}</p>
    </div>
  )
}

export default ServerTranslation