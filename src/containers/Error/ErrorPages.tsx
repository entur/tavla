import React, { useState } from 'react'

import ErrorWrapper from '.'
import LoginModal from '../Admin/LoginModal'

import sikkerhetBomLight from './../../assets/images/sikkerhet_bom_light.png'

export function LockedTavle({ history }: Props): JSX.Element {
    const [displayLogin, setDisplayLogin] = useState<boolean>(false)
    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault()
        setDisplayLogin(true)
    }

    const loginModal = (
        <LoginModal
            open={displayLogin}
            onDismiss={(): void => setDisplayLogin(false)}
        />
    )

    return (
        <div>
            {loginModal}
            <ErrorWrapper
                title="Oi! Denne tavla er låst."
                message="Tavla du forsøker å redigere er låst til en konto. Om det er din tavle, må du først logge inn for å redigere den."
                image={sikkerhetBomLight}
                callbackMessage="Logg inn"
                callback={handleSubmit}
                history={history}
            />
        </div>
    )
}

interface Props {
    history: any
}
