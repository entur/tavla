import type { LineFragment } from 'app/_components/TileCard/types'
import type { TQuayFragment } from 'types/operations'

export type LineWithFrontText = LineFragment & {
    frontTexts: string[]
}

export type QuayWithFrontText = Omit<TQuayFragment, 'lines'> & {
    lines: LineWithFrontText[]
}
