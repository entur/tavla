'use client'
import { Contrast } from '@entur/layout'
import { Heading1 } from '@entur/typography'

function OrganizationTitle({ name }: { name?: string }) {
    return (
        <Contrast>
            <Heading1>{name ?? ''}</Heading1>
        </Contrast>
    )
}

export { OrganizationTitle }
