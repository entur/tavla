import React, { useState } from 'react'

import { Modal } from '@entur/modal'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Radio, RadioGroup, TextArea, TextField } from '@entur/form'

import { useSettingsContext } from '../../settings'

import './styles.scss'

type TileType = 'qr' | 'image'

const CustomTileModal = (): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()
    const { customQrTiles = [], customImageTiles = [] } = settings || {}
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [tileType, setTileType] = useState<TileType>('image')
    const [displayName, setDisplayName] = useState('')
    const [linkAddress, setLinkAddress] = useState('')
    const [description, setDescription] = useState('')
    const [displayHeader, setDisplayHeader] = useState('')
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false)

    const handleSubmit = () => {
        setIsSubmitAttempted(true)
        if (!displayName || !linkAddress) return
        if (tileType === 'qr') {
            setSettings({
                customQrTiles: [
                    ...customQrTiles,
                    {
                        id: String(Date.now()),
                        displayName,
                        linkAddress,
                        description,
                    },
                ],
            })
        }
        if (tileType === 'image') {
            setSettings({
                customImageTiles: [
                    ...customImageTiles,
                    {
                        id: String(Date.now()),
                        displayName,
                        linkAddress,
                        description,
                        displayHeader,
                    },
                ],
            })
        }
        setIsOpen(false)
    }

    return (
        <>
            <Modal
                open={isOpen}
                size="medium"
                title="Legg til bilde- eller QR-boks"
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
                ></TextField>
                <RadioGroup
                    name="tile-type"
                    label="Type innhold"
                    onChange={(e) => {
                        setTileType(e.target.value as TileType)
                        setIsSubmitAttempted(false)
                        setLinkAddress('')
                        setDescription('')
                    }}
                    value={tileType}
                >
                    <Radio value="image">Bilde</Radio>
                    <Radio value="qr">QR-kode</Radio>
                </RadioGroup>

                {tileType === 'image' && (
                    <>
                        <TextField
                            label="Lenkeadresse til bildet"
                            value={linkAddress}
                            onChange={(e) => setLinkAddress(e.target.value)}
                            variant={
                                isSubmitAttempted && !linkAddress
                                    ? 'error'
                                    : undefined
                            }
                            feedback="Vennligst fyll ut dette feltet"
                        ></TextField>
                        <TextField
                            label="Overskrift til bildet (valgfri)"
                            value={displayHeader}
                            onChange={(e) => setDisplayHeader(e.target.value)}
                        ></TextField>
                        <TextArea
                            label="Tekst til bildet (valgfri)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></TextArea>
                    </>
                )}
                {tileType === 'qr' && (
                    <>
                        <TextField
                            label="Lenkeadresse QR-koden skal åpne"
                            value={linkAddress}
                            onChange={(e) => setLinkAddress(e.target.value)}
                            variant={
                                isSubmitAttempted && !linkAddress
                                    ? 'error'
                                    : undefined
                            }
                            feedback="Vennligst fyll ut dette feltet"
                        ></TextField>
                        <TextArea
                            label="Beskrivelse til QR-koden (valgfri)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></TextArea>
                    </>
                )}
                <div className="custom-tile-modal__buttons">
                    <SecondaryButton onClick={() => setIsOpen(false)}>
                        Avbryt
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSubmit} type="button">
                        Legg til
                    </PrimaryButton>
                </div>
            </Modal>
            <PrimaryButton onClick={() => setIsOpen(true)} type="button">
                test
            </PrimaryButton>
        </>
    )
}

export default CustomTileModal
