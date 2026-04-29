'use client'

import { Heading1, Heading3, Paragraph } from '@entur/typography'
import Image from 'next/image'
import { type JSX, useState } from 'react'
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
                className={'object-contain max-h-full'}
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
                className={'object-contain max-h-full'}
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
                className={'object-contain max-h-full'}
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
                className={'object-contain max-h-full'}
            />
        ),
    },
]

function FeatureShowcase() {
    const [activeIndex, setActiveIndex] = useState(0)

    const activeFeature = FEATURES[activeIndex]

    const MobileView = () => {
        const previousFeatures = FEATURES.slice(0, activeIndex)
        const nextFeatures = FEATURES.slice(activeIndex + 1)

        if (!activeFeature) return null

        return (
            <div className="flex flex-col h-full p-4 gap-1 lg:hidden flex-1 min-h-0 px-4">
                <div className="flex flex-col gap-1">
                    {previousFeatures.map((f, index) => (
                        <button
                            key={f.title}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`border border-[#8186AF] rounded-lg p-3 text-sm font-bold text-white text-left hover:opacity-80 transition-opacity`}
                        >
                            {f.title}
                        </button>
                    ))}
                </div>
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                    <div className="bg-hoverContrast border border-[#8186AF] rounded-lg px-4 py-3 mb-3">
                        <p className="font-bold text-blue text-sm mb-1">
                            {activeFeature.title}
                        </p>
                        <Paragraph margin="none" className="text-sm">
                            {activeFeature.description}
                        </Paragraph>
                    </div>
                    <div className="flex-1 flex items-center justify-center min-h-0 mb-4">
                        {activeFeature.content}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    {nextFeatures.map((f, index) => (
                        <button
                            key={f.title}
                            type="button"
                            onClick={() =>
                                setActiveIndex(activeIndex + 1 + index)
                            }
                            className={`border border-[#8186AF] rounded-lg p-3 text-sm font-bold text-white text-left hover:opacity-80 transition-opacity`}
                        >
                            {f.title}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    const DesktopView = () => {
        return (
            <div className="relative text-left w-full h-full hidden lg:flex flex-1 min-h-0 px-12">
                <div className="flex flex-col gap-2 w-1/2 relative pt-24">
                    {FEATURES.map((feature, index) => {
                        const isActive = index === activeIndex

                        return (
                            <button
                                key={feature.title}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className="text-left lg:ml-10 xl:ml-20"
                            >
                                <div
                                    className={`p-6 rounded-xl border-2 border-[#8186AF] transition-all duration-500 ease-in-out ${isActive ? 'bg-hoverContrast' : ''}`}
                                >
                                    <Heading3
                                        margin="none"
                                        className={`text-2xl transition-colors duration-300 ${isActive ? 'text-blue font-semibold' : 'text-white font-medium'}`}
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
                <div className="w-1/2 flex items-center justify-center pointer-events-none ml-2">
                    {activeFeature?.content}
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-screen left-1/2 -translate-x-1/2 mt-20">
            <div className="bg-blue h-[880px]  w-full flex flex-col overflow-hidden py-8 lg:py-12">
                <div className="max-w-[1539px] mx-auto w-full flex flex-1 flex-col justify-center gap-8 lg:gap-12 min-h-0">
                    <div className="px-6 pt-8 lg:px-24 text-center shrink-0">
                        <Heading1 as="h2" className="text-white">
                            Tilpass alt. Eller ingenting!
                        </Heading1>
                        <Paragraph className="text-white">
                            Du kan velge å bare legge til stoppesteder, eller
                            tilpasse den etter dine behov.
                        </Paragraph>
                    </div>

                    <MobileView />
                    <DesktopView />
                </div>
            </div>
        </div>
    )
}

export { FeatureShowcase }
