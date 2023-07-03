import React from 'react'
import classes from './styles.module.css'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { DeleteIcon } from '@entur/icons'
import { Loader } from '@entur/loader'
import { Tile } from 'components/Tile'
import { TavlaButton } from 'Admin/components/Button'

function TileSettingsWrapper({
    uuid,
    children,
    name,
}: {
    uuid: string
    name: string | undefined
    children: React.ReactNode
}) {
    const dispatch = useSettingsDispatch()

    return (
        <Tile>
            <div className={classes.heading}>
                {!name ? <Loader /> : name}
                <div className={classes.buttons}>
                    <TavlaButton
                        onClick={() =>
                            dispatch({
                                type: 'removeTile',
                                tileId: uuid,
                            })
                        }
                    >
                        <DeleteIcon size={16} />
                    </TavlaButton>
                </div>
            </div>
            {children}
        </Tile>
    )
}

export { TileSettingsWrapper }
