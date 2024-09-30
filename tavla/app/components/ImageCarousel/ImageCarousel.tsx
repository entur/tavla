'use client'
import { useState, useEffect } from 'react'
import receptionImage from 'assets/illustrations/Reception_illustration.svg'
import gymImage from 'assets/illustrations/Gym_illustration.svg'
import libraryImage from 'assets/illustrations/Library_illustration.svg'
import schoolImage from 'assets/illustrations/School_illustration.svg'
import Image from 'next/image'

function ImageCarousel() {
    const images = [receptionImage, schoolImage, libraryImage, gymImage]
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
            className={`flex flex-row self-center md:scale-90 overflow-hidden transform transition-all duration-1000 ease-in-out ${
                fade ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <Image
                src={images[currentImageIndex]}
                alt="Et bilde av en avgangstavle"
            />
        </div>
    )
}

export { ImageCarousel }
