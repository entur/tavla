import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import BeaverIllustration from 'assets/illustrations/Beaver.png'
import Image from 'next/image'
import Link from 'next/link'

function Custom404() {
    return (
        <main className="container flex flex-col items-center pb-10">
            <Heading3>
                Ai ai ai, denne tavla finnes ikke! Prøv å laste inn siden på
                nytt eller gå tilbake til forsiden.
            </Heading3>
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
