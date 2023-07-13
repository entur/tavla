import React from 'react'
import classes from './styles.module.css'
import classNames from 'classnames'

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
        <div className={classNames(classes.overviewWrapper, className)}>
            {name && <h3 className={classes.heading}>{name}</h3>}

            <div className={classes.content}>{children}</div>
        </div>
    )
}

export { TileSettingsWrapper }
