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
            url: window.location.href,
        })
    }, [error])
    return (
        <html>
            <body>
                <div className="mx-auto h-[70vh] lg:w-1/4 flex flex-col justify-center items-center gap-5">
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
                </div>
            </body>
        </html>
    )
}
