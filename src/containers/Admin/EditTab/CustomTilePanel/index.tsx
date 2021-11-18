import React, { useState } from 'react'

import { PrimaryButton } from '@entur/button'
import { Checkbox } from '@entur/form'
import { DeleteIcon, EditIcon } from '@entur/icons'

import CustomTileModal from '../../../../components/CustomTileModal'
import { useSettingsContext } from '../../../../settings'

import './styles.scss'

const CustomTilePanel = (): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()
    const { hiddenCustomTileIds = [] } = settings || {}
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
            {[...customQrTiles, ...customImageTiles].map(
                ({ id, displayName }) => (
                    <div key={id} className="custom-tile-panel__row">
                        <Checkbox
                            onChange={() => {
                                hiddenCustomTileIds.find(
                                    (hiddenId) => hiddenId === id,
                                )
                                    ? setSettings({
                                          hiddenCustomTileIds:
                                              hiddenCustomTileIds.filter(
                                                  (hiddenId) => hiddenId !== id,
                                              ),
                                      })
                                    : setSettings({
                                          hiddenCustomTileIds: [
                                              ...hiddenCustomTileIds,
                                              id,
                                          ],
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
                                        customImageTiles:
                                            customImageTiles.filter(
                                                (el) => el.id !== id,
                                            ),
                                        customQrTiles: customQrTiles.filter(
                                            (el) => el.id !== id,
                                        ),
                                        hiddenCustomTileIds:
                                            hiddenCustomTileIds.filter(
                                                (el) => el !== id,
                                            ),
                                    })
                                }
                            />
                        </div>
                    </div>
                ),
            )}
        </div>
    )
}

export default CustomTilePanel
