'use client'
import { Heading1 } from '@entur/typography'
import { useState, useEffect } from 'react'

function WordCarousel() {
    const words = ['resepsjonen', 'biblioteket', 'skolen', 'treningssenteret']
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
            margin="none"
            className={`transform !font-normal italic !text-highlight transition-all duration-1000 ease-in-out ${
                fade ? '-translate-y-4 opacity-100' : '-translate-y-6 opacity-0'
            }`}
        >
            {words[currentWordIndex]}
        </Heading1>
    )
}

export { WordCarousel }
