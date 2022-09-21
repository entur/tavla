import React from 'react'

import { Heading1, LeadParagraph } from '@entur/typography'
import { LimeIcon } from '@entur/icons'
import { Contrast } from '@entur/layout'

import './styles.scss'

const Heading = (): JSX.Element | null => (
    <Contrast style={{ border: '5px solid orange', color: 'white' }}>
        <Heading1>I nærheten</Heading1>
        <LeadParagraph className="leadParagraph">
            <LimeIcon />
            <div>Sist oppdatert -klokkeslett-</div>
        </LeadParagraph>
    </Contrast>
)

export default Heading
