import React from 'react'

import { Contrast } from '@entur/layout'

import PulsatingDot from '../../components/PulsatingDot'

import './styles.scss'

const Heading = (): JSX.Element | null => (
    <Contrast className="heading-wrapper">
        <h1 className="JCD-heading">I nærheten</h1>
        <div className="lead-paragraph">
            <div>
                <PulsatingDot />
            </div>
            {/* TODO: Bytt ut 13:59 med faktisk tidspunkt */}
            <h3 className="JCD-last-updated">Sist oppdatert 13:59</h3>
        </div>
    </Contrast>
)

export default Heading
