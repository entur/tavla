import React from 'react'
import { Heading3 } from '@entur/typography'

import './styles.scss'

export function TileRow({ label, icon, subLabels }: Props): JSX.Element {
    return (
        <div className="tilerow">
            <div className="tilerow__icon">
                { icon }
            </div>
            <div className="tilerow__texts">
                <Heading3 className="tilerow__label">{ label }</Heading3>
                <div className="tilerow__sublabels">
                    {
                        subLabels.map((subLabel, index) => (
                            <span className="tilerow__sublabel" key={index}>
                                { subLabel }
                            </span>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

interface Props {
    label: string,
    subLabels: Array<string>,
    icon: JSX.Element,
}

export default TileRow
