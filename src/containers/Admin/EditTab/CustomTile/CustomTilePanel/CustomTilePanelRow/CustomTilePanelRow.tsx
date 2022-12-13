import React from 'react'
import { Checkbox } from '@entur/form'
import { DeleteIcon, EditIcon } from '@entur/icons'
import { useSettings } from '../../../../../../settings/SettingsProvider'
import { CustomTile } from '../../../../../../types'
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
    const [settings, setSettings] = useSettings()

    return (
        <div className="custom-tile-panel__row">
            <Checkbox
                onChange={() => {
                    settings.hiddenCustomTileIds.find(
                        (hiddenId) => hiddenId === id,
                    )
                        ? setSettings({
                              hiddenCustomTileIds:
                                  settings.hiddenCustomTileIds.filter(
                                      (hiddenId) => hiddenId !== id,
                                  ),
                          })
                        : setSettings({
                              hiddenCustomTileIds: [
                                  ...settings.hiddenCustomTileIds,
                                  id,
                              ],
                          })
                }}
                checked={!settings.hiddenCustomTileIds.includes(id)}
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
                            customImageTiles: settings.customImageTiles.filter(
                                (el) => el.id !== id,
                            ),
                            customQrTiles: settings.customQrTiles.filter(
                                (el) => el.id !== id,
                            ),
                            hiddenCustomTileIds:
                                settings.hiddenCustomTileIds.filter(
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
