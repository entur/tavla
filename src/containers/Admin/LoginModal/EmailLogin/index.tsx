import React, { useState, Dispatch, SetStateAction } from 'react'
import firebase from 'firebase'

import { TextField, InputGroup } from '@entur/form'
import { GridContainer, GridItem } from '@entur/grid'
import { EmailIcon, ClosedLockIcon, BackArrowIcon } from '@entur/icons'
import { PrimaryButton } from '@entur/button'
import { Heading3, Link } from '@entur/typography'

import { useFormFields } from '../../../../utils'
import { ModalType } from '..'

import sikkerhetBom from '../../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../../../assets/images/sikkerhet_bom@2x.png'

export interface UserLogin {
    email: string
    password: string
}

interface Props {
    setModalType: Dispatch<SetStateAction<ModalType>>
}

const EmailLogin = ({ setModalType }: Props): JSX.Element => {
    const [inputs, handleInputsChange] = useFormFields<UserLogin>({
        email: '',
        password: '',
    })

    const [emailError, setEmailError] = useState<string>()
    const [passwordError, setPasswordError] = useState<string>()

    const signIn = (email: string, password: string): void => {
        setEmailError(undefined)
        setPasswordError(undefined)

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(function (error) {
                if (error.code === 'auth/invalid-email') {
                    setEmailError('E-posten er ikke gyldig')
                } else if (error.code === 'auth/user-disabled') {
                    setEmailError('Brukeren er deaktivert.')
                } else if (error.code === 'auth/user-not-found') {
                    setEmailError('Vi finner ingen konto med denne e-posten.')
                } else if (error.code === 'auth/wrong-password') {
                    setPasswordError('Feil passord.')
                } else {
                    console.error(error)
                }
            })
    }

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault()
        signIn(inputs.email, inputs.password)
    }

    return (
        <>
            <BackArrowIcon
                size={30}
                onClick={(): void => setModalType('LoginOptionsModal')}
                className="go-to"
            />
            <div className="centered">
                <img src={sikkerhetBom} srcSet={`${retinaSikkerhetBom} 2x`} />
            </div>
            <Heading3 margin="none">Logg inn med e-post</Heading3>
            <form>
                <GridContainer spacing="medium">
                    <GridItem small={12}>
                        <InputGroup
                            label="E-post"
                            variant={emailError ? 'error' : undefined}
                            feedback={emailError}
                        >
                            <TextField
                                type="text"
                                value={inputs.email}
                                onChange={handleInputsChange}
                                id="email"
                                prepend={<EmailIcon inline />}
                                placeholder="F.eks. ola.nordmann@entur.no"
                            />
                        </InputGroup>
                    </GridItem>
                    <GridItem small={12}>
                        <InputGroup
                            label="Passord"
                            variant={passwordError ? 'error' : undefined}
                            feedback={passwordError}
                        >
                            <TextField
                                type="password"
                                value={inputs.password}
                                onChange={handleInputsChange}
                                id="password"
                                prepend={<ClosedLockIcon inline />}
                                placeholder="Minst 8 tegn"
                            />
                        </InputGroup>
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
