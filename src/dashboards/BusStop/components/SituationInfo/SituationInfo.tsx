import React from 'react'
import { ValidationExclamation } from '../../../../assets/icons/ValidationExclamation'
import { ValidationError } from '../../../../assets/icons/ValidationError'
import { LineData } from '../../../../types'
import './SituationInfo.scss'

interface SituationInfoProps {
    departure: LineData
}

const SituationInfo = ({ departure }: SituationInfoProps) => {
    if (!departure.situation) return null

    return (
        <>
            <span className="bus-stop-situation-icon">
                {departure.hasCancellation ? (
                    <ValidationError />
                ) : (
                    <ValidationExclamation />
                )}
            </span>
            {departure.situation}
        </>
    )
}

export { SituationInfo }
