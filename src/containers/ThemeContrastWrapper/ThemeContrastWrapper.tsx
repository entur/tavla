import React from 'react'
import classNames from 'classnames'
import { Contrast } from '@entur/layout'

interface Props {
    children: React.ReactNode
    useContrast?: boolean
    className?: string
}

const ThemeContrastWrapper = ({
    children,
    useContrast = false,
    className,
}: Props): JSX.Element => {
    if (useContrast) {
        return <Contrast className={classNames(className)}>{children}</Contrast>
    } else {
        return <div className={classNames(className)}>{children}</div>
    }
}

export { ThemeContrastWrapper }
