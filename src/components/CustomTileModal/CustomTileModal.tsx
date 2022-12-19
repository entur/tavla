import React, { useCallback, useMemo, useState } from 'react'
import { Modal } from '@entur/modal'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Radio, RadioGroup, TextArea, TextField } from '@entur/form'
import { useSettings } from '../../settings/SettingsProvider'
import { CustomTileType } from '../../types'
import './CustomTileModel.scss'

interface CustomTileModalProps {
    setIsOpen: (isOpen: boolean) => void
    selectedTileId?: string
}

enum ActionType {
    Update = 'Update',
    AddNew = 'AddNew',
}

const CustomTileModal: React.FC<CustomTileModalProps> = ({
    setIsOpen,
    selectedTileId,
}): JSX.Element => {
    const [settings, setSettings] = useSettings()

    const selectedItem = useMemo(
        () =>
            [...settings.customQrTiles, ...settings.customImageTiles].find(
                (tile) => tile.id === selectedTileId,
            ),
        [settings.customQrTiles, settings.customImageTiles, selectedTileId],
    )

    const [tileType, setTileType] = useState<CustomTileType>(
        selectedItem ? selectedItem.type : CustomTileType.Image,
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false)

    const handleSubmit = (actionType: ActionType) => {
        if (!sourceUrl.endsWith('.no')) {
            setErrorMessage(
                'nå er det feil med urlen husk å skriv på riktig format',
            )
            return
        } else {
            setErrorMessage(null)
            setIsSubmitAttempted(true)
        }

        if (!displayName || !sourceUrl) return
        if (tileType === CustomTileType.QR) {
            setSettings({
                customQrTiles: [
                    ...(actionType === ActionType.Update
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
        if (tileType === CustomTileType.Image) {
            setSettings({
                customImageTiles: [
                    ...(actionType === ActionType.Update
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
                    <Radio value={CustomTileType.Image}>Bilde</Radio>
                    <Radio value={CustomTileType.QR}>QR-kode</Radio>
                </RadioGroup>
            )}
            <TextField
                label={`Lenkeadresse til ${
                    tileType === 'image' ? 'bildet' : 'QR-koden'
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
                        ? 'Lenkeadressen er ugyldig. Skriv inn en nettadresse på formatet nettside.no eller www.nettside.no.'
                        : 'Vennligst fyll ut dette feltet'
                }
            />
            {tileType === CustomTileType.Image && (
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
                        handleSubmit(
                            selectedTileId
                                ? ActionType.Update
                                : ActionType.AddNew,
                        )
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
