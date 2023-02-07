import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { CustomTile } from 'src/types'
import { Checkbox } from '@entur/form'
import { DeleteIcon, EditIcon } from '@entur/icons'
import classes from './CustomTilePanelRow.module.scss'

interface Props extends CustomTile {
    setSelectedTileId: (id: string) => void
    setIsOpenModal: (isOpen: boolean) => void
}

const CustomTilePanelRow = ({
    id,
    displayName,
    setSelectedTileId,
    setIsOpenModal,
}: Props): JSX.Element => {
    const [settings, setSettings] = useSettings()

    const handleToggle = useCallback(() => {
        setSettings({
            hiddenCustomTileIds: xor(settings.hiddenCustomTileIds, [id]),
        })
    }, [settings, setSettings, id])

    const handleEdit = useCallback(() => {
        setSelectedTileId(id)
        setIsOpenModal(true)
    }, [id, setSelectedTileId, setIsOpenModal])

    const handleDelete = useCallback(() => {
        setSettings({
            customImageTiles: settings.customImageTiles.filter(
                (el) => el.id !== id,
            ),
            customQrTiles: settings.customQrTiles.filter((el) => el.id !== id),
            hiddenCustomTileIds: settings.hiddenCustomTileIds.filter(
                (el) => el !== id,
            ),
        })
    }, [settings, setSettings, id])

    return (
        <div className={classes.Row}>
            <Checkbox
                onChange={handleToggle}
                checked={!settings.hiddenCustomTileIds.includes(id)}
            />
            <span>{displayName}</span>
            <div className={classes.Icons}>
                <EditIcon className={classes.Icon} onClick={handleEdit} />
                <DeleteIcon className={classes.Icon} onClick={handleDelete} />
            </div>
        </div>
    )
}

export { CustomTilePanelRow }
