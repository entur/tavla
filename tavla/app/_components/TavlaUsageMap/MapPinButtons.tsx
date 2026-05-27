import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import type { PinData } from './pins'
import { PINS } from './pins'

const MAP_WIDTH = 617
const MAP_HEIGHT = 581

type Props = {
    onPinHover: (pin: PinData, rect: DOMRect) => void
    onPinLeave: () => void
}

export function MapPinButtons({ onPinHover, onPinLeave }: Props) {
    const { capture } = usePosthogTracking()
    return (
        <>
            {PINS.map((pin) => {
                const handleHover = (
                    e: React.MouseEvent | React.FocusEvent,
                ) => {
                    capture('usage_map_pin_hovered', { pin_label: pin.label })
                    onPinHover(pin, e.currentTarget.getBoundingClientRect())
                }
                return (
                    <button
                        key={pin.index}
                        type="button"
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-10 cursor-default focus-visible bg-transparent"
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
