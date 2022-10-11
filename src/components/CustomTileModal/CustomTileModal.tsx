import React, { useState } from 'react'

import { Modal } from '@entur/modal'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Radio, RadioGroup, TextArea, TextField } from '@entur/form'

import { useSettingsContext } from '../../settings'

import type { CustomTileType } from '../../types'

import './CustomTileModel.scss'

interface Props {
    setIsOpen: (isOpen: boolean) => void
    selectedTileId?: string
}

type ActionType = 'update' | 'addNew'

const CustomTileModal = ({ setIsOpen, selectedTileId }: Props): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()
    const { customQrTiles = [], customImageTiles = [] } = settings || {}
    const selectedItem = [...customQrTiles, ...customImageTiles].find(
        (tile) => tile.id === selectedTileId,
    )
    const [tileType, setTileType] = useState<CustomTileType>(
        selectedItem ? selectedItem.type : 'image',
    )
    const [displayName, setDisplayName] = useState(
        selectedItem ? selectedItem.displayName : '',
    )
    const [sourceUrl, setSourceUrl] = useState(
        selectedItem ? selectedItem.sourceUrl : '',
    )
    const [description, setDescription] = useState(
        selectedItem?.description ?? '',
    )
    const [displayHeader, setDisplayHeader] = useState(
        selectedItem?.displayHeader ?? '',
    )

    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false)

    const handleSubmit = (actionType: ActionType) => {
        setIsSubmitAttempted(true)
        if (!displayName || !sourceUrl) return
        if (tileType === 'qr') {
            setSettings({
                customQrTiles: [
                    ...(actionType === 'update'
                        ? customQrTiles.filter(
                              ({ id }) => id !== selectedTileId,
                          )
                        : customQrTiles),
                    {
                        id: String(Date.now()),
                        displayName,
                        sourceUrl,
                        description,
                        type: tileType,
                    },
                ],
            })
        }
        if (tileType === 'image') {
            setSettings({
                customImageTiles: [
                    ...(actionType === 'update'
                        ? customImageTiles.filter(
                              ({ id }) => id !== selectedTileId,
                          )
                        : customImageTiles),
                    {
                        id: String(Date.now()),
                        displayName,
                        sourceUrl,
                        description,
                        displayHeader,
                        type: tileType,
                    },
                ],
            })
        }
        setIsOpen(false)
    }

    return (
        <>
            <Modal
                size="medium"
                title={`${
                    selectedItem
                        ? `Endre ${
                              tileType === 'image' ? 'bildeboks' : 'QR-boks'
                          }`
                        : 'Legg til bilde- eller QR-boks'
                } `}
                onDismiss={() => setIsOpen(false)}
                className="custom-tile-modal"
            >
                <TextField
                    label="Navn på boks"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    variant={
                        isSubmitAttempted && !displayName ? 'error' : undefined
                    }
                    feedback="Vennligst fyll ut dette feltet"
                />
                {!selectedTileId && (
                    <RadioGroup
                        name="tile-type"
                        label="Type innhold"
                        onChange={(e) => {
                            setTileType(e.target.value as CustomTileType)
                            setIsSubmitAttempted(false)
                            setSourceUrl('')
                            setDescription('')
                        }}
                        value={tileType}
                    >
                        <Radio value="image">Bilde</Radio>
                        <Radio value="qr">QR-kode</Radio>
                    </RadioGroup>
                )}
                <TextField
                    label={`Lenkeadresse til ${
                        tileType === 'image' ? 'bildet' : 'QR-koden'
                    }`}
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    variant={
                        isSubmitAttempted && !sourceUrl ? 'error' : undefined
                    }
                    placeholder="F.eks. tavla.entur.no"
                    feedback="Vennligst fyll ut dette feltet"
                />
                {tileType === 'image' && (
                    <TextField
                        label="Overskrift til bildet (valgfri)"
                        value={displayHeader}
                        onChange={(e) => setDisplayHeader(e.target.value)}
                    />
                )}
                <TextArea
                    label={`${
                        tileType === 'image'
                            ? 'Tekst til bildet'
                            : 'Beskrivelse til QR-koden'
                    } (valgfri)`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="custom-tile-modal__buttons">
                    <SecondaryButton onClick={() => setIsOpen(false)}>
                        Avbryt
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={() =>
                            handleSubmit(selectedTileId ? 'update' : 'addNew')
                        }
                        type="button"
                    >
                        {selectedTileId ? 'Oppdater' : 'Legg til'}
                    </PrimaryButton>
                </div>
            </Modal>
        </>
    )
}

export { CustomTileModal }
