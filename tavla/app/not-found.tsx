import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import BeaverIllustration from 'assets/illustrations/Beaver.png'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { logToGcp } from 'utils/logging'

export const metadata: Metadata = {
    title: 'Siden finnes ikke | Entur Tavla - Sanntidsskjerm og avgangstavle for offentlig transport',
}

export default async function NotFound() {
    const path = (await headers()).get('x-pathname') ?? undefined

    await logToGcp('warning', 'page not found', {
        type: 'http',
        method: 'GET',
        status: 404,
        path,
    })

    return (
        <main
            id="main-content"
            className="container flex flex-col items-center pb-10"
        >
            <Heading3 as="h1">Denne siden finnes ikke!</Heading3>
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
