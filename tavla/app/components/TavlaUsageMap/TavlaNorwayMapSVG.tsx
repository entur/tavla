import type { PinData } from './pins'
import { PINS } from './pins'

const MAP_WIDTH = 730
const MAP_HEIGHT = 688

type Props = {
    onPinHover: (pin: PinData, rect: DOMRect) => void
    onPinLeave: () => void
}

export function TavlaNorwayMapSVG({ onPinHover, onPinLeave }: Props) {
    return (
        <>
            {PINS.filter((pin) => pin.interactive).map((pin) => (
                <button
                    key={pin.id}
                    type="button"
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-10 cursor-pointer bg-transparent"
                    style={{
                        left: `${(pin.cx / MAP_WIDTH) * 100}%`,
                        top: `${(pin.cy / MAP_HEIGHT) * 100}%`,
                    }}
                    aria-label={pin.label}
                    onMouseEnter={(e) =>
                        onPinHover(pin, e.currentTarget.getBoundingClientRect())
                    }
                    onMouseLeave={onPinLeave}
                    onFocus={(e) =>
                        onPinHover(pin, e.currentTarget.getBoundingClientRect())
                    }
                    onBlur={onPinLeave}
                />
            ))}
        </>
    )
}
