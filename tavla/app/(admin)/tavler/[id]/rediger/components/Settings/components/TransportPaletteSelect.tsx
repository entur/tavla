'use client'
import { Radio, RadioGroup } from '@entur/form'
import { Heading4, Paragraph } from '@entur/typography'
import { TravelTag } from 'components/TravelTag'
import { useState } from 'react'
import { BoardThemeDB, TransportPaletteDB } from 'types/db-types/boards'
import { TTransportMode, TTransportSubmode } from 'types/graphql-schema'

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
    transportPalette?: TransportPaletteDB
    theme: BoardThemeDB
    onChange: () => void
}) {
    const [selectedValue, setSelectedValue] =
        useState<TransportPaletteDB>(transportPalette)

    const handleChange = (value: TransportPaletteDB) => {
        setSelectedValue(value)
        onChange()
    }

    return (
        <div>
            <Heading4 margin="bottom" id="transport-palette-heading">
                Farger på transportmidler
            </Heading4>
            <Paragraph className="mb-3">
                Velg hvilke farger transportmidlene i tavlevisningen skal ha.
            </Paragraph>
            <div className="flex flex-col gap-4 md:flex-row">
                <RadioGroup
                    name="transportPalette"
                    value={selectedValue}
                    aria-labelledby="transport-palette-heading"
                    onChange={(e) => {
                        handleChange(e.target.value as TransportPaletteDB)
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
                                <div className="grid grid-cols-2 gap-2">
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
                                    {transportModes.map((mode) => (
                                        <div
                                            key={
                                                theme +
                                                (mode.submode ?? mode.mode)
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
            </div>
        </div>
    )
}

export { TransportPaletteSelect }
