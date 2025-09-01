'use client'
import { Radio, RadioGroup } from '@entur/form'
import { Heading4, Paragraph } from '@entur/typography'
import { TravelTag } from 'components/TravelTag'
import { useState } from 'react'
import { TTransportMode, TTransportSubmode } from 'types/graphql-schema'
import { TTheme, TTransportPalette } from 'types/settings'

const transportPalettes = [
    { label: 'Standard', value: 'default' },
    { label: 'Blå buss', value: 'blue-bus' },
    { label: 'Grønn buss', value: 'green-bus' },
]

const busAndTrainModes: { mode: TTransportMode }[] = [
    {
        mode: 'bus',
    },
    {
        mode: 'rail',
    },
]

const transportModes: { mode: TTransportMode; submode?: TTransportSubmode }[] =
    [
        {
            mode: 'water',
            submode: 'internationalCarFerry',
        },
        {
            mode: 'air',
        },
        {
            mode: 'water',
        },
        {
            mode: 'metro',
        },
        {
            mode: 'taxi',
        },
        {
            mode: 'tram',
        },
    ]

function TransportPaletteSelect({
    transportPalette = 'default',
    theme,
    onChange,
}: {
    transportPalette?: TTransportPalette
    theme: TTheme
    onChange: () => void
}) {
    const [selectedValue, setSelectedValue] =
        useState<TTransportPalette>(transportPalette)

    const handleChange = (value: TTransportPalette) => {
        setSelectedValue(value)
        onChange()
    }

    return (
        <>
            <Heading4 margin="bottom" id="transport-palette-heading">
                Farger på transportmidler
            </Heading4>
            <Paragraph className="!mb-0">
                Velg hvilke farger transportmidlene i tavlevisningen skal ha.
            </Paragraph>
            <RadioGroup
                name="transportPalette"
                value={selectedValue}
                aria-labelledby="transport-palette-heading"
                onChange={(e) => {
                    handleChange(e.target.value as TTransportPalette)
                }}
            >
                {transportPalettes.map((palette) => (
                    <div key={palette.value}>
                        <Radio value={palette.value}>{palette.label}</Radio>
                        <div
                            className="flex max-w-max flex-col rounded-sm bg-background px-2 py-3"
                            data-theme={theme}
                            data-transport-palette={palette.value}
                        >
                            <div className="mb-4 flex flex-row gap-2">
                                {busAndTrainModes.map((mode) => (
                                    <div
                                        className="max-w-min"
                                        key={theme + mode.mode}
                                    >
                                        {TravelTag({
                                            transportMode: mode.mode,
                                            publicCode: '00',
                                        })}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-row flex-wrap gap-2">
                                {transportModes.map((mode) => (
                                    <div
                                        className="max-w-min"
                                        key={
                                            theme + (mode.submode ?? mode.mode)
                                        }
                                    >
                                        {TravelTag({
                                            transportMode: mode.mode,
                                            publicCode: '00',
                                            transportSubmode: mode.submode,
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </RadioGroup>
        </>
    )
}

export { TransportPaletteSelect }
