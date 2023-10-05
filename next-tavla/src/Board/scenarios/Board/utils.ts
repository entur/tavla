import { TFontSize } from 'types/meta'
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
