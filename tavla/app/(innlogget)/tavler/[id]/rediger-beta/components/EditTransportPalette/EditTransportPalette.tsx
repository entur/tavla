'use client'
import { FeedbackText, Radio, RadioGroup } from '@entur/form'
import { Paragraph } from '@entur/typography'
import { transportModeNames } from 'app/_components/TileCard/utils'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import {
    generateTransportPalettes,
    getTransportColorDescription,
    useAllowedPalettes,
} from 'app/_utils/colorPalettes'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import {
    startTransition,
    useActionState,
    useEffect,
    useMemo,
    useState,
} from 'react'
import type { BoardDB } from 'types/db-types/boards'
import type { TTransportMode, TTransportSubmode } from 'types/graphql-schema'
import { saveTransportPalette, type TransportPaletteState } from './actions'
import type { TransportPaletteValue } from './validation'

const busAndTrainModes: TTransportMode[] = ['bus', 'coach', 'rail']

const transportModes: { mode: TTransportMode; submode?: TTransportSubmode }[] =
    [
        { mode: 'air' },
        { mode: 'metro' },
        { mode: 'tram' },
        { mode: 'water', submode: 'internationalCarFerry' },
        { mode: 'water' },
    ]

//trakk ut funksjon for å vise preview av fargene og ikonene
function TransportPalettePreview({
    palette,
    theme,
    iconClassName,
}: {
    palette: { value: TransportPaletteValue; label: string }
    theme: BoardDB['theme']
    iconClassName: string
}) {
    return (
        <div
            className="flex max-w-max flex-col rounded-md bg-secondary px-3 py-3"
            data-theme={theme ?? 'dark'}
            data-transport-palette={palette.value}
        >
            <div className="grid grid-cols-8 gap-1.5">
                {busAndTrainModes.map((mode) => {
                    const colorDescription = getTransportColorDescription(
                        palette.value,
                        mode,
                    )
                    return (
                        <div
                            className="max-w-min"
                            key={mode}
                            aria-label={`${transportModeNames(mode)}${colorDescription ? `, ${colorDescription}` : ''}`}
                            role="img"
                        >
                            <TransportIcon
                                transportMode={mode}
                                background
                                className={iconClassName}
                            />
                        </div>
                    )
                })}
                {transportModes.map((mode) => {
                    const colorDescription = getTransportColorDescription(
                        palette.value,
                        mode.mode,
                    )
                    return (
                        <div
                            key={mode.submode ?? mode.mode}
                            role="img"
                            aria-label={`${transportModeNames(mode.mode)}${colorDescription ? `, ${colorDescription}` : ''}`}
                        >
                            <TransportIcon
                                transportMode={mode.mode}
                                transportSubmode={mode.submode}
                                background
                                className={iconClassName}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

//Dette følger samme designpattern som de andre nye komponentene, men må legge på litt ekstra

function EditTransportPalette({ board }: { board: BoardDB }) {
    const { capture } = usePosthogTracking()

    const allowedPalettes = useAllowedPalettes(board)
    const availablePalettes = useMemo(
        () => generateTransportPalettes(allowedPalettes),
        [allowedPalettes],
    )

    const [selectedValue, setSelectedValue] = useState<TransportPaletteValue>(
        board.transportPalette ?? 'default',
    )

    useEffect(() => {
        const availableValues = availablePalettes.map((p) => p.value)
        if (!availableValues.includes(selectedValue)) {
            setSelectedValue('default')
        }
    }, [availablePalettes, selectedValue])

    async function handleSave(
        _prevState: TransportPaletteState,
        value: TransportPaletteValue,
    ) {
        const result = await saveTransportPalette(board.id, value)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                location: 'edit_board_page',
                setting: 'transport_palette',
                value: value,
            })
        }

        return result
    }

    const [state, action] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    function handleChange(value: TransportPaletteValue) {
        setSelectedValue(value)
        startTransition(() => {
            action(value)
        })
    }

    const theme = board.theme ?? 'dark'
    const iconClassName = theme === 'dark' ? 'text-black' : 'text-white'

    return (
        <div>
            <Paragraph className="mb-2" id="transport-palette-heading">
                Farger på transportmidler
            </Paragraph>
            <div className="flex flex-col gap-4">
                <RadioGroup
                    name="transportPalette"
                    value={selectedValue}
                    aria-labelledby="transport-palette-heading"
                    onChange={(e) =>
                        handleChange(e.target.value as TransportPaletteValue)
                    }
                >
                    {availablePalettes.map((palette) => (
                        <div
                            key={palette.value}
                            className="flex items-center justify-between"
                        >
                            <Radio value={palette.value}>{palette.label}</Radio>
                            <TransportPalettePreview
                                palette={palette}
                                theme={theme}
                                iconClassName={iconClassName}
                            />
                        </div>
                    ))}
                </RadioGroup>
            </div>
            {error && <FeedbackText variant="negative">{error}</FeedbackText>}
        </div>
    )
}

export { EditTransportPalette }

//4. Lav prioritet / valgfritt: availablePalettes (linje 97) regnes ut på nytt ved hver rendering (ikke useMemo-et),
// som gjør at useEffect-en på linje 103 kjører oftere enn strengt tatt nødvendig. Dette er arvet fra gamle TransportPaletteSelect.tsx
// og ikke noe du har innført — grei å la stå, men nevner den i tilfelle du vil stramme den til.
