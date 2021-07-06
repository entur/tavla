// eslint-disable-next-line import/no-unresolved
import React from 'react'

import ValidationExclamation from '../../assets/icons/ValidationExclamation'
import './styles.scss'

function ExclamationIcon(props: any): JSX.Element | null {
    const alertMessage = props.data?.situation

    return (
        <div
            onClick={() => {
                if (alertMessage) {
                    alert(alertMessage)
                }
            }}
        >
            <ValidationExclamation />
        </div>
    )
}

export default ExclamationIcon
