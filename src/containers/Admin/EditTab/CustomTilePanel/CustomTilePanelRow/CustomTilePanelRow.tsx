import React from 'react'

import { Checkbox } from '@entur/form'
import { DeleteIcon, EditIcon } from '@entur/icons'

import { useSettingsContext } from '../../../../../settings'
import { CustomTile } from '../../../../../types'

import '../CustomTilePanel.scss'

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
    const [settings, setSettings] = useSettingsContext()
    const {
        hiddenCustomTileIds = [],
        customImageTiles = [],
        customQrTiles = [],
    } = settings || {}

    return (
        <div className="custom-tile-panel__row">
            <Checkbox
                onChange={() => {
                    hiddenCustomTileIds.find((hiddenId) => hiddenId === id)
                        ? setSettings({
                              hiddenCustomTileIds: hiddenCustomTileIds.filter(
                                  (hiddenId) => hiddenId !== id,
                              ),
                          })
                        : setSettings({
                              hiddenCustomTileIds: [...hiddenCustomTileIds, id],
                          })
                }}
                checked={!hiddenCustomTileIds.includes(id)}
            ></Checkbox>
            <span>{displayName}</span>
            <div className="custom-tile-panel__icons">
                <EditIcon
                    onClick={() => {
                        setSelectedTileId(id)
                        setIsOpenModal(true)
                    }}
                />
                <DeleteIcon
                    onClick={() =>
                        setSettings({
                            customImageTiles: customImageTiles.filter(
                                (el) => el.id !== id,
                            ),
                            customQrTiles: customQrTiles.filter(
                                (el) => el.id !== id,
                            ),
                            hiddenCustomTileIds: hiddenCustomTileIds.filter(
                                (el) => el !== id,
                            ),
                        })
                    }
                />
            </div>
        </div>
    )
}

export { CustomTilePanelRow }
