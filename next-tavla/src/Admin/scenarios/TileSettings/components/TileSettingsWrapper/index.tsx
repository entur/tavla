import React from 'react'
import classes from './styles.module.css'
import classNames from 'classnames'
import { Heading3 } from '@entur/typography'
import { DeleteTile } from '../DeleteTile'

function TileSettingsWrapper({
    title,
    className,
    uuid,
    children,
}: {
    title?: string
    className?: string
    children: React.ReactNode
    uuid?: string
}) {
    return (
        <div className={classNames(classes.tileSettingsWrapper, className)}>
            <div className={classes.tileSettingsHeader}>
                <DeleteTile uuid={uuid} />
                {title && (
                    <Heading3 className={classes.heading}>{title}</Heading3>
                )}
            </div>

            <div className={classes.content}>{children}</div>
        </div>
    )
}

export { TileSettingsWrapper }
