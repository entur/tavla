'use client'

import { Button } from '@entur/button'
import { Heading2 } from '@entur/typography'
import Link from 'next/link'
import { useEffect } from 'react'
import { logger } from 'utils/logger'

const log = logger.child({ module: 'appLevelErrorPage' })
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
        <div className="mx-auto h-[50vh]">
            <Heading2>Auda, noe gikk galt!</Heading2>
            <Button as={Link} href="/" variant="primary">
                Tilbake til forsiden
            </Button>
        </div>
    )
}
