import CompactDark from '../../assets/previews/previewDark/Kompakt-dark.svg'
import ChronoDark from '../../assets/previews/previewDark/Kronologisk-dark.svg'
import TimelineDark from '../../assets/previews/previewDark/Tidslinje-dark.svg'
import CompactLight from '../../assets/previews/previewLight/Kompakt-light.svg'
import ChronoLight from '../../assets/previews/previewLight/Kronologisk-light.svg'
import TimelineLight from '../../assets/previews/previewLight/Tidslinje-light.svg'
import CompactDefault from '../../assets/previews/previewDefault/Kompakt-blue.svg'
import ChronoDefault from '../../assets/previews/previewDefault/Kronologisk-blue.svg'
import TimelineDefault from '../../assets/previews/previewDefault/Tidslinje-blue.svg'
import CompactGrey from '../../assets/previews/previewGrey/Kompakt-grey.svg'
import ChronoGrey from '../../assets/previews/previewGrey/Kronologisk-grey.svg'
import TimelineGrey from '../../assets/previews/previewGrey/Tidslinje-grey.svg'

import { Theme } from '../../types'

export function ThemeDashbboardPreview(
    theme: Theme | undefined,
): { [key: string]: any } {
    switch (theme) {
        case Theme.DARK:
            return {
                Timeline: TimelineDark,
                Chrono: ChronoDark,
                Compact: CompactDark,
            }
        case Theme.GREY:
            return {
                Timeline: TimelineGrey,
                Chrono: ChronoGrey,
                Compact: CompactGrey,
            }
        case Theme.LIGHT:
            return {
                Timeline: TimelineLight,
                Chrono: ChronoLight,
                Compact: CompactLight,
            }
        default:
            return {
                Timeline: TimelineDefault,
                Chrono: ChronoDefault,
                Compact: CompactDefault,
            }
    }
}
