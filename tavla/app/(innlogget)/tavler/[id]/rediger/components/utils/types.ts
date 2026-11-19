import type { TLinesFragment, TQuayFragment } from 'types/operations'

type LineFragment = TLinesFragment['lines'][number]

export type LineWithFrontText = LineFragment & {
    frontTexts: string[]
}

export type QuayWithFrontText = Omit<TQuayFragment, 'lines'> & {
    lines: LineWithFrontText[]
}
