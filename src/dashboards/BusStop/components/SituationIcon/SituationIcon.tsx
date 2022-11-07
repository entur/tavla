import React from 'react'
import { ValidationExclamation } from '../../../../assets/icons/ValidationExclamation'
import { ValidationError } from '../../../../assets/icons/ValidationError'
import './SituationIcon.scss'

interface SituationIconProps {
    hasCancellation?: boolean
}

const SituationIcon = ({ hasCancellation }: SituationIconProps) => (
    <span className="bus-stop-situation-icon">
        {hasCancellation ? <ValidationError /> : <ValidationExclamation />}
    </span>
)

export { SituationIcon }
