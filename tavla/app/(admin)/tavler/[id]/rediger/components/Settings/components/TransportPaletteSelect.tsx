'use client'
import { Radio, RadioGroup } from '@entur/form'
import { Heading4, Paragraph } from '@entur/typography'
import { TravelTag } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/TravelTag'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useEffect, useState } from 'react'
import { BoardTheme, TransportPalette } from 'src/types/db-types/boards'
import { TTransportMode, TTransportSubmode } from 'src/types/graphql-schema'
import { transportModeNames } from '../../TileCard/utils'
import {
    generateTransportPalettes,
    getTransportColorDescription,
} from '../colorPalettes'

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
    allowedPalettes,
    onChange,
}: {
    transportPalette?: TransportPalette
    theme: BoardTheme
    allowedPalettes?: TransportPalette[]
    onChange: () => void
}) {
    const posthog = usePosthogTracking()

    const [selectedValue, setSelectedValue] =
        useState<TransportPalette>(transportPalette)

    useEffect(() => {
        setSelectedValue(transportPalette)
    }, [transportPalette])

    const availablePalettes = generateTransportPalettes(allowedPalettes || [])

    useEffect(() => {
        const availablePaletteValues = availablePalettes.map((p) => p.value)
        if (selectedValue && !availablePaletteValues.includes(selectedValue)) {
            setSelectedValue('default')
            onChange()
        }
    }, [allowedPalettes, selectedValue, availablePalettes, onChange])

    const handleChange = (value: TransportPalette) => {
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
                        const newValue = e.target.value as TransportPalette
                        handleChange(newValue)

                        posthog.capture('board_settings_changed', {
                            setting: 'transport_palette',
                            value: newValue,
                        })
                    }}
                >
                    {availablePalettes.map((palette) => (
                        <div key={palette.value}>
                            <Radio value={palette.value}>{palette.label}</Radio>
                            <div
                                className="flex max-w-max flex-col rounded-sm bg-background px-2 py-3"
                                data-theme={theme}
                                data-transport-palette={palette.value}
                            >
                                <div className="grid grid-cols-2 gap-2">
                                    {busAndTrainModes.map((mode) => {
                                        const colorDescription =
                                            getTransportColorDescription(
                                                palette.value,
                                                mode.mode,
                                            )
                                        return (
                                            <div
                                                className="max-w-min"
                                                key={theme + mode.mode}
                                                aria-label={`${transportModeNames(mode.mode)}${colorDescription ? `, ${colorDescription}` : ''}`}
                                                role="img"
                                            >
                                                {TravelTag({
                                                    transportMode: mode.mode,
                                                    publicCode: '00',
                                                    'aria-hidden': true,
                                                })}
                                            </div>
                                        )
                                    })}
                                    {transportModes.map((mode) => {
                                        const colorDescription =
                                            getTransportColorDescription(
                                                palette.value,
                                                mode.mode,
                                            )
                                        return (
                                            <div
                                                key={
                                                    theme +
                                                    (mode.submode ?? mode.mode)
                                                }
                                                role="img"
                                                aria-label={`${transportModeNames(mode.mode ?? mode.mode)}${colorDescription ? `, ${colorDescription}` : ''}`}
                                            >
                                                {TravelTag({
                                                    transportMode: mode.mode,
                                                    publicCode: '00',
                                                    transportSubmode:
                                                        mode.submode,
                                                    'aria-hidden': true,
                                                })}
                                            </div>
                                        )
                                    })}
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
