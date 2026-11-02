import { getColorMode } from 'app/_components/TransportIcon/utils'
import type { LineWithFrontText } from '../../utils/types'

export function PublicCode({ line }: { line: LineWithFrontText }) {
    if (!line.publicCode) return null

    const color = getColorMode(
        line.transportMode ?? 'unknown',
        line.transportSubmode ?? 'unknown',
    )

    return (
        <div className={`publicCode bg-${color} text-white`}>
            {line.publicCode}
        </div>
    )
}
