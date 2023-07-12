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
            <h3 className={classes.heading}>{name}</h3>

            <div className={classes.content}>{children}</div>
        </div>
    )
}

export { TileSettingsWrapper }
