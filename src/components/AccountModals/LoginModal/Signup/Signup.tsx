import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
import type { User } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'settings/UserProvider'
import sikkerhetBom from 'assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from 'assets/images/sikkerhet_bom@2x.png'
import { useFormFields } from 'hooks/useFormFields'
import { TextField } from '@entur/form'
import { GridContainer, GridItem } from '@entur/grid'
import { BackArrowIcon, ClosedLockIcon, EmailIcon } from '@entur/icons'
import { PrimaryButton } from '@entur/button'
import { Heading2, Link } from '@entur/typography'
import { CloseButton } from '../../../CloseButton/CloseButton'
import { ModalType } from '../login-modal-types'
import classes from '../../AccountModals.module.scss'

const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

interface UserSignUp {
    email: string
    password: string
    repeatPassword: string
}

function Signup({
    setModalType,
    onDismiss,
}: {
    setModalType: Dispatch<SetStateAction<ModalType>>
    onDismiss: (user?: User) => void
}) {
    const [inputs, handleInputsChange] = useFormFields<UserSignUp>({
        email: '',
        password: '',
        repeatPassword: '',
    })

    const [isPasswordMatch, setIsPasswordMatch] = useState(true)
    const [isPasswordLongEnough, setIsPasswordLongEnough] = useState(true)
    const [emailError, setEmailError] = useState<string>()

    const handleSubmit = useCallback((): void => {
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

        const valid =
            inputs.password.length >= 8 &&
            email.match(EMAIL_REGEX) &&
            inputs.password === inputs.repeatPassword

        if (!valid) {
            return
        }

        createUserWithEmailAndPassword(auth, email, password).catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                setEmailError('Denne e-posten er allerede registrert.')
            } else if (error.code === 'auth/invalid-email') {
                setEmailError('Dette er ikke en gyldig e-post.')
            } else {
                setEmailError(undefined)
            }
        })
    }, [inputs])

    const handleClose = useCallback((): void => {
        setModalType(ModalType.LoginOptionsModal)
        onDismiss()
    }, [onDismiss, setModalType])

    return (
        <>
            <div className={classes.ModalHeader}>
                <BackArrowIcon
                    size={30}
                    onClick={(): void =>
                        setModalType(ModalType.LoginOptionsModal)
                    }
                    className={classes.BackButton}
                />
                <CloseButton onClick={handleClose} />
            </div>
            <img
                src={sikkerhetBom}
                srcSet={`${retinaSikkerhetBom} 2x`}
                className={classes.Image}
            />
            <Heading2 margin="none">Lag en ny konto</Heading2>

            <GridContainer spacing="medium" className={classes.GridContainer}>
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
                        variant={isPasswordLongEnough ? undefined : 'error'}
                        feedback={
                            !isPasswordLongEnough
                                ? 'Passord må ha minst 8 tegn.'
                                : undefined
                        }
                        type="password"
                        value={inputs.password}
                        onChange={handleInputsChange}
                        id="password"
                        prepend={<ClosedLockIcon inline />}
                        placeholder="Minst 8 tegn"
                    />
                </GridItem>

                <GridItem small={12}>
                    <TextField
                        label="Gjenta passord"
                        feedback={
                            !isPasswordMatch
                                ? 'Passordene må være like.'
                                : undefined
                        }
                        variant={isPasswordMatch ? undefined : 'error'}
                        type="password"
                        value={inputs.repeatPassword}
                        onChange={handleInputsChange}
                        id="repeatPassword"
                        prepend={<ClosedLockIcon inline />}
                    />
                </GridItem>

                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={handleSubmit}
                        className={classes.ModalSubmit}
                    >
                        Lag konto
                    </PrimaryButton>
                </GridItem>
            </GridContainer>

            <Link
                onClick={(): void => setModalType(ModalType.LoginEmailModal)}
                className={classes.BottomLink}
            >
                Jeg har allerede en konto
            </Link>
        </>
    )
}

export { Signup }
