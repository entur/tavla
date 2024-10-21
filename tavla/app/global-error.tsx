'use client'

import { Heading3 } from '@entur/typography'
import Image from 'next/image'
import BeaverIllustration from 'assets/illustrations/Beaver.png'
import { Button } from '@entur/button'
import { useEffect } from 'react'
import { logger } from 'utils/logger'

const log = logger.child({ module: 'globalErrorHandler' })
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
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
        <html>
            <body>
                <main className="container pb-10 flex flex-col items-center">
                    <Heading3>Au da! Noe gikk galt!</Heading3>
                    <Image
                        src={BeaverIllustration}
                        className="w-1/2"
                        alt="Illustrasjon av en bever"
                    />

                    <Button
                        onClick={() => {
                            reset()
                        }}
                        variant="primary"
                    >
                        Prøv igjen
                    </Button>
                </main>
            </body>
        </html>
    )
}
