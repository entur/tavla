import React, { useState, useEffect } from 'react'
import { Heading2 } from '@entur/typography'

const VisningTab = ({ tabIndex, setTabIndex }: Props): JSX.Element => {
    return (
        <div>
            <Heading2>Velg visning</Heading2>
            <div></div>
        </div>
    )
}

interface Props {
    tabIndex: number
    setTabIndex: () => void
}

export default VisningTab
