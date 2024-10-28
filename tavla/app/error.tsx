'use client'

import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { logger } from 'utils/logger'
import BeaverIllustration from 'assets/illustrations/Beaver.png'

const log = logger.child({ module: 'appErrorHandler' })
export default function Error({
    error,
}: {
    error: Error & { digest?: string }
}) {
    useEffect(() => {
        log.error({
            cause: error.cause,
            stacktrace: error.stack,
            message: error.message,
            digest: error.digest,
            url: window.location.href,
        })
    }, [error])

    return (
        <main className="container pb-10 flex flex-col items-center">
            <Heading3>Au da! Noe gikk galt!</Heading3>
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
