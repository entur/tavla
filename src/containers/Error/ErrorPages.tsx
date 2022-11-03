import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useToast } from '@entur/alert'
import { LoginModal } from '../../components/LoginModal/LoginModal'
import { LoginCase } from '../../components/LoginModal/login-modal-types'
import { auth, useUser } from '../../UserProvider'
import sikkerhetBomLight from '../../assets/images/sikkerhet_bom_light@2x.png'
import duerLight from '../../assets/images/duer@2x.png'
import sauerLight from '../../assets/images/sauer_lag@2x.png'
import { Navbar } from '../Navbar/Navbar'
import { ErrorWrapper } from './ErrorWrapper'

function LockedTavle(): JSX.Element {
    const user = useUser()
    const userLoggedin = Boolean(user && !user.isAnonymous)
    const navigate = useNavigate()
    const { documentId } = useParams<{ documentId: string }>()
    const { addToast } = useToast()

    const [displayLogin, setDisplayLogin] = useState<boolean>(false)
    const callback = !userLoggedin
        ? (event: React.SyntheticEvent<HTMLButtonElement>): void => {
              event.preventDefault()
              setDisplayLogin(true)
          }
        : (event: React.SyntheticEvent<HTMLButtonElement>): void => {
              event.preventDefault()
              addToast({
                  title: 'Logget ut',
                  content: 'Du er nå logget ut av din konto.',
                  variant: 'success',
              })

              signOut(auth).then(() => navigate(`/t/${documentId}`))
          }
    const callbackMessage = !userLoggedin ? 'Logg inn' : 'Logg ut'

    const loginModal = !userLoggedin ? (
        <LoginModal
            open={displayLogin}
            onDismiss={(): void => setDisplayLogin(false)}
            loginCase={LoginCase.error}
        />
    ) : null

    const errorMessage = !userLoggedin
        ? 'Tavla du forsøker å redigere er låst til en konto. Om det er din tavle, må du først logge inn for å redigere den.'
        : 'Tavla du forsøker å redigere er låst til en annen konto. Om det er din tavle, må du logge inn på denne kontoen for å redigere den.'

    return (
        <div>
            {loginModal}
            <ErrorWrapper
                title="Oi! Denne tavla er låst."
                message={errorMessage}
                image={sikkerhetBomLight}
                callbackMessage={callbackMessage}
                callback={callback}
            />
        </div>
    )
}

function PageDoesNotExist(): JSX.Element {
    const navigate = useNavigate()
    const callback = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
        event.preventDefault()
        navigate(`/`)
    }
    return (
        <>
            <Navbar />
            <div>
                <ErrorWrapper
                    title="Her var det tomt!"
                    message="Det finnes ingen tavle på denne url-en. Du kan lage en avgangstavle ved å trykke på knappen nedenfor."
                    image={duerLight}
                    callbackMessage="Gå tilbake"
                    callback={callback}
                />
            </div>
        </>
    )
}

function NoStopsOnTavle(): JSX.Element {
    return (
        <div>
            <ErrorWrapper
                title="Nå havnet vi på ville veier."
                message="Vi finner ingen stoppesteder å vise på denne tavla. Rediger tavla eller prøv et nytt søk."
                image={sauerLight}
            />
        </div>
    )
}

function NoTavlerAvailable(): JSX.Element {
    const navigate = useNavigate()
    const callback = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
        event.preventDefault()
        navigate(`/`)
    }
    return (
        <div>
            <ErrorWrapper
                title="Her var det tomt!"
                message="Du har ingen tavler som er lagret på denne kontoen. Trykk på knappen nedenfor for å lage en avgangstavle."
                image={duerLight}
                callbackMessage="Lag en ny tavle"
                callback={callback}
            />
        </div>
    )
}

function NoSharedTavlerAvailable(): JSX.Element {
    return (
        <div>
            <ErrorWrapper
                title="Her var det tomt!"
                message="Du har ingen tavleforespørsler for øyeblikket. Andre kan dele sine tavler med deg under «Deling»-fanen på innstillingene til tavla."
                image={duerLight}
            />
        </div>
    )
}

function NoAccessToTavler(): JSX.Element {
    const [displayLogin, setDisplayLogin] = useState<boolean>(false)
    const callback = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
        event.preventDefault()
        setDisplayLogin(true)
    }
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
            <ErrorWrapper
                title="Dine tavler venter!"
                message="Du må logge inn for å se oversikten over tavlene dine. Trykk på knappen nedenfor for å logge inn."
                image={sikkerhetBomLight}
                callbackMessage="Logg inn"
                callback={callback}
            />
        </div>
    )
}

export {
    LockedTavle,
    PageDoesNotExist,
    NoTavlerAvailable,
    NoStopsOnTavle,
    NoSharedTavlerAvailable,
    NoAccessToTavler,
}
