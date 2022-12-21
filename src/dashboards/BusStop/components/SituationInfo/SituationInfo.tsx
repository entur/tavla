import React from 'react'
import { ValidationExclamation } from '../../../../assets/icons/ValidationExclamation'
import { ValidationError } from '../../../../assets/icons/ValidationError'
import { Departure } from '../../../../logic/use-stop-place-with-estimated-calls/departure'
import './SituationInfo.scss'

interface SituationInfoProps {
    departure: Departure
}

const SituationInfo = ({ departure }: SituationInfoProps) => {
    const situation =
        departure.situations[0]?.summary[0]?.value ||
        departure.situations[0]?.description[0]?.value

    if (!situation) return null

    return (
        <>
            <span className="bus-stop-situation-icon">
                {departure.cancellation ? (
                    <ValidationError />
                ) : (
                    <ValidationExclamation />
                )}
            </span>
            {situation}
        </>
    )
}

export { SituationInfo }
