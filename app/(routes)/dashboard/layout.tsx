import React from 'react'
import AppHeader from './_components/AppHeader'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <AppHeader />
            {children}
        </div>
    )
}

export default DashboardLayout