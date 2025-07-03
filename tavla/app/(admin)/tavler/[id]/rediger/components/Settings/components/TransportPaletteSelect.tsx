'use client'
import { RadioPanel } from '@entur/form'
import { RadioGroup } from '@entur/form'
import { TTransportPalette } from 'types/settings'
import { useState } from 'react'
import { HiddenInput } from 'components/Form/HiddenInput'

const transportPalettes = [
    { label: 'Vanlig', value: 'default' },
    { label: 'Buss for tog', value: 'swap-bus' },
]

function TransportPaletteSelect({
    transportPalette = 'default',
}: {
    transportPalette?: TTransportPalette
}) {
    const [selectedValue, setSelectedValue] =
        useState<TTransportPalette>(transportPalette)

    const handleChange = (value: TTransportPalette) => {
        console.log(value)
        setSelectedValue(value)
    }

    return (
        <>
            <RadioGroup
                name="Fargepalett"
                // value={transportPalette!.toString()}
                value={selectedValue}
                // onChange={handleChange()}
                onChange={(e) => {
                    handleChange(e.target.value as TTransportPalette)
                }}
                children={transportPalettes.map((palette) => (
                    <RadioPanel title={palette.label} value={palette.value}>
                        {palette.label}
                    </RadioPanel>
                ))}
            ></RadioGroup>
            <HiddenInput id="transportPalette" value={selectedValue} />
        </>
    )
}

export { TransportPaletteSelect }
