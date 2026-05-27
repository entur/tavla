import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import BeaverIllustration from 'assets/illustrations/Beaver.png'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { logToGcp } from 'src/utils/logging'

async function Custom404() {
    const path = (await headers()).get('x-invoke-path') ?? 'unknown'
    logToGcp('warning', 'Page not found', { status: 404, path })

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

export default Custom404
