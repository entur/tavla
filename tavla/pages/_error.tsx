'use client'

import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import Image from 'next/image'
import Link from 'next/link'
import { logger } from 'utils/logger'
import BeaverIllustration from 'assets/illustrations/Beaver.png'
import { NextPageContext } from 'next'

const log = logger.child({ module: 'pagesLevelErrorHandler' })
function Error() {
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
