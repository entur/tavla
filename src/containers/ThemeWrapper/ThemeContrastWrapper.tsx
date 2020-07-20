import React from 'react'

import { Contrast } from '@entur/layout'

interface Props {
    children: React.ReactNode
    useContrast?: boolean
}

const ThemeContrastWrapper = ({
    children,
    useContrast = false,
}: Props): JSX.Element => {
    if (useContrast) {
        return <Contrast>{children}</Contrast>
    } else {
        return <div>{children}</div>
    }
}

export default ThemeContrastWrapper
