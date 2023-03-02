import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
import type { User } from 'firebase/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'settings/UserProvider'
import sikkerhetBom from 'assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from 'assets/images/sikkerhet_bom@2x.png'
import { useFormFields } from 'hooks/useFormFields'
import { UserLogin } from 'src/types'
import { TextField } from '@entur/form'
import { GridContainer, GridItem } from '@entur/grid'
import { BackArrowIcon, ClosedLockIcon, EmailIcon } from '@entur/icons'
import { PrimaryButton } from '@entur/button'
import { Heading3, Link } from '@entur/typography'
import { SmallExpandableAlertBox } from '@entur/alert'
import { CloseButton } from '../../../CloseButton'
import { ModalType } from '../login-modal-types'
import classes from '../../AccountModals.module.scss'

function EmailLogin({
    setModalType,
    onDismiss,
}: {
    setModalType: Dispatch<SetStateAction<ModalType>>
    onDismiss: (user?: User) => void
}) {
    const [inputs, handleInputsChange] = useFormFields<UserLogin>({
        email: '',
        password: '',
    })

    const [emailError, setEmailError] = useState<string>()
    const [passwordError, setPasswordError] = useState<string>()
    const [userDeactivatedError, setUserDeactivatedError] = useState<string>()

    const signIn = useCallback((email: string, password: string): void => {
        setEmailError(undefined)
        setPasswordError(undefined)
        setUserDeactivatedError(undefined)

        signInWithEmailAndPassword(auth, email, password).catch((error) => {
            if (password === '') {
                setPasswordError(
                    'Du må skrive inn passordet ditt for å logge inn',
                )
            }
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
    }, [])

    const handleSubmit = useCallback(
        (event: React.FormEvent): void => {
            event.preventDefault()
            signIn(inputs.email, inputs.password)
        },
        [inputs.email, inputs.password, signIn],
    )

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
            <Heading3 margin="none">Logg inn med e-post</Heading3>
            <GridContainer spacing="medium" className={classes.GridContainer}>
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
                        className={classes.ModalSubmit}
                    >
                        Logg inn
                    </PrimaryButton>
                </GridItem>
            </GridContainer>
            <Link
                onClick={(): void => setModalType(ModalType.ResetPasswordModal)}
                className={classes.BottomLink}
            >
                Jeg har glemt passord
            </Link>
        </>
    )
}

export { EmailLogin }
