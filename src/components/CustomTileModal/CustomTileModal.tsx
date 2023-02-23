import React, { useMemo, useState } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { CustomTileType } from 'src/types'
import { Modal } from '@entur/modal'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Radio, RadioGroup, TextArea, TextField } from '@entur/form'
import classes from './CustomTileModal.module.scss'

type ActionType = 'Update' | 'AddNew'

function CustomTileModal({
    setIsOpen,
    selectedTileId,
}: {
    setIsOpen: (isOpen: boolean) => void
    selectedTileId?: string
}) {
    const [settings, setSettings] = useSettings()

    const selectedItem = useMemo(
        () =>
            [...settings.customQrTiles, ...settings.customImageTiles].find(
                (tile) => tile.id === selectedTileId,
            ),
        [settings.customQrTiles, settings.customImageTiles, selectedTileId],
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
    const [errorMessage, setErrorMessage] = useState<boolean>(false)

    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false)

    const urlPattern = /^(https?:\/\/)?www\.([A-z0-9]+)\.([A-z]{2,})/

    const handleSubmit = (actionType: ActionType) => {
        if (!urlPattern.test(sourceUrl)) {
            setErrorMessage(true)
            return
        } else {
            setErrorMessage(false)
            setIsSubmitAttempted(true)
        }

        if (!displayName || !sourceUrl) return
        if (tileType === 'qr') {
            setSettings({
                customQrTiles: [
                    ...(actionType === 'Update'
                        ? settings.customQrTiles.filter(
                              ({ id }) => id !== selectedTileId,
                          )
                        : settings.customQrTiles),
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
                    ...(actionType === 'Update'
                        ? settings.customImageTiles.filter(
                              ({ id }) => id !== selectedTileId,
                          )
                        : settings.customImageTiles),
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
        <Modal
            size="medium"
            title={`${
                selectedItem
                    ? `Endre ${tileType === 'image' ? 'bildeboks' : 'QR-boks'}`
                    : 'Legg til bilde- eller QR-boks'
            } `}
            onDismiss={() => setIsOpen(false)}
            className={classes.CustomTileModal}
        >
            <TextField
                label="Navn på boks (obligatorisk)"
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
                    tileType === 'image'
                        ? 'bildet (obligatorisk)'
                        : 'QR-koden (obligatorisk)'
                }`}
                value={sourceUrl}
                onChange={(e) => {
                    setSourceUrl(e.target.value)
                }}
                variant={
                    (isSubmitAttempted && !sourceUrl) || errorMessage
                        ? 'error'
                        : undefined
                }
                placeholder="F.eks. tavla.entur.no"
                feedback={
                    errorMessage
                        ? 'Lenkeadressen er ugyldig. Skriv inn en nettadresse på formatet www.nettside.no. eller http(s)://www.nettside.no'
                        : 'Vennligst fyll ut dette feltet'
                }
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
                className={classes.ImageText}
                onChange={(e) => setDescription(e.target.value)}
            />

            <div className={classes.ButtonsContainer}>
                <SecondaryButton onClick={() => setIsOpen(false)}>
                    Avbryt
                </SecondaryButton>
                <PrimaryButton
                    onClick={() =>
                        handleSubmit(selectedTileId ? 'Update' : 'AddNew')
                    }
                    type="button"
                >
                    {selectedTileId ? 'Oppdater' : 'Legg til'}
                </PrimaryButton>
            </div>
        </Modal>
    )
}

export { CustomTileModal }
