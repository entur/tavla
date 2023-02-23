import { Theme } from 'src/types'
import DarkRotated from '../previews/direction-preview/dark_rotated.svg'
import DarkStandard from '../previews/direction-preview/dark_standard.svg'
import EnturRotated from '../previews/direction-preview/entur_rotated.svg'
import EnturStandard from '../previews/direction-preview/entur_standard.svg'
import GreyRotated from '../previews/direction-preview/grey_rotated.svg'
import GreyStandard from '../previews/direction-preview/grey_standard.svg'
import LightRotated from '../previews/direction-preview/light_rotated.svg'
import LightStandard from '../previews/direction-preview/light_standard.svg'

function DirectionPreview(
    theme: Theme | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
    switch (theme) {
        case 'dark':
            return {
                Standard: DarkStandard,
                Rotated: DarkRotated,
            }

        case 'grey':
            return {
                Standard: GreyStandard,
                Rotated: GreyRotated,
            }
        case 'light':
            return {
                Standard: LightStandard,
                Rotated: LightRotated,
            }
        default:
            return {
                Standard: EnturStandard,
                Rotated: EnturRotated,
            }
    }
}

export { DirectionPreview }
