'use client'

import { MapPinIcon } from '@entur/icons'
import { Heading4 } from '@entur/typography'
import TavlaMoreOgRomsdalPalette from 'assets/illustrations/TavlaMoreOgRomsdalPalette.svg'
import TavlaNationalPalette from 'assets/illustrations/TavlaNationalPalette.svg'
import TavlaTrondelagPalette from 'assets/illustrations/TavlaTrondelagPalette.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { TransportPalettePreview } from '../../(admin)/tavler/[id]/rediger/components/Settings/components/TransportPalettePreview'

export function PaletteFeature() {
    const palettes = ['default', 'atb', 'fram'] as const
    const [palette, setPalette] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setPalette((prev) => (prev + 1 === palettes.length ? 0 : prev + 1))
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    const paletteToRegion = (palette: string | undefined) => {
        switch (palette) {
            default:
            case 'default':
                return 'Norge'
            case 'atb':
                return 'Trøndelag'
            case 'fram':
                return 'Møre og Romsdal'
            case 'reis':
                return 'Nordland'
        }
    }

    const paletteToImage = (palette: string | undefined) => {
        switch (palette) {
            default:
            case 'default':
                return (
                    <Image
                        src={TavlaNationalPalette}
                        alt="Tavla med nasjonalt palett."
                        className="w-[200%] sm:w-[150%] lg:w-[1000px] sm:min-w-[800px] h-auto max-w-none object-cover object-left-top rounded-tl-md sm:rounded-tl-xl shadow-lg"
                    />
                )
            case 'atb':
                return (
                    <Image
                        src={TavlaTrondelagPalette}
                        alt="Tavla med Trøndelag-palett."
                        className="w-[200%] sm:w-[150%] lg:w-[1000px] sm:min-w-[800px] h-auto max-w-none object-cover object-left-top rounded-tl-md sm:rounded-tl-xl shadow-lg"
                    />
                )
            case 'fram':
                return (
                    <Image
                        src={TavlaMoreOgRomsdalPalette}
                        alt="Tavla med Møre og Romsdal-palett."
                        className="w-[200%] sm:w-[150%] lg:w-[1000px] sm:min-w-[800px] h-auto max-w-none object-cover object-left-top rounded-tl-md sm:rounded-tl-xl shadow-lg"
                    />
                )
        }
    }

    return (
        <>
            <div className="absolute top-4 right-4 z-10 bg-white rounded-xl p-4 border border-[#D9DAE8] w-56 flex flex-col justify-center items-center">
                <MapPinIcon size={40} />
                <Heading4 className="m-0">
                    {paletteToRegion(palettes[palette])}
                </Heading4>
                <TransportPalettePreview
                    theme={'light'}
                    palette={palettes[palette] ?? 'default'}
                />
            </div>
            <div className="w-full h-full p-5 sm:pt-20 sm:pl-8 flex justify-start items-start">
                {paletteToImage(palettes[palette])}
            </div>
        </>
    )
}
