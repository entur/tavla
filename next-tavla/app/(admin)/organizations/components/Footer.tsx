'use client'
import { useToast } from '@entur/alert'
import { TextField } from '@entur/form'
import { Heading2, Paragraph } from '@entur/typography'
import { TOrganizationID } from 'types/settings'

function Footer({ oid, footer }: { oid?: TOrganizationID; footer?: string }) {
    const { addToast } = useToast()
    return (
        <div className="flexColumn g-2">
            <Heading2>Footer</Heading2>
            <div className="box">
                <Paragraph>Denne teksten vil vises i footeren.</Paragraph>
                <TextField label="Footer" />
            </div>
        </div>
    )
}

export { Footer }
