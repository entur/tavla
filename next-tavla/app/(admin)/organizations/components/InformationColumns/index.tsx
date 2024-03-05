import { Heading2, Paragraph } from '@entur/typography'
import React from 'react'
import FilterColumns from './FilterColumns'
import { TOrganizationID } from 'types/settings'
import { TColumn } from 'types/column'

function InformationColumns({
    oid,
    columns,
}: {
    oid?: TOrganizationID
    columns?: TColumn[]
}) {
    return (
        <div>
            <Heading2>Informasjonskolonner i tavlevisning</Heading2>
            <div className="box">
                <Paragraph>
                    Velg den informasjonen du ønsker skal stå som standard i
                    tavlevisningen når du tar opp en tavle
                </Paragraph>

                <FilterColumns oid={oid} columns={columns} />
            </div>
        </div>
    )
}

export { InformationColumns }
