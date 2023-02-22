import React from 'react'
import { Contrast } from '@entur/layout'

function ThemeContrastWrapper({
    children,
    useContrast = false,
    className,
}: {
    children: React.ReactNode
    useContrast?: boolean
    className?: string
}) {
    if (useContrast) {
        return <Contrast className={className}>{children}</Contrast>
    } else {
        return <div className={className}>{children}</div>
    }
}

export { ThemeContrastWrapper }
