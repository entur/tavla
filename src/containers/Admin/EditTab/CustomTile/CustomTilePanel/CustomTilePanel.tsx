import React, { useState } from 'react'
import { PrimaryButton } from '@entur/button'
import { CustomTileModal } from '../../../../../components/CustomTileModal/CustomTileModal'
import { useSettings } from '../../../../../settings/SettingsProvider'
import { CustomTilePanelRow } from './CustomTilePanelRow/CustomTilePanelRow'
import classes from './CustomTilePanel.module.scss'

const CustomTilePanel = (): JSX.Element => {
    const [settings] = useSettings()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [selectedTileId, setSelectedTileId] = useState<string | undefined>(
        undefined,
    )

    return (
        <div>
            <PrimaryButton
                className={classes.AddButton}
                onClick={() => {
                    setSelectedTileId(undefined)
                    setIsOpenModal(true)
                }}
            >
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
