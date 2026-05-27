'use client'

import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import BeaverIllustration from 'assets/illustrations/Beaver.png'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { logToGcp } from 'utils/logging'

export default function NotFound() {
    const pathname = usePathname()

    useEffect(() => {
        logToGcp('warning', `Not Found`, { status: 404, path: pathname })
    }, [pathname])

    return (
        <main className="container flex flex-col items-center pb-10">
            <Heading3>Denne siden finnes ikke!</Heading3>
            <Image
                src={BeaverIllustration}
                className="w-1/2 lg:w-1/4"
                alt="Illustrasjon av en bever"
            />

            <Button as={Link} href="/" variant="primary">
                Tilbake til forsiden
            </Button>
        </main>
    )
}
