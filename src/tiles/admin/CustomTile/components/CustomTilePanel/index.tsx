import React, { useCallback, useState } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { CustomTileModal } from 'tiles/admin/CustomTileModal'
import { PrimaryButton } from '@entur/button'
import { CustomTilePanelRow } from './CustomTilePanelRow/CustomTilePanelRow'
import classes from './CustomTilePanel.module.scss'

function CustomTilePanel() {
    const [settings] = useSettings()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [selectedTileId, setSelectedTileId] = useState<string | undefined>(
        undefined,
    )

    const handleAdd = useCallback(() => {
        setSelectedTileId(undefined)
        setIsOpenModal(true)
    }, [])

    return (
        <div>
            <PrimaryButton className={classes.AddButton} onClick={handleAdd}>
                Legg til nytt bilde eller QR-boks
            </PrimaryButton>
            {isOpenModal && (
                <CustomTileModal
                    setIsOpen={setIsOpenModal}
                    selectedTileId={selectedTileId}
                />
            )}
            {[...settings.customQrTiles, ...settings.customImageTiles].map(
                (customTile) => (
                    <CustomTilePanelRow
                        key={customTile.id}
                        {...customTile}
                        setIsOpenModal={setIsOpenModal}
                        setSelectedTileId={setSelectedTileId}
                    />
                ),
            )}
        </div>
    )
}

export { CustomTilePanel }
