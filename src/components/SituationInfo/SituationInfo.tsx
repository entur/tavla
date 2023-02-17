import React from 'react'
import { ValidationExclamation } from 'assets/icons/ValidationExclamation'
import { ValidationError } from 'assets/icons/ValidationError'
import { Departure } from 'logic/use-stop-place-with-estimated-calls/departure'
import classes from './SituationInfo.module.scss'

interface SituationInfoProps {
    departure: Departure
    shortVersion?: boolean
}
function getVersionOfSituation(situation: string) {
    if (situation.length > 40) {
        return situation.substring(0, 40) + '...'
    }
    return situation
}
const SituationInfo = ({ departure, shortVersion }: SituationInfoProps) => {
    const situation =
        departure.situations[0]?.summary[0]?.value ||
        departure.situations[0]?.description[0]?.value

    if (!situation) return null

    return (
        <>
            <span className={classes.BusStopSituationIcon}>
                {departure.cancellation ? (
                    <ValidationError />
                ) : (
                    <ValidationExclamation />
                )}
            </span>
            {shortVersion ? getVersionOfSituation(situation) : situation}
        </>
    )
}

export { SituationInfo }
