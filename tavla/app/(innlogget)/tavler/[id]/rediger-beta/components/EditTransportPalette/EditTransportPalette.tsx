'use client'
import { FeedbackText, Radio, RadioGroup } from '@entur/form'
import { Paragraph } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import {
    startTransition,
    useActionState,
    useEffect,
    useMemo,
    useState,
} from 'react'
import type { BoardDB } from 'types/db-types/boards'
import {
    generateTransportPalettes,
    useAllowedPalettes,
} from '../utils/colorPalette'
import { saveTransportPalette, type TransportPaletteState } from './actions'
import { TransportPalettePreview } from './TransportPalettePreview'
import type { TransportPaletteValue } from './validation'

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

    useEffect(() => {
        const availableValues = availablePalettes.map((p) => p.value)
        if (!availableValues.includes(selectedValue)) {
            setSelectedValue('default')
            startTransition(() => {
                action('default')
            })
        }
    }, [availablePalettes, selectedValue, action])

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
