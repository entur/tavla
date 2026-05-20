import { MapPinIcon } from '@entur/icons'
import Image from 'next/image'
import type { PinData } from './pins'

// Same dark blue as the Norway map fill (#181C56) --> sjekke om farger kan hentes på en annen måte.
const MAP_BLUE = '#181C56'
const HORIZONTAL_GAP = 4

type Props = {
    pin: PinData
    rect: DOMRect
}

export function PinTooltip({ pin, rect }: Props) {
    const top = rect.bottom
    const left =
        pin.tooltipSide === 'right'
            ? rect.right + HORIZONTAL_GAP
            : rect.left - HORIZONTAL_GAP

    return (
        <div
            className="fixed z-50 pointer-events-none"
            style={{
                left,
                top,
                transform:
                    pin.tooltipSide === 'left'
                        ? 'translateX(-100%) translateY(-100%)'
                        : 'translateY(-100%)',
            }}
        >
            <div
                className="rounded-sm overflow-hidden shadow-lg relative"
                style={{ border: `6px solid ${MAP_BLUE}` }}
            >
                <Image
                    src={pin.imageSrc}
                    alt={pin.label}
                    width={280}
                    height={210}
                    className="object-cover block"
                />
                <div
                    className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-md text-xs font-medium whitespace-nowrap leading-none"
                    style={{ color: MAP_BLUE }}
                >
                    <MapPinIcon width={14} height={14} className="shrink-0" />
                    <span className="leading-none">{pin.label}</span>
                </div>
            </div>
        </div>
    )
}
