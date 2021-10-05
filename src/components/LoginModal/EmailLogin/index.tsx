import React, { useState, Dispatch, SetStateAction } from 'react'

import type { User } from 'firebase/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { TextField } from '@entur/form'
import { GridContainer, GridItem } from '@entur/grid'
import { EmailIcon, ClosedLockIcon, BackArrowIcon } from '@entur/icons'
import { PrimaryButton } from '@entur/button'
import { Heading3, Link } from '@entur/typography'
import { SmallExpandableAlertBox } from '@entur/alert'

import { auth } from '../../../auth'
import { useFormFields } from '../../../utils'
import sikkerhetBom from '../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../../assets/images/sikkerhet_bom@2x.png'

import { ModalType } from '..'
import CloseButton from '../CloseButton/CloseButton'

export interface UserLogin {
    email: string
    password: string
}

interface Props {
    setModalType: Dispatch<SetStateAction<ModalType>>
    onDismiss: (user?: User) => void
}

const EmailLogin = ({ setModalType, onDismiss }: Props): JSX.Element => {
    const [inputs, handleInputsChange] = useFormFields<UserLogin>({
        email: '',
        password: '',
    })

    const [emailError, setEmailError] = useState<string>()
    const [passwordError, setPasswordError] = useState<string>()
    const [userDeactivatedError, setUserDeactivatedError] = useState<string>()

    const signIn = (email: string, password: string): void => {
        setEmailError(undefined)
        setPasswordError(undefined)
        setUserDeactivatedError(undefined)

        signInWithEmailAndPassword(auth, email, password).catch((error) => {
            if (error.code === 'auth/invalid-email') {
                setEmailError('E-posten er ikke gyldig')
            } else if (error.code === 'auth/user-disabled') {
                setUserDeactivatedError('Brukerkontoen er deaktivert.')
            } else if (error.code === 'auth/too-many-requests') {
                setUserDeactivatedError(
                    'Tilgang til denne brukerkontoen har blitt ' +
                        'midlertidig deaktivert på grunn av mange ' +
                        'mislykkede påloggingsforsøk. Du kan få ' +
                        'tilgang igjen ved å tilbakestille passordet ' +
                        'ditt, (følg «Jeg har glemt passord») ' +
                        'eller du kan prøve igjen senere.',
                )
            } else if (
                error.code === 'auth/user-not-found' ||
                error.code === 'auth/wrong-password'
            ) {
                setEmailError('Feil brukernavn eller passord.')
                setPasswordError('Feil brukernavn eller passord.')
            } else {
                // eslint-disable-next-line no-console
                console.error(error)
            }
        })
    }

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault()
        signIn(inputs.email, inputs.password)
    }

    const handleClose = (): void => {
        setModalType('LoginOptionsModal')
        onDismiss()
    }

    return (
        <>
            <div className="modal-header">
                <BackArrowIcon
                    size={30}
                    onClick={(): void => setModalType('LoginOptionsModal')}
                    className="go-to"
                />
                <CloseButton onClick={handleClose} />
            </div>
            <div className="centered">
                <img src={sikkerhetBom} srcSet={`${retinaSikkerhetBom} 2x`} />
            </div>
            <Heading3 margin="none">Logg inn med e-post</Heading3>
            <form>
                <GridContainer spacing="medium">
                    {userDeactivatedError && (
                        <GridItem small={12}>
                            <SmallExpandableAlertBox
                                title="Konto deaktivert"
                                variant="error"
                            >
                                {userDeactivatedError}
                            </SmallExpandableAlertBox>
                        </GridItem>
                    )}
                    <GridItem small={12}>
                        <TextField
                            label="E-post"
                            variant={emailError ? 'error' : undefined}
                            feedback={emailError}
                            type="text"
                            value={inputs.email}
                            onChange={handleInputsChange}
                            id="email"
                            prepend={<EmailIcon inline />}
                            placeholder="F.eks. ola.nordmann@entur.no"
                        />
                    </GridItem>
                    <GridItem small={12}>
                        <TextField
                            label="Passord"
                            variant={passwordError ? 'error' : undefined}
                            feedback={passwordError}
                            type="password"
                            value={inputs.password}
                            onChange={handleInputsChange}
                            id="password"
                            prepend={<ClosedLockIcon inline />}
                            placeholder="Minst 8 tegn"
                        />
                    </GridItem>
                    <GridItem small={12}>
                        <PrimaryButton
                            width="fluid"
                            type="submit"
                            onClick={handleSubmit}
                            className="modal-submit"
                        >
                            Logg inn
                        </PrimaryButton>
                    </GridItem>
                </GridContainer>
            </form>
            <div className="centered">
                <Link onClick={(): void => setModalType('ResetPasswordModal')}>
                    Jeg har glemt passord
                </Link>
            </div>
        </>
    )
}

export default EmailLogin
