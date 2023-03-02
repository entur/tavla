import React, { useCallback, useState } from 'react'
import { LoginCase } from 'scenarios/Modals/LoginModal/login-modal-types'
import { LoginModal } from 'scenarios/Modals/LoginModal'
import { Navbar } from 'scenarios/Navbar'
import sikkerhetBomLight from 'assets/images/sikkerhet_bom_light@2x.png'
import { ErrorWrapper } from './components/ErrorWrapper'

function NoAccessToTavler(): JSX.Element {
    const [displayLogin, setDisplayLogin] = useState<boolean>(false)
    const callback = useCallback(
        (event: React.SyntheticEvent<HTMLButtonElement>): void => {
            event.preventDefault()
            setDisplayLogin(true)
        },
        [],
    )
    const loginModal = (
        <LoginModal
            open={displayLogin}
            onDismiss={(): void => setDisplayLogin(false)}
            loginCase={LoginCase.error}
        />
    )

    return (
        <div>
            {loginModal}
            <Navbar />
            <ErrorWrapper
                title="Dine tavler venter!"
                message="Du må logge inn for å se oversikten over tavlene dine. Trykk på knappen nedenfor for å logge inn."
                image={sikkerhetBomLight}
                altText="Illustrasjon av en bom som er lukket, slik at du ikke kan passere"
                callbackMessage="Logg inn"
                callback={callback}
            />
        </div>
    )
}
export { NoAccessToTavler }
