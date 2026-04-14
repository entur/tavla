'use client'

import {
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Paragraph,
} from '@entur/typography'
import { type JSX, useEffect, useRef, useState } from 'react'
import { PaletteFeature } from './PaletteFeature'
import { ShowcaseContent } from './ShowcaseContent'
import { ThemeFeature } from './ThemeFeature'

type Feature = { title: string; description: string; content: JSX.Element }

const FEATURES: Feature[] = [
    {
        title: 'Gjør tavla til din egen',
        description:
            'Tilpass tavla til dine behov og omgivelser. Du kan legge til logo, endre farger på transportmidlene og velge mellom mørkt eller lyst tema.',
        content: <ThemeFeature />,
    },
    {
        title: 'Velg farger på transportmidlene',
        description:
            'I noen fylker kan du velge lokale fargepaletter som følger kollektivsselskapet.',
        content: <PaletteFeature />,
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
            style={{ height: `${FEATURES.length * 50}vh` }}
        >
            <div className="bg-blue sticky rounded-3xl overflow-hidden lg:mx-24 mt-20">
                <div className="flex flex-col my-24 text-center w-full">
                    <Heading1 as="h2" className="text-white">
                        Tilpass alt. Eller ingenting!
                    </Heading1>
                    <Paragraph className="text-white">
                        Du kan velge å bare legge til stoppesteder, eller
                        tilpasse den etter dine behov.
                    </Paragraph>
                </div>
                <div className="flex flex-col gap-2 text-left justify-normal w-1/2">
                    {FEATURES.map((feature, index) => {
                        const isActive = index === activeIndex

                        return (
                            <button
                                type="button"
                                key={feature.title}
                                onClick={() => handleFeatureClick(index)}
                                className="cursor-pointer duration-300 ease-in-out text-left ml-24"
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
            </div>
        </div>
    )
}
