import Image from 'next/image'
import React from 'react'

const AppHeader = () => {
    return (
        <div>
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        </div>
    )
}

export default AppHeader
