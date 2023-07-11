import React from 'react'
import classes from './styles.module.css'

function TileSettingsWrapper({
    children,
    name,
    className,
}: {
    name?: string | undefined
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={classes.overviewWrapper + ' ' + className}>
            <div className={classes.heading}>{name}</div>

            {children}
        </div>
    )
}

export { TileSettingsWrapper }
