'use client'

import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { logger } from 'utils/logger'
import BeaverIllustration from 'assets/illustrations/Beaver.png'

const log = logger.child({ module: 'pagesLevelErrorHandler' })
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
            url: window.location.href,
        })
    }, [error])

    return (
        <div className="mx-auto h-[70vh] lg:w-1/4 flex flex-col justify-center items-center gap-5">
            <Heading3>Au da! Noe gikk galt!</Heading3>
            <Image
                src={BeaverIllustration}
                className="w-1/2"
                alt="Illustrasjon av en bever"
            />

            <Button as={Link} href="/" variant="primary">
                Tilbake til forsiden
            </Button>
        </div>
    )
}
