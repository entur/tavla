import { TLinesFragment, TQuay } from 'src/types/graphql-schema'

type LineFragment = TLinesFragment['lines'][number]

export type LineWithFrontText = LineFragment & {
    frontTexts?: string[]
}

export type QuayWithFrontText = Omit<TQuay, 'lines'> & {
    lines: LineWithFrontText[]
}
