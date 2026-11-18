import type { TLinesFragment } from 'types/operations'
import type { TQuay } from './useStopPlaceLines'

type LineFragment = TLinesFragment['lines'][number]

export type LineWithFrontText = LineFragment & {
    frontTexts: string[]
}

export type QuayWithFrontText = Omit<TQuay, 'lines'> & {
    lines: LineWithFrontText[]
}
