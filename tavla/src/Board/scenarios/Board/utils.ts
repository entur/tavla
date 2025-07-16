import { TSituationFragment } from 'graphql/index'
import { TFontSize } from 'types/meta'
import { TBoard } from 'types/settings'
export function getFontScale(fontSize: TFontSize | undefined) {
    switch (fontSize) {
        case 'small':
            return 'text-em-sm'
        case 'medium':
            return 'text-em-base'
        case 'large':
            return 'text-em-lg'
        default:
            return 'text-em-base'
    }
}
export function defaultFontSize(board: TBoard) {
    if (!board.tiles || board.tiles.length === 0) return 'medium'

    switch (board.tiles.length) {
        case 1:
            return 'large'
        case 2:
            return 'medium'
        default:
            return 'small'
    }
}

export function combineIdenticalSituations(situations: TSituationFragment[]) {
    const situationById: { [id: string]: TSituationFragment } = {}

    situations.map((situation) => {
        const id = situation.id
        if (situationById[id]) {
            const existingOrigins = situationById[id].origin
                ?.split(', ')
                .concat([situation.origin ?? ''])
                .sort()

            situationById[id].origin = existingOrigins?.join(', ')
        } else {
            situationById[id] = situation
        }
    })

    return Object.values(situationById)
}
