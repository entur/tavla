'use client'
import { Heading1 } from '@entur/typography'
import { Contrast } from 'Admin/components/Contrast'

function OrganizationTitle({ name }: { name?: string }) {
    return (
        <Contrast>
            <Heading1>{name ?? ''}</Heading1>
        </Contrast>
    )
}

export { OrganizationTitle }
