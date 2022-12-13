import React, { useState, useEffect, FormEvent } from 'react'
import { Heading3, Paragraph } from '@entur/typography'
import { TextField } from '@entur/form'
import { useSettings } from '../../../../settings/SettingsProvider'
import { useDebounce } from '../../../../hooks/useDebounce'
import classes from './Description.module.scss'

const Description = (): JSX.Element => {
    const [settings, setSettings] = useSettings()

    const [value, setValue] = useState(settings.description)

    const debouncedValue = useDebounce(value, 300)

    useEffect(() => {
        if (debouncedValue && settings.description !== debouncedValue) {
            setSettings({
                description: debouncedValue,
            })
        }
    }, [settings.description, debouncedValue, setSettings])

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
            <TextField
                label="Beskrivelse av avgangstavla"
                value={value}
                onChange={(event: FormEvent<HTMLInputElement>): void =>
                    setValue(event.currentTarget.value)
                }
                maxLength={80}
                disabled={settings.logoSize === '56px'}
                placeholder="Eks. «Kollektivanganger fra Thon Hotel Oslofjord»."
            />
        </>
    )
}

export { Description }
