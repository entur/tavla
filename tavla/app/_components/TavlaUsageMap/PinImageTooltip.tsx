'use client'
import { MapPinIcon } from '@entur/icons'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { dataColors } from 'utils/tailwindColors'
import type { PinData } from './pins'

const HORIZONTAL_GAP = 4

type Props = {
    pin: PinData
    rect: DOMRect
}

export function PinImageTooltip({ pin, rect }: Props) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const frame = requestAnimationFrame(() => setVisible(true))
        return () => cancelAnimationFrame(frame)
    }, [])

    const top = rect.bottom
    const left =
        pin.tooltipSide === 'right'
            ? rect.right + HORIZONTAL_GAP
            : rect.left - HORIZONTAL_GAP

    const baseTransform =
        pin.tooltipSide === 'left'
            ? 'translateX(-100%) translateY(-100%)'
            : 'translateY(-100%)'

    return (
        <div
            className="fixed z-50 pointer-events-none"
            style={{
                left,
                top,
                transform: `${baseTransform} scale(${visible ? 1 : 0.96})`,
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.35s ease-out, transform 0.35s ease-out',
            }}
        >
            <div
                className="rounded-sm overflow-hidden shadow-lg relative"
                style={{ border: `6px solid ${dataColors.blue}` }}
            >
                <Image
                    src={pin.imageSrc}
                    alt={pin.label}
                    width={280}
                    height={210}
                    style={{ width: '360px', height: 'auto' }}
                />
                <div
                    className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-md text-xs font-medium whitespace-nowrap"
                    style={{ color: dataColors.blue }}
                >
                    <MapPinIcon width={14} height={14} className="shrink-0" />
                    <span className="leading-[14px]">{pin.label}</span>
                </div>
            </div>
        </div>
    )
}
