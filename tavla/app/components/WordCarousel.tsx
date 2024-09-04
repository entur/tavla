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

            setTimeout(() => {
                setCurrentWordIndex((currentWordIndex + 1) % words.length)
                setFade(true)
            }, 1000)
        }, 4000)

        return () => clearInterval(interval)
    }, [currentWordIndex, words.length])

    return (
        <Heading1
            className={`italic !text-highlight !font-normal transform transition-all duration-1000 ease-in-out ${
                fade ? 'opacity-100 translate-y-4' : 'opacity-0 translate-y-0'
            }`}
        >
            {words[currentWordIndex]}
        </Heading1>
    )
}
