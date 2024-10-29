'use client'

import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import BeaverIllustration from 'assets/illustrations/Beaver.png'
import { logServerError } from './(admin)/utils/serverErrorLogger'

export default function Error({
    error,
}: {
    error: Error & { digest?: string }
}) {
    useEffect(() => {
        const errorDetails = {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause,
            digest: error.digest,
        }

        logServerError(errorDetails)
    }, [error])

    return (
        <main className="container pb-10 flex flex-col items-center">
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
