'use client'

import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import * as Sentry from '@sentry/nextjs'
import BeaverIllustration from 'assets/illustrations/Beaver.png'
import Image from 'next/image'
import Link from 'next/link'
import {
    unstable_isUnrecognizedActionError,
    usePathname,
} from 'next/navigation'
import { useEffect } from 'react'
import { logToGcp } from 'src/utils/logging'

export default function ErrorPage({
    error,
}: {
    error: Error & { digest?: string }
}) {
    const path = usePathname()
    const isStaleAction = unstable_isUnrecognizedActionError(error)

    useEffect(() => {
        async function handleError() {
            const { name: errorName, message: errorMessage } = error

            if (isStaleAction) {
                window.location.reload()
                return
            }

            Sentry.captureException(error)
            await logToGcp('error', 'internal server error', {
                type: 'http',
                method: 'GET',
                status: 500,
                path: path ?? undefined,
                errorName,
                errorMessage,
            }).catch(() => {})
        }

        handleError()
    }, [error, path, isStaleAction])

    return (
        <main
            id="main-content"
            className="container flex flex-col items-center pb-10"
        >
            <Heading3 as="h1">Au da! Noe gikk galt!</Heading3>
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
