import type {
    LineWithFrontText,
    QuayWithFrontText,
} from 'app/_components/TileCard/types'
import {
    buildTilePersistence,
    countSelectableQuayLineKeys,
    generateQuayLineFrontTextKey,
    getInitialCheckedLineIds,
} from 'app/_components/TileCard/utils'
import { useMemo, useState } from 'react'
import type {
    BoardTileDB,
    LineWithDirectionDB,
} from 'src/types/db-types/boards'
import type { TTransportMode } from 'src/types/graphql-schema'

/**
 * De valgbare nøklene for én linje på én quay: én per frontText (retning), eller
 * en enkelt nøkkel uten frontText når linja mangler retningsdata.
 */
function lineKeys(quayId: string, line: LineWithFrontText): string[] {
    if (line.frontTexts.length === 0) {
        return [generateQuayLineFrontTextKey(quayId, line.id)]
    }
    return line.frontTexts.map((frontText) =>
        generateQuayLineFrontTextKey(quayId, line.id, frontText),
    )
}

function quayKeys(quay: QuayWithFrontText): string[] {
    return quay.lines.flatMap((line) => lineKeys(quay.id, line))
}

export type TriState = 'all' | 'some' | 'none'

/**
 * Én kanonisk valg-state (et sett med `quayId||lineId||frontText`-nøkler) som
 * begge linsene (plattform/linje) er projeksjoner av. Seedes fra den lagrede
 * tilen og utleder til slutt det som skal persisteres — uten å endre
 * lagringsformatet.
 */
export function useStopPlaceSelection(
    tile: BoardTileDB,
    quays: QuayWithFrontText[],
) {
    const [selected, setSelected] = useState<Set<string>>(() =>
        getInitialCheckedLineIds(tile, quays),
    )

    const totalSelectableKeys = useMemo(
        () => countSelectableQuayLineKeys(quays),
        [quays],
    )

    function quayState(quay: QuayWithFrontText): TriState {
        const keys = quayKeys(quay)
        if (keys.length === 0) return 'none'
        const selectedCount = keys.filter((key) => selected.has(key)).length
        if (selectedCount === 0) return 'none'
        if (selectedCount === keys.length) return 'all'
        return 'some'
    }

    function lineState(
        quay: QuayWithFrontText,
        line: LineWithFrontText,
    ): TriState {
        const keys = lineKeys(quay.id, line)
        const selectedCount = keys.filter((key) => selected.has(key)).length
        if (selectedCount === 0) return 'none'
        if (selectedCount === keys.length) return 'all'
        return 'some'
    }

    function setKeys(keys: string[], checked: boolean) {
        setSelected((prev) => {
            const next = new Set(prev)
            for (const key of keys) {
                if (checked) next.add(key)
                else next.delete(key)
            }
            return next
        })
    }

    function toggleQuayAll(quay: QuayWithFrontText, checked: boolean) {
        setKeys(quayKeys(quay), checked)
    }

    function toggleLine(quay: QuayWithFrontText, line: LineWithFrontText) {
        const keys = lineKeys(quay.id, line)
        const allSelected = keys.every((key) => selected.has(key))
        setKeys(keys, !allSelected)
    }

    /** Generiske nøkkel-primitiver — brukes av linje-linsen, som grupperer på
     * tvers av quays og derfor jobber direkte med nøkler. */
    function isSelected(key: string): boolean {
        return selected.has(key)
    }

    function toggleKey(key: string) {
        setKeys([key], !selected.has(key))
    }

    function keysTriState(keys: string[]): TriState {
        if (keys.length === 0) return 'none'
        const selectedCount = keys.filter((key) => selected.has(key)).length
        if (selectedCount === 0) return 'none'
        if (selectedCount === keys.length) return 'all'
        return 'some'
    }

    function toggleKeys(keys: string[]) {
        const allSelected = keys.every((key) => selected.has(key))
        setKeys(keys, !allSelected)
    }

    /** Alle valgbare nøkler for linjer med et gitt transportmiddel, på tvers av quays. */
    function modeKeys(mode: TTransportMode): string[] {
        return quays.flatMap((quay) =>
            quay.lines
                .filter((line) => line.transportMode === mode)
                .flatMap((line) => lineKeys(quay.id, line)),
        )
    }

    function isModeSelected(mode: TTransportMode): boolean {
        return modeKeys(mode).some((key) => selected.has(key))
    }

    /** Velger eller avvelger alle linjer for et transportmiddel eksplisitt. */
    function setModeSelected(mode: TTransportMode, checked: boolean) {
        setKeys(modeKeys(mode), checked)
    }

    function getPersistence(): {
        quays: BoardTileDB['quays']
        linesWithDirection: LineWithDirectionDB[]
    } {
        return buildTilePersistence(quays, Array.from(selected))
    }

    const hasAnySelected = selected.size > 0

    return {
        totalSelectableKeys,
        hasAnySelected,
        quayState,
        lineState,
        toggleQuayAll,
        toggleLine,
        isSelected,
        toggleKey,
        keysTriState,
        toggleKeys,
        isModeSelected,
        setModeSelected,
        getPersistence,
    }
}

export { lineKeys }
