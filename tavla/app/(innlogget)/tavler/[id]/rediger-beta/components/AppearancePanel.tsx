'use client'
import { Heading2 } from '@entur/typography'
import { HiddenInput } from 'app/_components/Form/HiddenInput'
import {
    ElementSelect,
    type Elements,
} from 'app/_components/TableSettings/ElementsSelect'
import { FontSelect } from 'app/_components/TableSettings/FontSelect'
import { InfoMessage } from 'app/_components/TableSettings/InfoMessage'
import { ThemeSelect } from 'app/_components/TableSettings/ThemeSelect'
import { TransportPaletteSelect } from 'app/_components/TableSettings/TransportPaletteSelect'
import { ViewType } from 'app/_components/TableSettings/ViewType'
import { useAllowedPalettes } from 'app/_utils/colorPalettes'
import { useCallback, useRef } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { saveAppearance } from '../actions'

const getSelectedElements = (board: BoardDB): Elements[] => {
    const elements: Elements[] = []
    if (!board.hideClock) elements.push('clock')
    if (!board.hideLogo) elements.push('logo')
    return elements
}

/**
 * All display/appearance settings in one form, wired to the partial
 * `saveAppearance` action. Sits directly beside the live preview (problem #1)
 * so every change is reflected immediately.
 */
function AppearancePanel({ board }: { board: BoardDB }) {
    const formRef = useRef<HTMLFormElement>(null)
    const allowedPalettes = useAllowedPalettes(board)

    const handleChange = useCallback(async () => {
        if (!formRef.current) return
        await saveAppearance(new FormData(formRef.current))
    }, [])

    return (
        <section className="flex flex-col gap-4 rounded-md bg-tintLight px-4 py-6">
            <Heading2 margin="none">Visning</Heading2>
            <form ref={formRef} className="flex flex-col gap-4">
                <HiddenInput id="bid" value={board.id} />
                <ViewType
                    hasCombinedTiles={board.isCombinedTiles}
                    onChange={handleChange}
                />
                <ThemeSelect theme={board.theme} onChange={handleChange} />
                <FontSelect
                    font={board.meta.fontSize}
                    onChange={handleChange}
                />
                <TransportPaletteSelect
                    transportPalette={board.transportPalette}
                    theme={board.theme ?? 'dark'}
                    allowedPalettes={allowedPalettes}
                    onChange={handleChange}
                />
                <ElementSelect
                    selectedElements={getSelectedElements(board)}
                    onChange={handleChange}
                />
                <InfoMessage infoMessage={board.footer} onBlur={handleChange} />
            </form>
        </section>
    )
}

export { AppearancePanel }
