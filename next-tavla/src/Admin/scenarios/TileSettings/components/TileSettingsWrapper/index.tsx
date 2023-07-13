import React from 'react'
import classes from './styles.module.css'
import classNames from 'classnames'
import { Heading3 } from '@entur/typography'

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
        <div className={classNames(classes.tilesettingsWrapper, className)}>
            {name && <Heading3 className={classes.heading}>{name}</Heading3>}

            <div className={classes.content}>{children}</div>
        </div>
    )
}

export { TileSettingsWrapper }
