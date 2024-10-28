import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import Link from 'next/link'
import Image from 'next/image'
import BeaverIllustration from 'assets/illustrations/Beaver.png'

function Custom404() {
    return (
        <main className="container pb-10 flex flex-col items-center">
            <Heading3>Denne siden finnes ikke!</Heading3>
            <Image
                src={BeaverIllustration}
                className="w-1/2"
                alt="Illustrasjon av en bever"
            />

            <Button as={Link} href="/" variant="primary">
                Tilbake til forsiden
            </Button>
        </main>
    )
}

export default Custom404
