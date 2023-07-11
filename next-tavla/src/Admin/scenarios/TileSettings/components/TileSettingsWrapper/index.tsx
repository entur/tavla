import React from 'react'
import classes from './styles.module.css'
import { Loader } from '@entur/loader'
import { DeleteButton } from '../../../TilesOverview/components/DeleteButton'

function TileSettingsWrapper({
    uuid,
    children,
    name,
}: {
    uuid: string
    name: string | undefined
    children: React.ReactNode
}) {
    return (
        <div className={classes.overviewWrapper}>
            <div className={classes.heading}>
                {!name ? <Loader /> : name}
                <DeleteButton uuid={uuid} />
            </div>

            {children}
        </div>
    )
}

export { TileSettingsWrapper }
