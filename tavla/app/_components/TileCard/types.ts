import type { TQuay } from 'src/types/graphql-schema'
import type { TLinesFragment } from 'types/operations'

type LineFragment = TLinesFragment['lines'][number]

export type LineWithFrontText = LineFragment & {
    frontTexts?: string[]
}

export type QuayWithFrontText = Omit<TQuay, 'lines'> & {
    lines: LineWithFrontText[]
}
