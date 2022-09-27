import React from 'react'

import Heading from './Heading'
import MobilityOptions from './MobilityTiles'

import './styles.scss'

const Content = ({ numberOfBikes }: Props): JSX.Element | null => (
    <div className="content-wrapper">
        <Heading />
        <MobilityOptions numberOfBikes={numberOfBikes} />
    </div>
)

type Props = {
    numberOfBikes: number
}

export default Content
