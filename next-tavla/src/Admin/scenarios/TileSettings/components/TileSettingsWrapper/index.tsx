import React from 'react'
import classes from './styles.module.css'
import classNames from 'classnames'
import { Heading3 } from '@entur/typography'
import { DeleteButton } from 'Admin/scenarios/SelectTile/components/DeleteButton'

function TileSettingsWrapper({
    children,
    name,
    className,
    uuid,
}: {
    name?: string | undefined
    children: React.ReactNode
    className?: string
    uuid?: string
}) {
    return (
        <div className={classNames(classes.tileSettingsWrapper, className)}>
            <div className={classes.tileSettingsHeader}>
                {name && (
                    <Heading3 className={classes.heading}>{name}</Heading3>
                )}
                {uuid && <DeleteButton uuid={uuid} />}
            </div>

            <div className={classes.content}>{children}</div>
        </div>
    )
}

export { TileSettingsWrapper }
