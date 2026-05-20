import type { PinData } from './pins'
import { PINS } from './pins'

const MAP_WIDTH = 617
const MAP_HEIGHT = 581

type Props = {
    onPinHover: (pin: PinData, pinIndex: number, rect: DOMRect) => void
    onPinLeave: () => void
}

export function TavlaNorwayMapSVG({ onPinHover, onPinLeave }: Props) {
    return (
        <>
            {PINS.map((pin) => {
                const pinIndex = Number.parseInt(pin.id.replace('pin-', ''), 10)
                const handleHover = (e: React.MouseEvent | React.FocusEvent) =>
                    onPinHover(
                        pin,
                        pinIndex,
                        e.currentTarget.getBoundingClientRect(),
                    )
                return (
                    <button
                        key={pin.id}
                        type="button"
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-10 cursor-pointer bg-transparent"
                        style={{
                            left: `${(pin.cx / MAP_WIDTH) * 100}%`,
                            top: `${(pin.cy / MAP_HEIGHT) * 100}%`,
                        }}
                        aria-label={pin.label}
                        onMouseEnter={handleHover}
                        onMouseLeave={onPinLeave}
                        onFocus={handleHover}
                        onBlur={onPinLeave}
                    />
                )
            })}
        </>
    )
}
