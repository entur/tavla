import { TFontSize } from 'types/meta'
import { TBoard } from 'types/settings'
export function getFontScale(fontSize: TFontSize | undefined) {
    switch (fontSize) {
        case 'small':
            return 0.7
        case 'medium':
            return 1
        case 'large':
            return 1.3
        default:
            return 1
    }
}
export function defaultFontSize(board: TBoard) {
    switch (board.tiles.length) {
        case 1:
            return 'large'
        case 2:
            return 'medium'
        default:
            return 'small'
    }
}
