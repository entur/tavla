import React from 'react'

import Heading from './Heading'
import MobilityOptions from './MobilityTiles'

import './styles.scss'

const Content = (): JSX.Element | null => (
    <div className="content-wrapper">
        <Heading />
        <MobilityOptions />
    </div>
)

export default Content
