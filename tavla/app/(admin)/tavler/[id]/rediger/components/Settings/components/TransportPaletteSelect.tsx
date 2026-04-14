'use client'
import { Radio, RadioGroup } from '@entur/form'
import { Heading4, Paragraph } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useEffect, useState } from 'react'
import type { BoardTheme, TransportPalette } from 'src/types/db-types/boards'
import type {
    TTransportMode,
    TTransportSubmode,
} from 'src/types/graphql-schema'
import { transportModeNames } from '../../TileCard/utils'
import {
    generateTransportPalettes,
    getTransportColorDescription,
} from '../colorPalettes'
import { TransportIcon } from './TransportIcon'

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
    }, [selectedValue, availablePalettes, onChange])

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
            <div className="flex flex-wrap gap-4">
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
                                className="flex max-w-max flex-col rounded-md bg-secondary px-3 py-3"
                                data-theme={theme}
                                data-transport-palette={palette.value}
                            >
                                <div className="grid grid-cols-4 gap-1.5">
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
                                                <TransportIcon
                                                    key={mode.mode}
                                                    transportMode={mode.mode}
                                                    className={`h-7 w-7 rounded-md bg-${mode.mode} p-1 text-background`}
                                                />
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
                                                <TransportIcon
                                                    key={mode.mode}
                                                    transportMode={mode.mode}
                                                    className={`h-7 w-7 rounded-md bg-${mode.mode} p-1 text-background`}
                                                />
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
