import React, { useState, FormEvent, useCallback } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { Heading3, Paragraph } from '@entur/typography'
import { TextField } from '@entur/form'
import type { VariantType } from '@entur/form'
import { SecondarySquareButton } from '@entur/button'
import { CheckIcon } from '@entur/icons'
import classes from './Description.module.scss'

function Description() {
    const [settings, setSettings] = useSettings()

    const [value, setValue] = useState(settings.description)
    const [inputVariant, setInputVariant] = useState<VariantType | undefined>()

    const setDescription = useCallback(() => {
        setInputVariant('success')
        setSettings({
            description: value,
        })
    }, [setSettings, value])

    return (
        <>
            <Heading3 className={classes.Heading}>
                Legg til beskrivelse
            </Heading3>
            <Paragraph className={classes.Paragraph}>
                Her kan du skrive inn en beskrivelse av tavla. Beskrivelsen er
                plassert under logoen oppe i venstre hjørne. Dette feltet kan
                brukes til å beskrive avgangene man ser, hva stoppestedene
                ligger i nærheten av eller henvise til andre kanaler. Maks 80
                tegn.
            </Paragraph>
            <div className={classes.InputGroup}>
                <span className={classes.TextFieldWrapper}>
                    <TextField
                        variant={inputVariant}
                        feedback="Beskrivelse endret"
                        label="Beskrivelse av avgangstavla"
                        value={value}
                        onChange={(
                            event: FormEvent<HTMLInputElement>,
                        ): void => {
                            setInputVariant(undefined)
                            setValue(event.currentTarget.value)
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                setDescription()
                            }
                        }}
                        maxLength={80}
                        disabled={settings.logoSize === '56px'}
                        placeholder="Eks. «Kollektivanganger fra Thon Hotel Oslofjord»."
                    />
                </span>
                <SecondarySquareButton
                    onClick={setDescription}
                    aria-label="Sett beskrivelse av avgangstavla"
                >
                    <CheckIcon />
                </SecondarySquareButton>
            </div>
        </>
    )
}

export { Description }
