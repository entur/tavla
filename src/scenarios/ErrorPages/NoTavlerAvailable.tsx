import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import duerLight from 'assets/images/duer@2x.png'
import { ErrorWrapper } from './components/ErrorWrapper'

function NoTavlerAvailable(): JSX.Element {
    const navigate = useNavigate()
    const callback = useCallback(
        (event: React.SyntheticEvent<HTMLButtonElement>): void => {
            event.preventDefault()
            navigate(`/`)
        },
        [navigate],
    )
    return (
        <div>
            <ErrorWrapper
                title="Her var det tomt!"
                message="Du har ingen tavler som er lagret på denne kontoen. Trykk på knappen nedenfor for å lage en avgangstavle."
                image={duerLight}
                callbackMessage="Lag en ny tavle"
                callback={callback}
                altText=""
            />
        </div>
    )
}

export { NoTavlerAvailable }
