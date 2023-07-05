import React from 'react'
import classes from './styles.module.css'
import { Loader } from '@entur/loader'
import { Tile } from 'components/Tile'
import { DeleteButton } from '../DeleteButton'

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
        <Tile>
            <div className={classes.heading}>
                {!name ? <Loader /> : name}

                <DeleteButton uuid={uuid} />
            </div>

            {children}
        </Tile>
    )
}

export { TileSettingsWrapper }
