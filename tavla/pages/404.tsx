import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import Link from 'next/link'
import Image from 'next/image'
import BeaverIllustration from 'assets/illustrations/Beaver.png'

function Custom404() {
    return (
        <div className="mx-auto flex h-[70vh] flex-col items-center justify-center gap-5 lg:w-1/4">
            <Heading3>Denne siden finnes ikke!</Heading3>
            <Image
                src={BeaverIllustration}
                className="w-1/2 lg:w-1/4"
                alt="Illustrasjon av en bever"
            />

            <Button as={Link} href="/" variant="primary">
                Tilbake til forsiden
            </Button>
        </div>
    )
}

export default Custom404
