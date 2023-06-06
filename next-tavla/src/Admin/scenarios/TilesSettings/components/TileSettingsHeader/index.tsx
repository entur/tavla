import React from 'react'
import classes from './styles.module.css'
import { useSettingsDispatch } from 'Admin/reducer'
import { DeleteIcon } from '@entur/icons'
import { SortableHandle } from 'Admin/components/SortableHandle'
import { Loader } from '@entur/loader'

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
        <div className="tile">
            <div className={classes.heading}>
                {!name ? <Loader /> : name}
                <div className={classes.buttons}>
                    <button
                        className="button"
                        onClick={() =>
                            dispatch({
                                type: 'removeTile',
                                tileId: uuid,
                            })
                        }
                    >
                        <DeleteIcon size={16} />
                    </button>
                    <SortableHandle id={uuid} />
                </div>
            </div>
            {children}
        </div>
    )
}

export { TileSettingsWrapper }
