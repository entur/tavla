'use client'

import { Heading1 } from '@entur/typography'
import { useState, useEffect } from 'react'

export default function WordCarousel() {
    const words = ['Kontoret', 'Biblioteket', 'Skolen', 'Treningssenteret']
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [fade, setFade] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false)
            setCurrentWordIndex((currentWordIndex + 1) % words.length)
            setFade(true)
        }, 4000)
        return () => clearInterval(interval)
    }, [[currentWordIndex, words.length]])

    return (
        <Heading1
            className={`italic !text-highlight !font-normal transition-opacity duration-500 ease-in-out ${
                fade ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {words[currentWordIndex]}
        </Heading1>
    )
}
