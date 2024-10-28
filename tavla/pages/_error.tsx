'use client'

import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import Image from 'next/image'
import Link from 'next/link'
import { logger } from 'utils/logger'
import BeaverIllustration from 'assets/illustrations/Beaver.png'
import { NextPageContext } from 'next'

const log = logger.child({ module: 'pagesErrorHandler' })
function Error() {
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

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    log.error({
        statusCode: statusCode,
        error: err,
        res: res,
    })
    return { statusCode }
}

export default Error
