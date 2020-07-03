import React, { useState, Dispatch, SetStateAction } from 'react'
import firebase from 'firebase'

import { TextField, InputGroup } from '@entur/form'
import { GridContainer, GridItem } from '@entur/grid'
import { EmailIcon, ClosedLockIcon, BackArrowIcon } from '@entur/icons'
import { PrimaryButton } from '@entur/button'
import { Heading2, Link } from '@entur/typography'

import { useFormFields } from '../../../../utils'
import { ModalType } from '../.'

import './styles.scss'

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
            .catch(function(error) {
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
        console.log(inputs)
        signIn(inputs.email, inputs.password)
    }

    return (
        <>
            <BackArrowIcon
                size={30}
                onClick={() => setModalType('LoginOptionsModal')}
                className="go-to"
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                    src={sikkerhetBom}
                    srcSet={`${retinaSikkerhetBom} 2x`}
                    style={{ width: '45%', margin: '0 auto' }}
                />
            </div>
            <Heading2 style={{ textAlign: 'center' }} margin="none">
                Logg inn med e-post
            </Heading2>
            <form>
                <GridContainer spacing="small" style={{ padding: '10%' }}>
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
                                placeholder="eksempel@entur.no"
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
                            />
                        </InputGroup>
                    </GridItem>
                    <GridItem small={12}>
                        <PrimaryButton
                            width="fluid"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Logg inn
                        </PrimaryButton>
                    </GridItem>
                </GridContainer>
            </form>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link onClick={() => setModalType('ResetPasswordModal')}>
                    Jeg har glemt passord
                </Link>
            </div>
        </>
    )
}

export default EmailLogin
