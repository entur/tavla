'use client'
import { Heading1, Paragraph } from '@entur/typography'
import { CreateBoardButton } from 'app/components/CreateBoardButton'
import TavlaNorwayMap from 'assets/illustrations/Tavla-Norway.svg'
import Image from 'next/image'
import { useState } from 'react'
import { NavigateToOversiktButton } from '../NavigateToOversiktButton'
import { PinTooltip } from './PinTooltip'
import type { PinData } from './pins'
import { TavlaNorwayMapSVG } from './TavlaNorwayMapSVG'

type HoverState = {
    pin: PinData
    rect: DOMRect
}

export function TavlaUsageMap({ loggedIn }: { loggedIn: boolean }) {
    const [hovered, setHovered] = useState<HoverState | null>(null)

    return (
        <div className="bg-[#F5F6FA] rounded-3xl w-full flex flex-row justify-center overflow-hidden px-4 lg:px-16 py-8 lg:py-24">
            <div className="lg:w-1/3 flex flex-col text-center lg:text-left">
                <Heading1 as="h2" margin="none">
                    Hvor brukes Tavla?
                </Heading1>
                <Paragraph className="my-2 mb-10 text-lg">
                    Overalt hvor folk tar kollektivt.
                </Paragraph>

                <ul className="flex flex-col gap-4 my-8 text-primary mx-auto lg:ml-0">
                    {[
                        'Busstopp',
                        'Kollektivknutepunkt',
                        'Kontorer',
                        'Borettslag',
                        'Hjemme',
                        'Flyplasser',
                        'Skoler og universiteter',
                    ].map((item) => (
                        <li
                            key={item}
                            className="flex items-center gap-3 text-nowrap"
                        >
                            <div className="w-2.5 h-2.5 rounded-full bg-coral shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="mt-20 mx-auto lg:mx-0">
                    {loggedIn ? (
                        <NavigateToOversiktButton />
                    ) : (
                        <CreateBoardButton />
                    )}
                </div>
            </div>
            <div className="w-2/3 items-center justify-center hidden lg:flex">
                <div className="relative w-full aspect-[730/688]">
                    <Image
                        className="w-full h-full object-contain"
                        src={TavlaNorwayMap}
                        alt="Kart over Norge med pins på flere forskjellige steder, for å vise at Tavla er i bruk over hele landet."
                    />
                    <TavlaNorwayMapSVG
                        onPinHover={(pin, rect) => setHovered({ pin, rect })}
                        onPinLeave={() => setHovered(null)}
                    />
                </div>
                {hovered && (
                    <PinTooltip pin={hovered.pin} rect={hovered.rect} />
                )}
            </div>
        </div>
    )
}
