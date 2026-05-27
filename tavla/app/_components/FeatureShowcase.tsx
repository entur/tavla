'use client'

import { Heading1, Heading3, Paragraph } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Image from 'next/image'
import { type JSX, useState } from 'react'
import TavlaAdministration from 'src/assets/illustrations/Tavla-administration.svg'
import TavlaCustomization from 'src/assets/illustrations/Tavla-customization.svg'
import TavlaShowInfo from 'src/assets/illustrations/Tavla-show-info.svg'
import TavlaTransportNorge from 'src/assets/illustrations/Tavla-Transport-Norge.svg'

type Feature = {
    title: string
    description: string
    content: JSX.Element
    trackingId: EventProps<'feature_showcase_clicked'>['feature']
}

const FEATURES: Feature[] = [
    {
        title: 'Gjør tavla til din egen',
        description:
            'Tilpass tavla til dine behov og omgivelser. Du kan legge til logo, endre farger på transportmidlene og velge mellom mørkt eller lyst tema.',
        content: (
            <Image
                alt="Bilde av Tavla-avgangstavler som har forskjelige temaer. Den ene er hvit og viser avganger fra Oslo lufthavn i hvit drakt, med nasjonale farger for reisemilder. Den andre er i mørk drakt og viser holdeplassen Lerkendal i Trondheim med farger brukt av fylkesoperatøren AtB."
                src={TavlaCustomization}
                className={'object-contain max-h-full'}
            />
        ),
        trackingId: 'customization',
    },
    {
        title: 'I hele Norge',
        description:
            'Du kan se avganger til buss, tog, ferge og fly i alle fylker. Uansett hvor eller hvordan folk reiser, kan du lage en tavle som viser relevante avganger.',
        content: (
            <Image
                alt="Kart over Norge med ikoner for buss, tog, trikk, fly, båt og t-bane på forskjellige steder rundt om i landet."
                src={TavlaTransportNorge}
                className={'object-contain max-h-full'}
            />
        ),
        trackingId: 'norway',
    },
    {
        title: 'Enkel å administrere',
        description:
            'Logg inn, organiser tavlene i mapper og del dem med andre. Det er enkelt å samarbeide med administreringen av tavler!',
        content: (
            <Image
                alt="Bilde av avgangstavler med piler til forskjellige mapper som organiserer de. En tavle med to holdeplasser i Oslo har pil til mappen 'Busser i Oslo.' En tavle med andre holdeplasser i hovedstaden har piler til mappen 'Team Tavla.' Den siste tavlen er av en holdeplass i nærheten av hovedkontoret til Entur, hvor mappen har navn 'Enturkontoret'."
                src={TavlaAdministration}
                className={'object-contain max-h-full'}
            />
        ),
        trackingId: 'administration',
    },
    {
        title: 'Vis det folk faktisk trenger',
        description:
            'Velg hvilke stoppesteder du ønsker å vise på tavla, du kan legge til så mange som er relevant for dine behov. Tilpass hvilke transportmidler, linjer og informasjon som skal vises.',
        content: (
            <Image
                alt="Bildet viser en tavle med holdeplassene Birkelunden og Sannergata i Oslo. Birkelunden viser kun avganger med trikk, og under er det vist et eksempel fra redigeringssiden der det er kun huket av for avganger med trikk. Sannergata viser kun bussen '21 Helsfyr', og over er det vist et eksempel fra redigeringssiden der kun bussen '21 Helsfyr' er huket av under plattform B."
                src={TavlaShowInfo}
                className={'object-contain max-h-full'}
            />
        ),
        trackingId: 'show_info',
    },
]

type ViewProps = {
    activeIndex: number
    setActiveIndex: (index: number) => void
    activeFeature: Feature | undefined
}

const MobileView = ({
    activeIndex,
    setActiveIndex,
    activeFeature,
}: ViewProps) => {
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
                        className="border border-[#8186AF] rounded-lg p-3 text-sm font-bold text-white text-left hover:opacity-80 transition-opacity"
                    >
                        {f.title}
                    </button>
                ))}
            </div>
            <div className="flex-1 flex flex-col overflow-hidden min-h-0 animate-feature-in">
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
                        onClick={() => setActiveIndex(activeIndex + 1 + index)}
                        className="border border-[#8186AF] rounded-lg p-3 text-sm font-bold text-white text-left hover:opacity-80 transition-opacity"
                    >
                        {f.title}
                    </button>
                ))}
            </div>
        </div>
    )
}

const DesktopView = ({
    activeIndex,
    setActiveIndex,
    activeFeature,
}: ViewProps) => {
    return (
        <div className="text-left w-full h-full hidden lg:flex flex-1 min-h-0 gap-4">
            <div className="flex flex-col gap-2 w-1/2 relative pt-24">
                {FEATURES.map((feature, index) => {
                    const isActive = index === activeIndex

                    return (
                        <button
                            key={feature.title}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className="text-left"
                        >
                            <div
                                className={`p-6 rounded-xl border-2 border-[#8186AF] transition-colors duration-300 ${isActive ? 'bg-hoverContrast' : ''}`}
                            >
                                <Heading3
                                    margin="none"
                                    className={`text-2xl transition-colors duration-300 ${isActive ? 'text-blue font-semibold' : 'text-white font-medium'}`}
                                >
                                    {feature.title}
                                </Heading3>
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${isActive ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr] mt-0'}`}
                                >
                                    <div
                                        className={`overflow-hidden transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <Paragraph
                                            margin="none"
                                            className="text-lg"
                                        >
                                            {feature.description}
                                        </Paragraph>
                                    </div>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
            <div
                key={activeIndex}
                className="w-1/2 flex items-center justify-center pointer-events-none ml-2 animate-feature-in"
            >
                {activeFeature?.content}
            </div>
        </div>
    )
}

function FeatureShowcase() {
    const [activeIndex, setActiveIndex] = useState(0)

    const activeFeature = FEATURES[activeIndex]
    const { capture } = usePosthogTracking()

    const handleSetActiveIndex = (index: number) => {
        const feature = FEATURES[index]
        if (feature) {
            capture('feature_showcase_clicked', {
                feature: feature.trackingId,
            })
        }
        setActiveIndex(index)
    }

    return (
        <div className="bg-blue rounded-3xl w-full flex flex-col justify-center overflow-hidden px-4 lg:px-16 py-8 lg:py-24">
            <div className="w-full flex flex-col justify-center gap-2 min-h-0">
                <div className="text-center shrink-0">
                    <Heading1 as="h2" className="text-white">
                        Tilpass alt. Eller ingenting!
                    </Heading1>
                    <Paragraph className="text-white">
                        Du kan velge å bare legge til stoppesteder, eller
                        tilpasse den etter dine behov.
                    </Paragraph>
                </div>

                <MobileView
                    activeIndex={activeIndex}
                    setActiveIndex={handleSetActiveIndex}
                    activeFeature={activeFeature}
                />
                <DesktopView
                    activeIndex={activeIndex}
                    setActiveIndex={handleSetActiveIndex}
                    activeFeature={activeFeature}
                />
            </div>
        </div>
    )
}

export { FeatureShowcase }
