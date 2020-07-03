import React, { useState, Dispatch, SetStateAction } from 'react'
import firebase from 'firebase'

import { TextField, InputGroup } from '@entur/form'
import { GridContainer, GridItem } from '@entur/grid'
import { EmailIcon, ClosedLockIcon, BackArrowIcon } from '@entur/icons'
import { PrimaryButton } from '@entur/button'
import { Heading2, Link } from '@entur/typography'

import { useFormFields } from '../../../../utils'
import { ModalType } from '../index'

import sikkerhetBom from '../../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../../../assets/images/sikkerhet_bom@2x.png'

interface Props {
    setModalType: Dispatch<SetStateAction<ModalType>>
}

interface UserSignUp {
    email: string
    password: string
    repeatPassword: string
}

const Signup = ({ setModalType }: Props) => {
    const [inputs, handleInputsChange] = useFormFields<UserSignUp>({
        email: '',
        password: '',
        repeatPassword: '',
    })

    const [isPasswordMatch, setIsPasswordMatch] = useState(true)
    const [isSufficientPassword, setIsSufficientPassword] = useState(true)
    const [emailError, setEmailError] = useState<string>()

    const handleSubmit = () => {
        const { email, password } = inputs

        if (inputs.password !== inputs.repeatPassword) {
            setIsPasswordMatch(false)
            return
        }

        setIsPasswordMatch(true)
        setEmailError(undefined)

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(function(error) {
                if (error.code === 'auth/email-already-in-use') {
                    setEmailError('Denne e-posten er allerede registrert.')
                } else if (error.code === 'auth/invalid-email') {
                    setEmailError('Dette er ikke en gyldig e-post.')
                } else {
                    console.error(error)
                }
            })
    }

    return (
        <>
            <BackArrowIcon
                size={30}
                onClick={() => setModalType('LoginOptionsModal')}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                    src={sikkerhetBom}
                    srcSet={`${retinaSikkerhetBom} 2x`}
                    style={{ width: '45%', margin: '0 auto' }}
                />
            </div>
            <Heading2 style={{ textAlign: 'center' }} margin="none">
                Lag en ny konto
            </Heading2>

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
                        variant={isSufficientPassword ? undefined : 'info'}
                        feedback={
                            !isSufficientPassword &&
                            'Passordet må være minst 8 tegn.'
                        }
                        onFocus={() => setIsSufficientPassword(false)}
                        onBlur={() => setIsSufficientPassword(true)}
                    >
                        <TextField
                            type="password"
                            value={inputs.password}
                            onChange={handleInputsChange}
                            id="password"
                            prepend={<ClosedLockIcon inline />}
                            placeholder="Entur123"
                        />
                    </InputGroup>
                </GridItem>

                <GridItem small={12}>
                    <InputGroup
                        label="Gjenta passord"
                        feedback={
                            !isPasswordMatch && 'Passordene må være like.'
                        }
                        variant={isPasswordMatch ? undefined : 'error'}
                    >
                        <TextField
                            type="password"
                            value={inputs.repeatPassword}
                            onChange={handleInputsChange}
                            id="repeatPassword"
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
                        Lag konto
                    </PrimaryButton>
                </GridItem>
            </GridContainer>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link onClick={() => setModalType('LoginEmailModal')}>
                    Jeg har allerede en konto
                </Link>
            </div>
        </>
    )
}

export default Signup
