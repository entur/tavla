import { Heading2, Paragraph } from '@entur/typography'
import { TOrganizationID } from 'types/settings'

function Footer({ oid, footer }: { oid?: TOrganizationID; footer?: string }) {
    return (
        <div className="flexColumn g-2">
            <Heading2>Informasjonstekst</Heading2>
            <div className="box">
                <Paragraph>
                    Velg hvilke kolonner som skal være standard når du oppretter
                    en ny tavle. {oid} {footer}
                </Paragraph>
            </div>
        </div>
    )
}

export { Footer }
