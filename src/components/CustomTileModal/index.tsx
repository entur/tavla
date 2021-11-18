import React, { useState } from 'react'

import { Modal } from '@entur/modal'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Radio, RadioGroup, TextArea, TextField } from '@entur/form'

import './styles.scss'

type TileType = 'qr' | 'image'

const CustomTileModal = (): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [tileType, setTileType] = useState<TileType>('image')
    const [name, setName] = useState('')
    const [link, setLink] = useState('')
    const [description, setDescription] = useState('')
    const [imageHeader, setImageHeader] = useState('')
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false)

    const handleSubmit = () => {
        setIsSubmitAttempted(true)
        if (!name || !link) return
        //TODO
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
                    onChange={(e) => setName(e.target.value)}
                    variant={isSubmitAttempted && !name ? 'error' : undefined}
                    feedback="Vennligst fyll ut dette feltet"
                ></TextField>
                <RadioGroup
                    name="tile-type"
                    label="Type innhold"
                    onChange={(e) => {
                        setTileType(e.target.value as TileType)
                        setIsSubmitAttempted(false)
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
                            onChange={(e) => setLink(e.target.value)}
                            variant={
                                isSubmitAttempted && !link ? 'error' : undefined
                            }
                            feedback="Vennligst fyll ut dette feltet"
                        ></TextField>
                        <TextField
                            label="Overskrift til bildet (valgfri)"
                            onChange={(e) => setImageHeader(e.target.value)}
                        ></TextField>
                        <TextArea
                            label="Tekst til bildet (valgfri)"
                            onChange={(e) => setDescription(e.target.value)}
                        ></TextArea>
                    </>
                )}
                {tileType === 'qr' && (
                    <>
                        <TextField
                            label="Lenkeadresse QR-koden skal åpne"
                            onChange={(e) => setLink(e.target.value)}
                            variant={
                                isSubmitAttempted && !link ? 'error' : undefined
                            }
                            feedback="Vennligst fyll ut dette feltet"
                        ></TextField>
                        <TextArea
                            label="Beskrivelse til QR-koden (valgfri)"
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
