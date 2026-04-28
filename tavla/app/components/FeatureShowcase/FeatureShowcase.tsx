'use client'

import { Heading1, Heading3, Paragraph } from '@entur/typography'
import Image from 'next/image'
import { type JSX, useEffect, useRef, useState } from 'react'
import TavlaAdministration from 'src/assets/illustrations/Tavla-administration.svg'
import TavlaCustomization from 'src/assets/illustrations/Tavla-customization.svg'
import TavlaShowInfo from 'src/assets/illustrations/Tavla-show-info.svg'
import TavlaTransportNorge from 'src/assets/illustrations/Tavla-Transport-Norge.svg'

type Feature = { title: string; description: string; content: JSX.Element }

const FEATURES: Feature[] = [
    {
        title: 'Gjør tavla til din egen',
        description:
            'Tilpass tavla til dine behov og omgivelser. Du kan legge til logo, endre farger på transportmidlene og velge mellom mørkt eller lyst tema.',
        content: (
            <Image
                alt=""
                src={TavlaCustomization}
                className={'object-contain max-h-full p-4'}
            />
        ),
    },
    {
        title: 'I hele Norge',
        description:
            'Du kan se avganger til buss, tog, ferge og fly i alle fylker. Uansett hvor eller hvordan folk reiser, kan du lage en tavle som viser relevante avganger.',
        content: (
            <Image
                alt=""
                src={TavlaTransportNorge}
                className={'object-contain max-h-full p-4'}
            />
        ),
    },
    {
        title: 'Enkel å administrere',
        description:
            'Logg inn, organiser tavlene i mapper og del dem med andre, så dere kan samarbeide om administreringen.',
        content: (
            <Image
                alt=""
                src={TavlaAdministration}
                className={'object-contain max-h-full p-4'}
            />
        ),
    },
    {
        title: 'Vis det folk faktisk trenger',
        description:
            'Velg hvilke stoppesteder du ønsker å vise på tavla, du kan legge til så mange som er relevant for dine behov. Tilpass hvilke transportmidler, linjer og informasjon som skal vises.',
        content: (
            <Image
                alt=""
                src={TavlaShowInfo}
                className={'object-contain max-h-full p-4'}
            />
        ),
    },
]

export function FeatureShowcase() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return

            const { top, height } = containerRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight

            if (top > 0) {
                setActiveIndex(0)
                return
            }

            const scrollDistance = -top
            const sectionHeight = (height - windowHeight) / FEATURES.length

            let index = Math.floor(scrollDistance / sectionHeight)
            if (index < 0) index = 0
            if (index >= FEATURES.length) index = FEATURES.length - 1

            setActiveIndex(index)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleFeatureClick = (index: number) => {
        if (!containerRef.current) return

        const windowHeight = window.innerHeight
        const containerTop = containerRef.current.offsetTop
        const sectionHeight =
            (containerRef.current.offsetHeight - windowHeight) / FEATURES.length

        window.scrollTo({
            top: containerTop + sectionHeight * index + 10,
            behavior: 'smooth',
        })
    }

    return (
        <div
            ref={containerRef}
            className="relative"
            style={{ height: `${FEATURES.length * 45}vh` }}
        >
            <div className="bg-blue sticky top-20 rounded-3xl overflow-hidden lg:mx-24 my-20 pb-20">
                <div className="flex flex-col my-24 text-center w-full">
                    <Heading1 as="h2" className="text-white">
                        Tilpass alt. Eller ingenting!
                    </Heading1>
                    <Paragraph className="text-white">
                        Du kan velge å bare legge til stoppesteder, eller
                        tilpasse den etter dine behov.
                    </Paragraph>
                </div>
                <div className="relative text-left">
                    <div className="flex flex-col gap-2 w-1/2 z-10 relative">
                        {FEATURES.map((feature, index) => {
                            const isActive = index === activeIndex

                            return (
                                <button
                                    key={feature.title}
                                    type="button"
                                    onClick={() => handleFeatureClick(index)}
                                    className="cursor-pointer duration-300 ease-in-out text-left ml-20"
                                >
                                    <div
                                        className={`overflow-hidden transition-all duration-500 ease-in-out pointer-events-none p-8 rounded-xl border-2 border-[#8186AF] ${isActive ? 'bg-hoverContrast' : 'bg-none h-24'}`}
                                    >
                                        <Heading3
                                            margin="none"
                                            className={`font-semibold transition-colors duration-300 justify-center pointer-events-none ${isActive ? 'text-blue' : 'text-white'}`}
                                        >
                                            {feature.title}
                                        </Heading3>
                                        <Paragraph
                                            margin="none"
                                            className={`text-lg ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                        >
                                            {feature.description}
                                        </Paragraph>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                    <div className="absolute -top-20 bottom-0 right-0 w-1/2 flex items-center justify-center pointer-events-none">
                        {FEATURES[activeIndex]?.content}
                    </div>
                </div>
            </div>
        </div>
    )
}
