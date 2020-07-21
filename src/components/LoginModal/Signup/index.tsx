import React, { useState, Dispatch, SetStateAction } from 'react'
import firebase from 'firebase'

import { TextField, InputGroup } from '@entur/form'
import { GridContainer, GridItem } from '@entur/grid'
import { EmailIcon, ClosedLockIcon, BackArrowIcon } from '@entur/icons'
import { PrimaryButton } from '@entur/button'
import { Heading2, Link } from '@entur/typography'

import { useFormFields } from '../../../utils'
import { ModalType } from '../index'

import sikkerhetBom from './../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from './../../../assets/images/sikkerhet_bom@2x.png'

// eslint-disable-next-line
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

interface Props {
    setModalType: Dispatch<SetStateAction<ModalType>>
}

interface UserSignUp {
    email: string
    password: string
    repeatPassword: string
}

const Signup = ({ setModalType }: Props): JSX.Element => {
    const [inputs, handleInputsChange] = useFormFields<UserSignUp>({
        email: '',
        password: '',
        repeatPassword: '',
    })

    const [isPasswordMatch, setIsPasswordMatch] = useState(true)
    const [isPasswordLongEnough, setIsPasswordLongEnough] = useState(true)
    const [emailError, setEmailError] = useState<string>()

    const handleSubmit = (): void => {
        const { email, password } = inputs

        if (inputs.password.length >= 8) {
            setIsPasswordLongEnough(true)
        } else {
            setIsPasswordLongEnough(false)
        }

        if (email.match(EMAIL_REGEX)) {
            setEmailError(undefined)
        } else {
            setEmailError('Dette er ikke en gyldig e-post.')
        }

        if (inputs.password !== inputs.repeatPassword) {
            setIsPasswordMatch(false)
        } else {
            setIsPasswordMatch(true)
        }

        if (!isPasswordLongEnough || !isPasswordMatch) {
            return
        }

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(function (error) {
                if (error.code === 'auth/email-already-in-use') {
                    setEmailError('Denne e-posten er allerede registrert.')
                } else if (error.code === 'auth/invalid-email') {
                    setEmailError('Dette er ikke en gyldig e-post.')
                } else {
                    setEmailError(undefined)
                }
            })

        setIsPasswordMatch(true)
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
            <Heading2 margin="none">Lag en ny konto</Heading2>

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
                        variant={isPasswordLongEnough ? undefined : 'error'}
                        feedback={
                            !isPasswordLongEnough &&
                            'Passord må ha minst 8 tegn.'
                        }
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
                        className="modal-submit"
                    >
                        Lag konto
                    </PrimaryButton>
                </GridItem>
            </GridContainer>

            <div className="centered">
                <Link onClick={(): void => setModalType('LoginEmailModal')}>
                    Jeg har allerede en konto
                </Link>
            </div>
        </>
    )
}

export default Signup
