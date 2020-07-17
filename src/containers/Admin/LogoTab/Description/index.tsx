import React, { useState, useEffect, FormEvent } from 'react'

import { Label, Heading3, Paragraph } from '@entur/typography'
import { TextField } from '@entur/form'

import { useDebounce } from '../../../../utils'
import { useSettingsContext } from '../../../../settings'

import '../styles.scss'

const Description = (): JSX.Element => {
    const [{ description, logoSize }, { setDescription }] = useSettingsContext()

    const [value, setValue] = useState(description)

    const debouncedValue = useDebounce(value, 1000)

    useEffect(() => {
        if (description !== debouncedValue) {
            setDescription(debouncedValue)
        }
    }, [description, debouncedValue, setDescription])

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
            <Label>Beskrivelse av avgangstavla</Label>
            <TextField
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

export default Description
