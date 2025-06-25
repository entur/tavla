'use client'
import { RadioPanel } from '@entur/form'
import { RadioGroup } from '@entur/form'
import { TTransportPalette } from 'types/settings'
import { useState } from 'react'

const transportPalettes = [
    { label: 'Default', value: '' },
    { label: 'Bus for train', value: 'swap-bus-rail' },
]

function TransportPaletteSelect({
    transportPalette = '',
}: {
    transportPalette?: TTransportPalette
}) {
    const [selectedValue, setSelectedValue] = useState(transportPalette)

    const handleChange = (value: TTransportPalette) => {
        console.log(value)
        setSelectedValue(value)
    }

    // const [palette, setPalette] = useState(transportPalette)

    // useEffect(() => {
    //     document.documentElement.setAttribute('data-transport-palette', palette)
    // }, [palette])

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value
    //     setPalette(value)
    // }

    return (
        <RadioGroup
            name="Velg fargepalett"
            // value={transportPalette!.toString()}
            value="bus"
            // onChange={handleChange()}
            onChange={() => {
                handleChange
            }}
            children={transportPalettes.map((palette) => (
                <RadioPanel title={palette.label} value={palette.value}>
                    {palette.label}
                </RadioPanel>
            ))}
        ></RadioGroup>
    )
}

export { TransportPaletteSelect }
