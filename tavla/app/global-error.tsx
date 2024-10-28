'use client'

import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import BeaverIllustration from 'assets/illustrations/Beaver.png'

export default function Error({
    error,
}: {
    error: Error & { digest?: string }
}) {
    useEffect(() => {
        const logError = async () => {
            const errorDetails = {
                message: error.message,
                stack: error.stack,
                name: error.name,
                cause: error.cause,
                digest: error.digest,
            }

            await fetch('/api/log-error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: errorDetails }),
            })
        }

        logError()
    }, [error])

    return (
        <html>
            <body>
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
            </body>
        </html>
    )
}
