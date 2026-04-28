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
                className={'object-contain max-h-full p-2'}
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
                className={'object-contain max-h-full p-2'}
            />
        ),
    },
    {
        title: 'Enkel å administrere',
        description:
            'Logg inn, organiser tavlene i mapper og del dem med andre. Det er enkelt å samarbeide med administreringen av tavler!',
        content: (
            <Image
                alt=""
                src={TavlaAdministration}
                className={'object-contain max-h-full p-2'}
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
                className={'object-contain max-h-full p-2'}
            />
        ),
    },
]

type ViewProps = {
    features: Feature[]
    activeIndex: number
    onFeatureClick: (index: number) => void
}

const TITLE_CARD_BASE =
    'border border-[#8186AF] rounded-lg px-3 py-3 text-sm font-bold'

function PastTitles({
    features,
    activeIndex,
    onFeatureClick,
}: {
    features: Feature[]
    activeIndex: number
    onFeatureClick: (index: number) => void
}) {
    const past = features.slice(0, activeIndex)
    if (past.length === 0) return null
    return (
        <div className="flex flex-col gap-1">
            {past.map((f, i) => (
                <button
                    key={f.title}
                    type="button"
                    onClick={() => onFeatureClick(i)}
                    className={`${TITLE_CARD_BASE} text-white text-left hover:opacity-80 transition-opacity`}
                >
                    {f.title}
                </button>
            ))}
        </div>
    )
}

function FutureTitles({ features, activeIndex, onFeatureClick }: ViewProps) {
    const future = features.slice(activeIndex + 1)
    if (future.length === 0) return null
    return (
        <div className="flex flex-col gap-1">
            {future.map((f, i) => (
                <button
                    key={f.title}
                    type="button"
                    onClick={() => onFeatureClick(activeIndex + 1 + i)}
                    className={`${TITLE_CARD_BASE} text-white text-left hover:opacity-80 transition-opacity`}
                >
                    {f.title}
                </button>
            ))}
        </div>
    )
}

function MobileView({ features, activeIndex, onFeatureClick }: ViewProps) {
    const active = features[activeIndex]
    if (!active) return null
    return (
        <div className="flex flex-col h-full p-4 gap-1">
            <PastTitles
                features={features}
                activeIndex={activeIndex}
                onFeatureClick={onFeatureClick}
            />
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                <div className="bg-hoverContrast border border-[#8186AF] rounded-lg px-4 py-3 mb-3">
                    <p className="font-bold text-blue text-sm mb-1">
                        {active.title}
                    </p>
                    <Paragraph margin="none" className="text-sm">
                        {active.description}
                    </Paragraph>
                </div>
                <div className="flex-1 flex items-center justify-center min-h-0">
                    {active.content}
                </div>
            </div>
            <FutureTitles
                features={features}
                activeIndex={activeIndex}
                onFeatureClick={onFeatureClick}
            />
        </div>
    )
}

function DesktopView({ features, activeIndex, onFeatureClick }: ViewProps) {
    return (
        <div className="relative text-left w-full h-full flex items-center">
            <div className="flex flex-col gap-2 w-1/2 relative">
                {features.map((feature, index) => {
                    const isActive = index === activeIndex
                    return (
                        <button
                            key={feature.title}
                            type="button"
                            onClick={() => onFeatureClick(index)}
                            className="cursor-pointer duration-300 ease-in-out text-left lg:ml-10 xl:ml-20"
                        >
                            <div
                                className={`transition-all p-6 duration-500 ease-in-out pointer-events-none rounded-xl border-2 border-[#8186AF] ${isActive ? 'bg-hoverContrast' : 'bg-none'}`}
                            >
                                <Heading3
                                    margin="none"
                                    className={`text-2xl font-medium transition-colors duration-300 pointer-events-none ${isActive ? 'text-blue font-semibold' : 'text-white'}`}
                                >
                                    {feature.title}
                                </Heading3>
                                {isActive && (
                                    <Paragraph
                                        margin="none"
                                        className="text-lg mt-2"
                                    >
                                        {feature.description}
                                    </Paragraph>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>
            <div className="absolute -top-10 bottom-0 right-0 w-1/2 px-4 flex items-center justify-center pointer-events-none">
                {features[activeIndex]?.content}
            </div>
        </div>
    )
}

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
            className="relative w-screen left-1/2 -translate-x-1/2"
            style={{ height: `${FEATURES.length * 45}vh` }}
        >
            <div className="bg-blue sticky top-0 [@media(min-height:880px)]:top-12 overflow-hidden w-full flex flex-col py-8 lg:py-12 h-dvh [@media(min-height:880px)]:h-[calc(100dvh-6rem)]">
                <div className="max-w-[1539px] mx-auto w-full flex flex-col gap-8 lg:gap-12 flex-1 min-h-0">
                    <div className="flex flex-col px-6 lg:px-24 text-center w-full shrink-0">
                        <Heading1 as="h2" className="text-white">
                            Tilpass alt. Eller ingenting!
                        </Heading1>
                        <Paragraph className="text-white">
                            Du kan velge å bare legge til stoppesteder, eller
                            tilpasse den etter dine behov.
                        </Paragraph>
                    </div>

                    {/* Mobile */}
                    <div className="flex lg:hidden flex-1 min-h-0 px-4">
                        <MobileView
                            features={FEATURES}
                            activeIndex={activeIndex}
                            onFeatureClick={handleFeatureClick}
                        />
                    </div>

                    {/* Desktop */}
                    <div className="hidden lg:flex flex-1 px-12 min-h-0">
                        <DesktopView
                            features={FEATURES}
                            activeIndex={activeIndex}
                            onFeatureClick={handleFeatureClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
