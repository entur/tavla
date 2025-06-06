'use client'
import { useState, useEffect } from 'react'
import receptionImage from 'assets/illustrations/Reception_illustration.svg'
import gymImage from 'assets/illustrations/Gym_illustration.svg'
import libraryImage from 'assets/illustrations/Library_illustration.svg'
import schoolImage from 'assets/illustrations/School_illustration.svg'
import Image from 'next/image'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'

type TImage = {
    src: StaticImport | string
    alt: string
}
function ImageCarousel() {
    const images: TImage[] = [
        {
            src: receptionImage,
            alt: 'En mor og hennes sønn står i en resepsjon, hvor det er en avgangstavle på veggen som viser viktig informasjon',
        },
        {
            src: schoolImage,
            alt: 'En jente henter bøker fra skapet sitt på skolen og ser på en avgangstavle på veggen.',
        },
        {
            src: libraryImage,
            alt: 'En mann ser på bøker på et bibliotek. Det er en avgangstavle på veggen',
        },
        {
            src: gymImage,
            alt: 'En kvinne løper på en tredemølle. En avgangstavle på veggen viser avganger.',
        },
    ]
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [fade, setFade] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false)

            setTimeout(() => {
                setCurrentImageIndex((currentImageIndex + 1) % images.length)
                setFade(true)
            }, 1000)
        }, 4000)

        return () => clearInterval(interval)
    }, [currentImageIndex, images.length])

    return (
        <div
            className={`flex transform flex-row self-center overflow-hidden transition-all duration-1000 ease-in-out md:scale-90 ${
                fade ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <Image
                src={images[currentImageIndex]!.src}
                alt={images[currentImageIndex]!.alt}
            />
        </div>
    )
}

export { ImageCarousel }
