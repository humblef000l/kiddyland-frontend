import ClientTranslation from '@/components/client/ClientTranslation'
import ServerTranslation from '@/components/server/ServerTranslation'
import React from 'react'

const Translations = () => {
    return (
        <div>
            <h1>Translations Page</h1>
            <div className='flex flex-row gap-4 justify-center'>
                <ServerTranslation />
                <ClientTranslation />
            </div>
        </div>
    )
}

export default Translations