'use client'

import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import Image from 'next/image'
import Link from 'next/link'
import BeaverIllustration from 'assets/illustrations/Beaver.png'
import * as Sentry from '@sentry/nextjs'
import type { NextPageContext } from 'next'
import Error from 'next/error'

Error.getInitialProps = async (contextData: NextPageContext) => {
    await Sentry.captureUnderscoreErrorException(contextData)
    return Error.getInitialProps(contextData)
}

function CustomError() {
    return (
        <main className="container flex flex-col items-center pb-10">
            <Heading3>Au da! Noe gikk galt!</Heading3>
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

export default CustomError
