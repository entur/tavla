import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import BeaverIllustration from 'assets/illustrations/Beaver.png'
import Image from 'next/image'
import Link from 'next/link'

function Custom404() {
    return (
        <main className="container flex flex-col items-center pb-10">
            <Heading3>Ups, denne siden finnes ikke!</Heading3>
            <Image
                src={BeaverIllustration}
                className="w-1/2 lg:w-1/4"
                alt="Illustrasjon av en bever"
            />

            <Button as={Link} href="/" variant="primary">
                Gå tilbake til forsiden
            </Button>
        </main>
    )
}

export default Custom404
