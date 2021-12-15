import React, { useState } from 'react'

import { PrimaryButton } from '@entur/button'

import CustomTileModal from '../../../../components/CustomTileModal'
import { useSettingsContext } from '../../../../settings'

import CustomTilePanelRow from './CustomTilePanelRow'

import './styles.scss'

const CustomTilePanel = (): JSX.Element => {
    const [settings] = useSettingsContext()
    const { customQrTiles = [], customImageTiles = [] } = settings || {}
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [selectedTileId, setSelectedTileId] = useState<string | undefined>(
        undefined,
    )

    return (
        <div className="custom-tile-panel">
            <PrimaryButton
                onClick={() => {
                    setSelectedTileId(undefined)
                    setIsOpenModal(true)
                }}
                className="custom-tile-panel__add-button"
            >
                Legg til nytt bilde eller QR-boks
            </PrimaryButton>
            {isOpenModal && (
                <CustomTileModal
                    setIsOpen={setIsOpenModal}
                    selectedTileId={selectedTileId}
                ></CustomTileModal>
            )}
            {[...customQrTiles, ...customImageTiles].map((customTile) => (
                <CustomTilePanelRow
                    key={customTile.id}
                    {...customTile}
                    setIsOpenModal={setIsOpenModal}
                    setSelectedTileId={setSelectedTileId}
                />
            ))}
        </div>
    )
}

export default CustomTilePanel
