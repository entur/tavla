import React from 'react'

import ValidationExclamation from '../../assets/icons/ValidationExclamation'

interface Props {
    alertMessage: string
}
function ExclamationIcon(props: Props): JSX.Element {
    const { alertMessage } = props

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
