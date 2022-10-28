import React, { useState, useEffect, FormEvent } from 'react'
import { Heading3, Paragraph } from '@entur/typography'
import { TextField } from '@entur/form'
import { useSettings } from '../../../../settings/SettingsProvider'
import '../LogoTab.scss'
import { useDebounce } from '../../../../hooks/useDebounce'

const Description = (): JSX.Element => {
    const [settings, setSettings] = useSettings()

    const { description, logoSize } = settings || {}

    const [value, setValue] = useState(description)

    const debouncedValue = useDebounce(value, 300)

    useEffect(() => {
        if (debouncedValue && description !== debouncedValue) {
            setSettings({
                description: debouncedValue,
            })
        }
    }, [description, debouncedValue, setSettings])

    return (
        <>
            <Heading3 className="heading">Legg til beskrivelse</Heading3>
            <Paragraph className="logo-page__paragraph">
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
                disabled={logoSize === '56px'}
                placeholder="Eks. «Kollektivanganger fra Thon Hotel Oslofjord»."
            />
        </>
    )
}

export { Description }
